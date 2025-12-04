#!/usr/bin/env python3
"""
Interactive Movie Poster Cleaner (Batch Mode Supported)
-----------------------------------------------------
1. Single Mode: python manual_cleaner.py "Movie Name"
2. Batch Mode:  python manual_cleaner.py --batch

Controls:
  [Left Click + Drag]: Paint over text
  [SPACE]: Run Traditional Inpainting (Clean, No Text)
  [TAB]:   Run AI Inpainting (Creative, Textures)
  [R]:     Reset to original
  [T]:     Try Again (Re-download different poster)
  [S]:     Save and Next
  [N]:     Next (Skip saving)
  [ESC]:   Quit Batch
"""
import os
import re
import sys
import cv2
import csv
import time
import numpy as np
from pathlib import Path
import requests
from PIL import Image, ImageFilter
import torch
from diffusers import StableDiffusionInpaintPipeline

# Fix Windows encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Global variables
drawing = False
ix, iy = -1, -1
brush_size = 20
mask_layer = None
img_display = None
original_img = None
pipe = None
last_wheel_time = 0
last_wheel_flags = 0

def setup_pipeline():
    global pipe
    if pipe is not None: return pipe

    print("Loading Stable Diffusion Inpainting model...")
    model_id = "runwayml/stable-diffusion-inpainting"
    try:
        # Determine device and dtype
        device = "cpu"
        dtype = torch.float32  # Default to float32 for better compatibility

        if torch.cuda.is_available():
            device = "cuda"
            dtype = torch.float16
            print("    [INFO] CUDA detected, using GPU (CUDA)")
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            device = "mps"
            dtype = torch.float32  # MPS works better with float32
            print("    [INFO] MPS (Metal) detected, using GPU (Apple Silicon/AMD)")
        else:
            print("    [WARNING] No GPU available! Using CPU (this will be slow).")

        pipe = StableDiffusionInpaintPipeline.from_pretrained(
            model_id,
            torch_dtype=dtype,
            safety_checker=None
        )
        pipe = pipe.to(device)
        print(f"    [OK] Model loaded on {device.upper()}")
    except Exception as e:
        print(f"Failed to load AI model: {e}")
        import traceback
        traceback.print_exc()
        return None
    return pipe

def mouse_callback(event, x, y, flags, param):
    global ix, iy, drawing, mask_layer, img_display, brush_size, last_wheel_y

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y
        # Draw initial point
        cv2.circle(mask_layer, (x, y), brush_size, (255, 255, 255), -1)
        cv2.circle(img_display, (x, y), brush_size, (0, 0, 255), -1)

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            # Draw line between previous and current point for smoother drawing
            if ix >= 0 and iy >= 0:
                cv2.line(mask_layer, (ix, iy), (x, y), (255, 255, 255), brush_size * 2)
                cv2.line(img_display, (ix, iy), (x, y), (0, 0, 255), brush_size * 2)
            # Also draw circle at current position
            cv2.circle(mask_layer, (x, y), brush_size, (255, 255, 255), -1)
            cv2.circle(img_display, (x, y), brush_size, (0, 0, 255), -1)
            ix, iy = x, y

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        # Draw final point
        if ix >= 0 and iy >= 0:
            cv2.line(mask_layer, (ix, iy), (x, y), (255, 255, 255), brush_size * 2)
            cv2.line(img_display, (ix, iy), (x, y), (0, 0, 255), brush_size * 2)
        cv2.circle(mask_layer, (x, y), brush_size, (255, 255, 255), -1)
        cv2.circle(img_display, (x, y), brush_size, (0, 0, 255), -1)
        ix, iy = -1, -1

    elif event == cv2.EVENT_MOUSEWHEEL:
        # Check if CTRL is held down
        if flags & cv2.EVENT_FLAG_CTRLKEY:
            global last_wheel_time, last_wheel_flags
            import time

            current_time = time.time()
            # On macOS, OpenCV may encode scroll differently
            # Try multiple methods to detect scroll direction
            wheel_delta = 0

            # Method 1: Extract from high 16 bits (Windows/Linux)
            delta_from_flags = (flags >> 16) & 0xFFFF
            if delta_from_flags > 32768:
                delta_from_flags = delta_from_flags - 65536
            if delta_from_flags != 0:
                wheel_delta = delta_from_flags

            # Method 2: For macOS trackpad, compare flags values over time
            if wheel_delta == 0 and last_wheel_time > 0 and current_time - last_wheel_time < 0.3:
                if flags > last_wheel_flags:
                    wheel_delta = 120  # Scroll up
                elif flags < last_wheel_flags:
                    wheel_delta = -120  # Scroll down

            # Method 3: For macOS, sometimes the y coordinate changes indicate scroll
            # (This is a fallback - OpenCV on macOS is tricky)

            if wheel_delta > 0:
                brush_size = min(brush_size + 2, 200)  # Increase brush size, max 200
                print(f"Brush size: {brush_size}", flush=True)
            elif wheel_delta < 0:
                brush_size = max(brush_size - 2, 5)  # Decrease brush size, min 5
                print(f"Brush size: {brush_size}", flush=True)

            last_wheel_time = current_time
            last_wheel_flags = flags

def get_filename(movie_name):
    name = movie_name.lower()
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'\s+', '-', name)
    return name.strip('-') + ".jpg"

def remove_item_from_csv(category, item_name):
    """Remove an item from the CSV file - only removes exact matches"""
    csv_path = Path(__file__).parent / 'app' / 'The Floor - Categories - Categories + Examples.csv'

    # Create backup first
    backup_path = csv_path.with_suffix('.csv.backup')
    import shutil
    shutil.copy2(csv_path, backup_path)

    # Read all rows
    rows = []
    removed_count = 0
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames

        if not fieldnames or 'Category' not in fieldnames or 'Example' not in fieldnames:
            print(f"  ERROR: CSV file is malformed. Expected 'Category' and 'Example' columns.", flush=True)
            return False

        for row in reader:
            # Filter out any fields not in fieldnames (handle malformed CSV)
            filtered_row = {k: v for k, v in row.items() if k in fieldnames}

            # Ensure all fieldnames are present (fill missing with empty string)
            for field in fieldnames:
                if field not in filtered_row:
                    filtered_row[field] = ''

            # Strip whitespace and compare exactly
            row_category = filtered_row.get('Category', '').strip()
            row_example = filtered_row.get('Example', '').strip()

            # Only skip if BOTH category and example match exactly
            if row_category == category.strip() and row_example == item_name.strip():
                removed_count += 1
                continue
            rows.append(filtered_row)

    if removed_count == 0:
        print(f"  WARNING: No matching row found to delete (Category: '{category}', Example: '{item_name}')", flush=True)
        return False

    if removed_count > 1:
        print(f"  WARNING: Found {removed_count} matching rows! Only expected 1. Not deleting to prevent data loss.", flush=True)
        print(f"  Backup saved to: {backup_path}", flush=True)
        return False

    # Write back to CSV
    try:
        with open(csv_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"  Backup saved to: {backup_path}", flush=True)
        return True
    except Exception as e:
        print(f"  ERROR: Failed to write CSV: {e}", flush=True)
        print(f"  Backup available at: {backup_path}", flush=True)
        # Restore from backup
        try:
            shutil.copy2(backup_path, csv_path)
            print(f"  Restored from backup", flush=True)
        except:
            pass
        return False

def get_clipboard_text():
    """Get text from clipboard - cross-platform"""
    try:
        import subprocess
        if sys.platform == 'darwin':  # macOS
            result = subprocess.run(['pbpaste'], capture_output=True, text=True, timeout=1)
            return result.stdout.strip() if result.returncode == 0 else None
        elif sys.platform == 'win32':  # Windows
            result = subprocess.run(['powershell', '-command', 'Get-Clipboard'], capture_output=True, text=True, timeout=1)
            return result.stdout.strip() if result.returncode == 0 else None
        else:  # Linux
            try:
                result = subprocess.run(['xclip', '-selection', 'clipboard', '-o'], capture_output=True, text=True, timeout=1)
                return result.stdout.strip() if result.returncode == 0 else None
            except:
                try:
                    result = subprocess.run(['xsel', '-b'], capture_output=True, text=True, timeout=1)
                    return result.stdout.strip() if result.returncode == 0 else None
                except:
                    return None
    except:
        return None

def get_text_input(window_name, prompt_text, initial_text=""):
    """Get text input from user using OpenCV window with keyboard input"""
    text = initial_text
    cursor_pos = len(text)
    show_cursor = True
    last_cursor_time = time.time()
    last_paste_check = time.time()

    # Create input window
    input_width = 800
    input_height = 150
    input_img = np.ones((input_height, input_width, 3), dtype=np.uint8) * 240

    input_window = "URL Input"
    cv2.namedWindow(input_window, cv2.WINDOW_NORMAL)
    cv2.setWindowProperty(input_window, cv2.WND_PROP_TOPMOST, 1)
    cv2.resizeWindow(input_window, input_width, input_height)

    while True:
        display_img = input_img.copy()

        # Draw prompt
        cv2.putText(display_img, prompt_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

        # Draw text input box
        cv2.rectangle(display_img, (10, 50), (input_width - 10, 100), (255, 255, 255), 2)
        cv2.rectangle(display_img, (10, 50), (input_width - 10, 100), (200, 200, 200), 1)

        # Draw text (truncate if too long to fit)
        max_chars = 90
        display_text = text if len(text) <= max_chars else "..." + text[-(max_chars-3):]
        if display_text:
            cv2.putText(display_img, display_text, (15, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

        # Draw cursor
        current_time = time.time()
        if current_time - last_cursor_time > 0.5:
            show_cursor = not show_cursor
            last_cursor_time = current_time

        if show_cursor:
            # Calculate cursor position
            text_before_cursor = display_text[:max(0, cursor_pos - (len(text) - len(display_text)) if len(text) > max_chars else cursor_pos)]
            if text_before_cursor:
                text_width = cv2.getTextSize(text_before_cursor, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0][0]
            else:
                text_width = 0
            cursor_x = 15 + text_width
            cv2.line(display_img, (cursor_x, 70), (cursor_x, 95), (0, 0, 0), 2)

        # Draw instructions
        cv2.putText(display_img, "Press ENTER to confirm, ESC to cancel, P to paste, CMD+V also works", (10, 130),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, (100, 100, 100), 1)

        cv2.imshow(input_window, display_img)
        key_code = cv2.waitKey(30)

        # Store previous clipboard to detect changes
        if not hasattr(get_text_input, 'last_clipboard'):
            get_text_input.last_clipboard = ""

        # Periodically check clipboard for changes (for CMD+V detection)
        current_time = time.time()
        if current_time - last_paste_check > 0.05:  # Check clipboard every 50ms
            clipboard_text = get_clipboard_text()
            if clipboard_text and clipboard_text != get_text_input.last_clipboard:
                # Clipboard changed - might be a paste
                get_text_input.last_clipboard = clipboard_text
            last_paste_check = current_time

        key = key_code & 0xFF

        if key == 13 or key == 10:  # ENTER
            cv2.destroyWindow(input_window)
            return text.strip() if text.strip() else None
        elif key == 27:  # ESC
            cv2.destroyWindow(input_window)
            return None
        elif key == 8 or key == 127:  # BACKSPACE
            if cursor_pos > 0:
                text = text[:cursor_pos-1] + text[cursor_pos:]
                cursor_pos -= 1
        elif key == ord('p') or key == ord('P'):  # P for paste
            clipboard_text = get_clipboard_text()
            if clipboard_text:
                text = text[:cursor_pos] + clipboard_text + text[cursor_pos:]
                cursor_pos += len(clipboard_text)
                get_text_input.last_clipboard = clipboard_text
        elif key == ord('v') or key == ord('V'):
            # When 'v' is pressed, check if clipboard has new content (might be CMD+V)
            clipboard_text = get_clipboard_text()
            if clipboard_text and clipboard_text != get_text_input.last_clipboard:
                # Likely a paste - insert clipboard content
                text = text[:cursor_pos] + clipboard_text + text[cursor_pos:]
                cursor_pos += len(clipboard_text)
                get_text_input.last_clipboard = clipboard_text
            elif clipboard_text:
                # Clipboard exists but might be same - still try to paste if it's different from current text
                if clipboard_text not in text or len(clipboard_text) > 10:  # If it's a long URL or not in text, paste it
                    text = text[:cursor_pos] + clipboard_text + text[cursor_pos:]
                    cursor_pos += len(clipboard_text)
                    get_text_input.last_clipboard = clipboard_text
        elif 32 <= key <= 126:  # Printable ASCII characters
            char = chr(key)
            text = text[:cursor_pos] + char + text[cursor_pos:]
            cursor_pos += 1
        elif key == 0:  # Special key, check for arrow keys
            # Handle arrow keys if needed (would need to check waitKey return value differently)
            pass

def load_image_with_alpha(file_path):
    """Load an image, handling transparency by compositing onto white background"""
    img = cv2.imread(str(file_path), cv2.IMREAD_UNCHANGED)
    if img is None:
        return None

    return process_image_with_alpha(img)

def log(msg):
    with open("batch_log.txt", "a", encoding="utf-8") as f:
        f.write(f"{msg}\n")
    print(msg, flush=True)

def search_google_images(query, max_results=25):
    """
    Search Google Images using web scraping
    This is a simpler, more reliable alternative to DuckDuckGo
    """
    try:
        search_url = f"https://www.google.com/search?tbm=isch&q={requests.utils.quote(query)}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        session = requests.Session()
        response = session.get(search_url, headers=headers, timeout=10)

        if response.status_code != 200:
            log(f"  Google Images returned status {response.status_code}")
            return []

        image_urls = []

        # Pattern 1: Look for "ou":"URL" in JSON-like structures (most reliable)
        ou_matches = re.findall(r'"ou":"([^"]+)"', response.text)
        for url in ou_matches:
            # Decode unicode escapes like \u003d -> =
            try:
                if sys.platform == 'win32':
                    import codecs
                    url = codecs.decode(url, 'unicode_escape')
                else:
                    url = url.encode().decode('unicode_escape')
            except:
                pass
            if url.startswith('http') and any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                # Filter out thumbnails and Google's own images
                if 'encrypted-tbn' not in url and 'google.com' not in url and 'gstatic.com' not in url:
                    image_urls.append(url)
                    if len(image_urls) >= max_results:
                        break

        # Pattern 2: Look for direct image URLs if we don't have enough
        if len(image_urls) < max_results:
            img_matches = re.findall(r'https://[^"\s<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^"\s<>]*)?', response.text, re.IGNORECASE)
            for url in img_matches:
                if url not in image_urls:
                    # Filter out thumbnails and Google's own images
                    if 'encrypted-tbn' not in url and 'google.com' not in url and 'gstatic.com' not in url:
                        image_urls.append(url)
                        if len(image_urls) >= max_results:
                            break

        return image_urls[:max_results]

    except Exception as e:
        log(f"  Error searching Google Images: {e}")
        import traceback
        traceback.print_exc()
        return []

def search_and_download(item_name, category="Movies", skip_urls=None):
    log(f"Searching for: {item_name}...")

    # Build query based on category
    if category == "Books":
        query = f"{item_name} book cover iconic classic high resolution"
    elif category == "Movies" or category == "Disney Channel Original Movies" or category == "Rom Coms":
        # Movies, Disney Channel movies, and Rom Coms all use movie poster search
        query = f"{item_name} movie poster iconic theatrical modern"
    elif category == "Reality tv shows":
        # Reality TV shows use TV show poster search (similar to movies)
        query = f"{item_name} TV show poster reality TV iconic modern high resolution"
    elif category == "The Office":
        # The Office category searches for character photos from the TV show
        query = f"{item_name} The Office character photo portrait high resolution"
    elif category == "Harry Potter characters":
        # Harry Potter characters category searches for character photos from the Harry Potter movies
        query = f"{item_name} Harry Potter character photo portrait high resolution"
    elif category == "Superheros":
        # Superheros category searches for superhero character photos/portraits
        query = f"{item_name} superhero character photo portrait high resolution"
    elif category == "Video game characters":
        # Video game characters category searches for video game character photos/portraits
        query = f"{item_name} video game character photo portrait high resolution"
    elif category == "Thanksgiving":
        # Thanksgiving category searches for Thanksgiving-related photos (food, activities, objects)
        query = f"{item_name} Thanksgiving photo high resolution"
    elif category == "Dogs":
        # Dogs category searches for dog breed photos
        query = f"{item_name} dog breed photo high resolution"
    elif category == "Horses":
        # Horses category searches for horse breeds, activities, and equipment
        query = f"{item_name} horse equestrian photo high resolution"
    elif category == "Garage" or category == "Fridge" or category == "Laundry" or category == "Junk drawer":
        # Garage, Fridge, Laundry, and Junk drawer categories search for standalone items on white background
        query = f"{item_name} isolated white background product photo high resolution"
    elif category == "Sports":
        # Sports category searches for action shots
        query = f"{item_name} sports action shot high resolution"
    elif category == "Comedians":
        # Comedians category searches for comedian photos/portraits
        query = f"{item_name} comedian photo portrait high resolution"
    elif category == "Famous People Under 30":
        # Famous People Under 30 category searches for photos/portraits of famous people
        query = f"{item_name} photo portrait high resolution"
    elif category == "Amusement Parks":
        # Amusement Parks category searches for amusement park-related photos (rides, food, people, items)
        query = f"{item_name} amusement park photo high resolution"
    elif category == "Fast food chains":
        # Fast food chains category searches for restaurant logos
        query = f"{item_name} logo fast food restaurant high resolution"
    elif category == "MLB teams":
        # MLB teams category searches for baseball team logos
        query = f"{item_name} MLB baseball team logo high resolution"
    elif category == "States":
        # States category searches for state outline maps
        query = f"{item_name} state outline map USA high resolution"
    elif category == "Holidays":
        # Holidays category searches for photos of people celebrating the holiday (not text/cards)
        query = f"people celebrating {item_name} photo high resolution"
    elif category == "Chicago tourist stuff":
        # Chicago tourist stuff category searches for Chicago tourist attractions and landmarks
        query = f"{item_name} Chicago tourist attraction landmark photo high resolution"
    elif category == "Spirit Halloween Catalogue":
        # Spirit Halloween Catalogue category searches for Halloween costume photos
        query = f"{item_name} Halloween costume photo high resolution"
    elif category == "Airport codes":
        # Airport codes category searches for airport logos or signage
        query = f"{item_name} airport logo code high resolution"
    elif category == "Apps":
        # Apps category searches for app icons/logos
        query = f"{item_name} app icon logo mobile high resolution"
    elif category == "Board games":
        # Board games category searches for board game box covers
        query = f"{item_name} board game box cover high resolution"
    elif category == "Brand slogans":
        # Brand slogans category searches for brand logos or advertisements
        query = f"{item_name} brand logo advertisement high resolution"
    elif category == "Broadway shows":
        # Broadway shows category searches for Broadway show posters
        query = f"{item_name} Broadway show poster musical theater high resolution"
    elif category == "Chicago neighborhoods":
        # Chicago neighborhoods category searches for neighborhood photos
        query = f"{item_name} Chicago neighborhood photo high resolution"
    elif category == "City skylines":
        # City skylines category searches for city skyline photos
        query = f"{item_name} city skyline photo high resolution"
    elif category == "Disney Characters":
        # Disney Characters category searches for Disney character photos
        query = f"{item_name} Disney character photo portrait high resolution"
    elif category == "Fair Foods":
        # Fair Foods category searches for fair food photos
        query = f"{item_name} fair food photo high resolution"
    elif category == "Kitchen gadgets":
        # Kitchen gadgets category searches for kitchen gadget product photos
        query = f"{item_name} kitchen gadget product photo isolated white background high resolution"
    elif category == "Pokemon":
        # Pokemon category searches for Pokemon character art
        query = f"{item_name} Pokemon character art official high resolution"
    elif category == "Pop divas":
        # Pop divas category searches for pop singer photos/portraits
        query = f"{item_name} pop singer photo portrait high resolution"
    elif category == "Taylor Swift Lyrics":
        # Taylor Swift Lyrics category searches for Taylor Swift photos or album art
        query = f"{item_name} Taylor Swift photo album art high resolution"
    else:
        # Generic search for other categories
        query = f"{item_name} {category.lower()} high resolution"

    log("  Querying Google Images...")

    urls = search_google_images(query, max_results=25)

    if not urls:
        log("  No image URLs found from Google Images")
        return None, None

    log(f"  Found {len(urls)} image URLs from Google Images")

    img, url = try_download_urls(urls, skip_urls=skip_urls)

    if img is not None:
        return img, url

    return None, None

def images_are_same(img1, img2, threshold=0.95):
    """Compare two images to see if they're the same (within threshold)"""
    if img1 is None or img2 is None:
        return False
    if img1.shape != img2.shape:
        return False

    # Resize both to same size for comparison
    h, w = min(img1.shape[0], img2.shape[0]), min(img1.shape[1], img2.shape[1])
    img1_resized = cv2.resize(img1[:h, :w], (256, 256))
    img2_resized = cv2.resize(img2[:h, :w], (256, 256))

    # Calculate similarity using histogram comparison
    hist1 = cv2.calcHist([img1_resized], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    hist2 = cv2.calcHist([img2_resized], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])

    similarity = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
    return similarity >= threshold

def process_image_with_alpha(img):
    """Process an image to handle transparency by compositing onto white background"""
    if img is None:
        return None

    # If image has alpha channel (4 channels)
    if len(img.shape) == 3 and img.shape[2] == 4:
        # Extract alpha channel
        alpha = img[:, :, 3] / 255.0
        # Extract BGR channels (OpenCV uses BGR, not RGB)
        bgr = img[:, :, :3]
        # Create white background
        white_bg = np.ones_like(bgr) * 255
        # Composite: result = alpha * bgr + (1 - alpha) * white_bg
        img = (alpha[:, :, np.newaxis] * bgr + (1 - alpha[:, :, np.newaxis]) * white_bg).astype(np.uint8)
    # If image has 3 channels, it's already BGR
    elif len(img.shape) == 3 and img.shape[2] == 3:
        img = img
    elif len(img.shape) == 2:
        # Convert grayscale to BGR
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    return img

def download_from_url(url):
    """Download an image from a single URL"""
    try:
        print(f"Downloading from URL: {url[:60]}...", flush=True)
        resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}, timeout=8)
        if resp.status_code == 200:
            img_array = np.frombuffer(resp.content, np.uint8)
            # Use IMREAD_UNCHANGED to preserve alpha channel
            img = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)
            if img is not None:
                # Process alpha channel if present
                img = process_image_with_alpha(img)
                if img is not None:
                    h, w = img.shape[:2]
                    if h > 300:
                        print(f"Download successful ({w}x{h}).", flush=True)
                        return img, url
                    else:
                        print(f"Image too small ({w}x{h}).", flush=True)
            else:
                print(f"Failed to decode image from URL.", flush=True)
        else:
            print(f"HTTP error {resp.status_code} when downloading from URL.", flush=True)
    except Exception as e:
        print(f"Error downloading from URL: {e}", flush=True)
    return None, None

def try_download_urls(urls, skip_urls=None):
    """Try to download images from a list of URLs, returning the first successful one"""
    if skip_urls is None:
        skip_urls = set()

    for url in urls[:30]:  # Try up to 30 URLs since we're only using one source
        if url in skip_urls:
            continue
        try:
            log(f"  Downloading {url[:60]}...")
            resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}, timeout=8)
            if resp.status_code == 200:
                img_array = np.frombuffer(resp.content, np.uint8)
                # Use IMREAD_UNCHANGED to preserve alpha channel
                img = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)
                if img is not None:
                    # Process alpha channel if present
                    img = process_image_with_alpha(img)
                    if img is not None:
                        h, w = img.shape[:2]
                        if h > 300:
                            log(f"  Download successful ({w}x{h}).")
                            return img, url  # Return both image and URL
                        else:
                            log(f"  Image too small ({w}x{h}). URL: {url}")
                else:
                    log(f"  Failed to decode image from: {url}")
        except Exception as e:
            log(f"  DL Error for {url[:60]}: {e}")
            continue
    return None, None

def run_traditional_inpainting(img_cv, mask_cv):
    print("Running Traditional Inpainting (Telea)...")
    kernel = np.ones((5, 5), np.uint8)
    dilated_mask = cv2.dilate(mask_cv, kernel, iterations=2)
    return cv2.inpaint(img_cv, dilated_mask, 3, cv2.INPAINT_TELEA)

def run_ai_inpainting(img_cv, mask_cv):
    global pipe
    if pipe is None: pipe = setup_pipeline()
    if pipe is None: return img_cv

    print("Running AI Inpainting...")
    img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    pil_mask = Image.fromarray(mask_cv)

    w, h = pil_img.size
    scale = 768 / max(w, h)
    new_w = int(w * scale) - (int(w * scale) % 8)
    new_h = int(h * scale) - (int(h * scale) % 8)

    input_img = pil_img.resize((new_w, new_h), Image.LANCZOS)
    input_mask = pil_mask.resize((new_w, new_h), Image.NEAREST)

    prompt = "clean smooth texture, empty background, material surface, dark shadows, seamless pattern, high quality, 8k"
    negative_prompt = "text, font, typography, letters, words, alphabet, signature, logo, watermark, branding, writing, script, latin, english, characters, blur, distortion, artifacts, low quality, drawing, illustration"

    output = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        image=input_img,
        mask_image=input_mask,
        num_inference_steps=50,
        guidance_scale=12.0,
        strength=0.98
    ).images[0]

    ai_generated = output.resize((w, h), Image.LANCZOS)
    mask_blur = pil_mask.filter(ImageFilter.GaussianBlur(radius=4))
    final_composite = Image.composite(ai_generated, pil_img, mask_blur)

    return cv2.cvtColor(np.array(final_composite), cv2.COLOR_RGB2BGR)

def process_image(image_source, output_path, item_title="Image", category="Movies", from_grid=False):
    global mask_layer, img_display, original_img

    # Track URLs we've already tried for this item
    tried_urls = set()

    # Load logic
    if isinstance(image_source, str) and os.path.exists(image_source):
        original_img = load_image_with_alpha(image_source)
    elif isinstance(image_source, np.ndarray):
        original_img = image_source
    else:
        # Try downloading
        original_img, downloaded_url = search_and_download(image_source, category=category, skip_urls=tried_urls)
        if downloaded_url:
            tried_urls.add(downloaded_url)

    if original_img is None:
        log(f"Could not load {item_title}")
        return False

    h, w = original_img.shape[:2]
    if h > 1000:
        scale = 1000 / h
        original_img = cv2.resize(original_img, (int(w*scale), int(h*scale)))
        h, w = original_img.shape[:2]

    current_img = original_img.copy()
    mask_layer = np.zeros((h, w), dtype=np.uint8)
    img_display = current_img.copy()

    window_name = f"Cleaning: {item_title}"
    cv2.namedWindow(window_name)
    cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
    cv2.setMouseCallback(window_name, mouse_callback)

    global brush_size
    print(f"\n--- {item_title} ---", flush=True)
    controls = "Controls: [Space]=Trad | [Tab]=AI | [S]=Save+Next | [N]=Skip | [R]=Reset | [T]=Try Again | [U]=Load URL"
    if from_grid:
        controls += " | [G]=Back to Grid"
    controls += " | [Esc]=Quit Batch"
    print(controls, flush=True)
    print("Brush: [Ctrl+Scroll] or [+/-]=Adjust size (current: {})".format(brush_size), flush=True)

    action = "next"

    while True:
        cv2.imshow(window_name, img_display)
        key = cv2.waitKey(1) & 0xFF

        if key == 27: # ESC
            action = "quit"
            break
        elif key == ord('n'): # Next (Skip)
            action = "next"
            print("Skipped.")
            break
        elif key == ord('g') and from_grid: # Back to Grid
            action = "grid"
            print("Returning to grid.")
            break
        elif key == ord('r'): # Reset
            current_img = original_img.copy()
            mask_layer = np.zeros((h, w), dtype=np.uint8)
            img_display = current_img.copy()
            print("Reset.")
        elif key == ord('+') or key == ord('='): # Increase brush size
            brush_size = min(brush_size + 2, 200)
            print(f"Brush size: {brush_size}", flush=True)
        elif key == ord('-') or key == ord('_'): # Decrease brush size
            brush_size = max(brush_size - 2, 5)
            print(f"Brush size: {brush_size}", flush=True)
        elif key == ord('t'): # Try Again (Re-download)
            # Determine item type based on category
            if category == "Books":
                item_type = "book cover"
            elif category == "Movies" or category == "Disney Channel Original Movies" or category == "Reality tv shows" or category == "Rom Coms":
                item_type = "poster"
            elif category == "The Office" or category == "Harry Potter characters" or category == "Superheros" or category == "Video game characters":
                item_type = "character photo"
            elif category == "Comedians":
                item_type = "photo"
            elif category == "Famous People Under 30":
                item_type = "photo"
            elif category == "Amusement Parks":
                item_type = "photo"
            elif category == "Fast food chains" or category == "MLB teams":
                item_type = "logo"
            elif category == "States":
                item_type = "state outline"
            elif category == "Holidays":
                item_type = "celebration photo"
            elif category == "Garage" or category == "Fridge" or category == "Laundry" or category == "Junk drawer":
                item_type = "item"
            elif category == "Sports":
                item_type = "action shot"
            elif category == "Chicago tourist stuff":
                item_type = "tourist attraction photo"
            elif category == "Spirit Halloween Catalogue":
                item_type = "Halloween costume photo"
            elif category == "Airport codes":
                item_type = "airport logo"
            elif category == "Apps":
                item_type = "app icon"
            elif category == "Board games":
                item_type = "board game box"
            elif category == "Brand slogans":
                item_type = "brand logo"
            elif category == "Broadway shows":
                item_type = "Broadway poster"
            elif category == "Chicago neighborhoods":
                item_type = "neighborhood photo"
            elif category == "City skylines":
                item_type = "skyline photo"
            elif category == "Disney Characters":
                item_type = "character photo"
            elif category == "Fair Foods":
                item_type = "food photo"
            elif category == "Kitchen gadgets":
                item_type = "item"
            elif category == "Pokemon":
                item_type = "Pokemon character"
            elif category == "Pop divas":
                item_type = "photo"
            elif category == "Taylor Swift Lyrics":
                item_type = "photo"
            else:
                item_type = "image"

            print(f"Trying to download a different {item_type}...", flush=True)
            cv2.putText(img_display, f"Downloading new {item_type}...", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            cv2.imshow(window_name, img_display)
            cv2.waitKey(1)

            new_img, downloaded_url = search_and_download(item_title, category=category, skip_urls=tried_urls)
            if new_img is not None:
                if downloaded_url:
                    tried_urls.add(downloaded_url)
                h_new, w_new = new_img.shape[:2]
                if h_new > 1000:
                    scale = 1000 / h_new
                    new_img = cv2.resize(new_img, (int(w_new*scale), int(h_new*scale)))
                    h_new, w_new = new_img.shape[:2]

                original_img = new_img.copy()
                current_img = original_img.copy()
                h, w = h_new, w_new
                mask_layer = np.zeros((h, w), dtype=np.uint8)
                img_display = current_img.copy()
                print(f"New {item_type} loaded. You can continue editing or try again.")
            else:
                print(f"Failed to download a new {item_type}. Keeping current image.")
        elif key == ord('u'): # Load from URL
            url_input = get_text_input("URL Input", "Enter image URL:", "")

            if url_input:
                window_name = f"Cleaning: {item_title}"
                cv2.namedWindow(window_name)
                cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
                cv2.setMouseCallback(window_name, mouse_callback)

                cv2.putText(img_display, "Downloading from URL...", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
                cv2.imshow(window_name, img_display)
                cv2.waitKey(1)

                new_img, downloaded_url = download_from_url(url_input)
                if new_img is not None:
                    if downloaded_url:
                        tried_urls.add(downloaded_url)
                    h_new, w_new = new_img.shape[:2]
                    if h_new > 1000:
                        scale = 1000 / h_new
                        new_img = cv2.resize(new_img, (int(w_new*scale), int(h_new*scale)))
                        h_new, w_new = new_img.shape[:2]

                    original_img = new_img.copy()
                    current_img = original_img.copy()
                    h, w = h_new, w_new
                    mask_layer = np.zeros((h, w), dtype=np.uint8)
                    img_display = current_img.copy()
                    print("Image loaded from URL. You can continue editing.")
                else:
                    print("Failed to download image from URL. Keeping current image.")
                    window_name = f"Cleaning: {item_title}"
                    cv2.namedWindow(window_name)
                    cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
                    cv2.setMouseCallback(window_name, mouse_callback)
            else:
                window_name = f"Cleaning: {item_title}"
                cv2.namedWindow(window_name)
                cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
                cv2.setMouseCallback(window_name, mouse_callback)
                print("URL input cancelled.")
        elif key == 32: # SPACE (Trad)
            if np.sum(mask_layer) > 0:
                cv2.putText(img_display, "Processing...", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.imshow(window_name, img_display)
                cv2.waitKey(1)
                new_img = run_traditional_inpainting(current_img, mask_layer)
                current_img = new_img
                img_display = current_img.copy()
                mask_layer = np.zeros((h, w), dtype=np.uint8)
                print("Done (Trad).")
        elif key == 9: # TAB (AI)
            if np.sum(mask_layer) > 0:
                cv2.putText(img_display, "Processing AI...", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.imshow(window_name, img_display)
                cv2.waitKey(1)
                new_img = run_ai_inpainting(current_img, mask_layer)
                current_img = new_img
                img_display = current_img.copy()
                mask_layer = np.zeros((h, w), dtype=np.uint8)
                print("Done (AI).")
        elif key == ord('s'): # Save
            output_path.parent.mkdir(parents=True, exist_ok=True)
            try:
                cv2.imwrite(str(output_path), current_img)
                print(f"Saved to {output_path}")
                action = "grid" if from_grid else "next"
            except Exception as e:
                print(f"Save failed: {e}")
            break

    cv2.destroyAllWindows()
    return action

def show_category_menu():
    """Display a menu grid of all categories with image counts"""
    csv_path = Path(__file__).parent / 'app' / 'The Floor - Categories - Categories + Examples.csv'
    categories_data = {}

    print("Loading categories...")
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cat = row['Category']
            if cat not in categories_data:
                categories_data[cat] = []
            categories_data[cat].append(row['Example'])

    categories = sorted(categories_data.keys())
    print(f"Found {len(categories)} categories.", flush=True)

    # Grid settings
    base_thumb_size = 200
    base_padding = 15
    min_cols = 2
    max_cols = 6

    # Window state
    scroll_y = 0
    window_width = 1400
    window_height = 900

    window_name = "Category Menu"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
    cv2.resizeWindow(window_name, window_width, window_height)

    click_action = [None]
    scroll_speed = 50
    last_wheel_time = 0

    def count_category_images(category):
        """Count how many images exist for a category"""
        folder_name = category.lower().replace(' ', '-')
        save_dir = Path(__file__).parent / 'public' / 'images' / folder_name
        if not save_dir.exists():
            return 0

        # Count .jpg, .jpeg, and .png files (case-insensitive)
        jpg_count = len(list(save_dir.glob('*.jpg'))) + len(list(save_dir.glob('*.JPG'))) + len(list(save_dir.glob('*.Jpg')))
        jpeg_count = len(list(save_dir.glob('*.jpeg'))) + len(list(save_dir.glob('*.JPEG'))) + len(list(save_dir.glob('*.Jpeg')))
        png_count = len(list(save_dir.glob('*.png'))) + len(list(save_dir.glob('*.PNG'))) + len(list(save_dir.glob('*.Png')))
        return jpg_count + jpeg_count + png_count

    def get_category_image_count(category):
        """Get cached or calculate image count for category"""
        if not hasattr(get_category_image_count, 'cache'):
            get_category_image_count.cache = {}

        if category not in get_category_image_count.cache:
            get_category_image_count.cache[category] = count_category_images(category)

        return get_category_image_count.cache[category]

    def menu_mouse_callback(event, x, y, flags, param):
        nonlocal scroll_y, last_wheel_time

        if event == cv2.EVENT_LBUTTONDOWN:
            win_w = cv2.getWindowImageRect(window_name)[2]
            win_h = cv2.getWindowImageRect(window_name)[3]

            cols = max(min_cols, min(max_cols, win_w // 300))
            thumb_size = min(base_thumb_size, (win_w - base_padding * (cols + 1)) // cols - 30)
            padding = base_padding
            cell_width = thumb_size + padding * 2
            cell_height = thumb_size + 80 + padding * 2

            start_row = max(0, scroll_y // cell_height - 1)
            visible_rows = (win_h // cell_height) + 2
            end_row = min((len(categories) + cols - 1) // cols, start_row + visible_rows)

            for row in range(start_row, end_row):
                for col in range(cols):
                    idx = row * cols + col
                    if idx >= len(categories):
                        continue

                    rect_x = col * cell_width + padding
                    rect_y = row * cell_height + padding - scroll_y

                    if rect_x <= x <= rect_x + thumb_size and rect_y <= y <= rect_y + thumb_size + 80:
                        category = categories[idx]
                        click_action[0] = category
                        break
                else:
                    continue
                break

        elif event == cv2.EVENT_MOUSEWHEEL:
            current_time = time.time()
            wheel_delta = 0

            delta_from_flags = (flags >> 16) & 0xFFFF
            if delta_from_flags > 32768:
                delta_from_flags = delta_from_flags - 65536
            if delta_from_flags != 0:
                wheel_delta = delta_from_flags

            if wheel_delta == 0:
                last_flags = param.get('last_flags', 0) if isinstance(param, dict) else 0
                if last_wheel_time > 0 and current_time - last_wheel_time < 0.3:
                    if flags > last_flags:
                        wheel_delta = 120
                    elif flags < last_flags:
                        wheel_delta = -120
                if isinstance(param, dict):
                    param['last_flags'] = flags

            if wheel_delta != 0:
                win_rect = cv2.getWindowImageRect(window_name)
                win_w = win_rect[2] if win_rect[2] > 0 else window_width
                win_h = win_rect[3] if win_rect[3] > 0 else window_height
                cols = max(min_cols, min(max_cols, win_w // 300))
                thumb_sz = min(base_thumb_size, (win_w - base_padding * (cols + 1)) // cols - 30)
                cell_height = thumb_sz + 80 + base_padding * 2
                max_scroll = max(0, ((len(categories) + cols - 1) // cols) * cell_height - win_h)

                scroll_amount = wheel_delta * 0.5
                scroll_y = max(0, min(max_scroll, scroll_y - int(scroll_amount)))
                last_wheel_time = current_time

    cv2.setMouseCallback(window_name, menu_mouse_callback, {'last_flags': 0})

    print("\nCategory Menu Controls:", flush=True)
    print("  [Click Category]: Open category grid view", flush=True)
    print("  [Mouse Wheel] or [W/S keys]: Scroll up/down", flush=True)
    print("  [ESC]: Exit", flush=True)

    while True:
        win_rect = cv2.getWindowImageRect(window_name)
        if win_rect[2] > 0 and win_rect[3] > 0:
            window_width = win_rect[2]
            window_height = win_rect[3]

        cols = max(min_cols, min(max_cols, window_width // 300))
        thumb_size = min(base_thumb_size, (window_width - base_padding * (cols + 1)) // cols - 30)
        padding = base_padding
        cell_width = thumb_size + padding * 2
        cell_height = thumb_size + 80 + padding * 2

        max_scroll = max(0, ((len(categories) + cols - 1) // cols) * cell_height - window_height)
        scroll_y = min(scroll_y, max_scroll)

        display_img = np.ones((window_height, window_width, 3), dtype=np.uint8) * 240

        # Render categories
        start_row = max(0, scroll_y // cell_height - 1)
        visible_rows = (window_height // cell_height) + 2
        end_row = min((len(categories) + cols - 1) // cols, start_row + visible_rows)

        for row in range(start_row, end_row):
            for col in range(cols):
                idx = row * cols + col
                if idx >= len(categories):
                    continue

                x = col * cell_width + padding
                y = row * cell_height + padding - scroll_y

                if y + cell_height < 0 or y > window_height:
                    continue

                category = categories[idx]
                item_count = len(categories_data[category])
                image_count = get_category_image_count(category)

                # Draw category box
                cv2.rectangle(display_img, (x, y), (x + thumb_size, y + thumb_size), (150, 150, 150), 2)

                # Draw category name (truncate if too long)
                max_name_len = 20
                cat_display = category[:max_name_len] + "..." if len(category) > max_name_len else category
                cv2.putText(display_img, cat_display, (x, y + thumb_size + 15),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)

                # Draw item count and image count
                items_text = f"{item_count} items"
                cv2.putText(display_img, items_text, (x, y + thumb_size + 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.3, (100, 100, 100), 1)

                # Draw image count with color coding
                if image_count == 0:
                    img_color = (0, 0, 255)  # Red - no images
                    img_text = f"0/{item_count} images"
                elif image_count < item_count:
                    img_color = (0, 165, 255)  # Orange - partial
                    img_text = f"{image_count}/{item_count} images"
                else:
                    img_color = (0, 200, 0)  # Green - complete
                    img_text = f"{image_count}/{item_count} images"

                cv2.putText(display_img, img_text, (x, y + thumb_size + 45),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.3, img_color, 1)

                # Draw progress bar
                if item_count > 0:
                    progress = image_count / item_count
                    bar_width = thumb_size
                    bar_height = 4
                    bar_x = x
                    bar_y = y + thumb_size + 55

                    # Background
                    cv2.rectangle(display_img, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (200, 200, 200), -1)
                    # Progress
                    if progress > 0:
                        progress_width = int(bar_width * progress)
                        cv2.rectangle(display_img, (bar_x, bar_y), (bar_x + progress_width, bar_y + bar_height), img_color, -1)

        cv2.imshow(window_name, display_img)
        key = cv2.waitKey(1) & 0xFF

        if key == 27:  # ESC
            break

        # Keyboard scrolling
        if key == ord('w') or key == ord('W'):
            scroll_y = max(0, scroll_y - 100)
        elif key == ord('s') or key == ord('S'):
            scroll_y = min(max_scroll, scroll_y + 100)

        # Handle click action
        if click_action[0] is not None:
            selected_category = click_action[0]
            click_action[0] = None

            print(f"\nOpening category: {selected_category}", flush=True)
            cv2.destroyAllWindows()
            result = show_grid_view(selected_category, initial_scroll_y=0)

            if result == "quit":
                break
            # If result is "menu" or anything else, show menu again
            # Recreate window
            window_name = "Category Menu"
            cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
            cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
            cv2.resizeWindow(window_name, window_width, window_height)
            cv2.setMouseCallback(window_name, menu_mouse_callback, {'last_flags': 0})
            # Clear cache to refresh counts
            if hasattr(get_category_image_count, 'cache'):
                get_category_image_count.cache.clear()

    cv2.destroyAllWindows()
    return "quit"

def show_grid_view(category="Movies", initial_scroll_y=0):
    """Display a scrollable, resizable grid view of all images in a category with Save/Edit/New Image options"""
    csv_path = Path(__file__).parent / 'app' / 'The Floor - Categories - Categories + Examples.csv'
    items = []

    print(f"Reading {category} list...")
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Category'] == category:
                items.append(row['Example'])

    print(f"Found {len(items)} {category.lower()}.", flush=True)

    # Convert category name to folder name (kebab-case)
    folder_name = category.lower().replace(' ', '-')
    save_dir = Path(__file__).parent / 'public' / 'images' / folder_name
    save_dir.mkdir(parents=True, exist_ok=True)

    # Grid settings - will be adjusted based on window size
    base_thumb_size = 180
    base_padding = 10
    min_cols = 3
    max_cols = 8

    # Scroll and window state
    scroll_y = initial_scroll_y
    window_width = 1200
    window_height = 800
    thumb_cache = {}  # Cache loaded thumbnails: {item_index: (thumb_img, img_dims, has_file, item, file_path)}

    # Display grid
    window_name = f"Grid View: {category}"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.setWindowProperty(window_name, cv2.WND_PROP_TOPMOST, 1)
    cv2.resizeWindow(window_name, window_width, window_height)

    # Use lists to store state (workaround for callback limitations)
    click_action = [None]
    scroll_speed = 50
    last_wheel_time = 0

    def load_item_data(idx):
        """Load or get cached data for an item"""
        if idx in thumb_cache:
            return thumb_cache[idx]

        if idx >= len(items):
            return None

        item = items[idx]
        filename = get_filename(item)
        file_path = save_dir / filename

        # Check for .jpg, .jpeg, and .png extensions (case-insensitive)
        if not file_path.exists():
            base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
            # Try different extensions
            for ext in ['.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.Jpg', '.Jpeg', '.Png']:
                alt_filename = base_name + ext
                alt_path = save_dir / alt_filename
                if alt_path.exists():
                    file_path = alt_path
                    filename = alt_filename
                    break

        # Fallback for "The X" -> "x.jpg" or "x.jpeg" or "x.png" (case-insensitive)
        if not file_path.exists() and filename.startswith("the-"):
            alt_filename = filename[4:]
            alt_path = save_dir / alt_filename
            if alt_path.exists():
                file_path = alt_path
            else:
                # Try with different extensions (case-insensitive)
                base_name = alt_filename.rsplit('.', 1)[0] if '.' in alt_filename else alt_filename
                for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.Jpg', '.Jpeg', '.Png']:
                    alt_file = base_name + ext
                    alt_path = save_dir / alt_file
                    if alt_path.exists():
                        file_path = alt_path
                        break

        has_file = file_path.exists()
        img = None
        img_dims = "N/A"

        if has_file:
            # Load existing file
            img = load_image_with_alpha(file_path)
            if img is not None:
                h, w = img.shape[:2]
                img_dims = f"{w}x{h}"

        # Cache the result (even if None)
        thumb_cache[idx] = (img, img_dims, has_file, item, file_path)
        return thumb_cache[idx]

    def render_grid(display_img, cols, thumb_size, cell_width, cell_height, padding, view_height):
        """Render visible items in the grid"""
        # Clear display
        display_img[:] = 240

        # Calculate visible rows
        start_row = max(0, scroll_y // cell_height - 1)
        visible_rows = (view_height // cell_height) + 2
        end_row = min((len(items) + cols - 1) // cols, start_row + visible_rows)

        item_rects = []

        for row in range(start_row, end_row):
            for col in range(cols):
                idx = row * cols + col
                if idx >= len(items):
                    continue

                x = col * cell_width + padding
                y = row * cell_height + padding - scroll_y

                # Only render if visible
                if y + cell_height < 0 or y > view_height:
                    continue

                # Load item data
                item_data = load_item_data(idx)
                if item_data is None:
                    continue

                img, img_dims, has_file, item, file_path = item_data

                # Create thumbnail if we have an image
                if img is not None:
                    h, w = img.shape[:2]
                    scale = thumb_size / max(h, w)
                    new_w = int(w * scale)
                    new_h = int(h * scale)
                    thumb = cv2.resize(img, (new_w, new_h))

                    # Center thumbnail in cell
                    thumb_x = x + (thumb_size - new_w) // 2
                    thumb_y = y + (thumb_size - new_h) // 2

                    # Place thumbnail
                    if 0 <= thumb_y < view_height and 0 <= thumb_y + new_h < view_height:
                        display_img[thumb_y:thumb_y+new_h, thumb_x:thumb_x+new_w] = thumb

                    # Draw border
                    cv2.rectangle(display_img, (x, y), (x + thumb_size, y + thumb_size), (100, 100, 100), 2)
                else:
                    # Draw placeholder
                    cv2.rectangle(display_img, (x, y), (x + thumb_size, y + thumb_size), (150, 150, 150), 2)
                    cv2.putText(display_img, "No image", (x + 20, y + thumb_size // 2),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 150, 150), 1)

                # Draw item name (truncate if too long)
                max_name_len = min(25, int(thumb_size / 8))
                item_display = item[:max_name_len] + "..." if len(item) > max_name_len else item
                cv2.putText(display_img, item_display, (x, y + thumb_size + 12),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 0), 1)

                # Draw dimensions - check if either dimension is below 600
                dim_color = (100, 100, 100)  # Default gray
                if img_dims != "N/A":
                    try:
                        # Parse dimensions (format: "WxH")
                        parts = img_dims.split('x')
                        if len(parts) == 2:
                            w, h = int(parts[0]), int(parts[1])
                            if w < 600 or h < 600:
                                dim_color = (0, 0, 255)  # Red if either dimension is below 600
                    except (ValueError, IndexError):
                        pass  # Keep default color if parsing fails

                cv2.putText(display_img, img_dims, (x, y + thumb_size + 25),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.3, dim_color, 1)

                # Draw X button in top-right corner
                x_button_size = 20
                x_button_x = x + thumb_size - x_button_size - 2
                x_button_y = y + 2
                cv2.rectangle(display_img, (x_button_x, x_button_y), (x + thumb_size - 2, x_button_y + x_button_size), (0, 0, 255), -1)
                cv2.putText(display_img, "X", (x_button_x + 6, x_button_y + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

                # Draw buttons - always show Edit button
                button_y = y + thumb_size + 32
                button_height = 18
                if has_file:
                    # Two buttons: New Image and Edit
                    button_width = (thumb_size - 5) // 2
                    # New Image button (orange)
                    cv2.rectangle(display_img, (x, button_y), (x + button_width, button_y + button_height), (200, 100, 0), -1)
                    cv2.putText(display_img, "NEW", (x + button_width // 2 - 15, button_y + 13),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
                    # Edit button (green)
                    cv2.rectangle(display_img, (x + button_width + 5, button_y), (x + thumb_size, button_y + button_height), (0, 200, 0), -1)
                    cv2.putText(display_img, "EDIT", (x + button_width + 5 + button_width // 2 - 15, button_y + 13),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
                else:
                    # Two buttons: Save and Edit (even when no file exists)
                    button_width = (thumb_size - 5) // 2
                    # Save button (red)
                    cv2.rectangle(display_img, (x, button_y), (x + button_width, button_y + button_height), (200, 0, 0), -1)
                    cv2.putText(display_img, "SAVE", (x + button_width // 2 - 18, button_y + 13),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
                    # Edit button (green) - will download first if needed
                    cv2.rectangle(display_img, (x + button_width + 5, button_y), (x + thumb_size, button_y + button_height), (0, 200, 0), -1)
                    cv2.putText(display_img, "EDIT", (x + button_width + 5 + button_width // 2 - 15, button_y + 13),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

                # Store rect for click detection (including X button)
                item_rects.append((idx, x, y, thumb_size, thumb_size + 50, has_file, item, file_path, button_y, button_height, button_width if has_file else thumb_size, x_button_x, x_button_y, x_button_size))

        return item_rects

    def grid_mouse_callback(event, x, y, flags, param):
        nonlocal scroll_y, last_wheel_time

        if event == cv2.EVENT_LBUTTONDOWN:
            # Get current window size and calculate grid
            win_w = cv2.getWindowImageRect(window_name)[2]
            win_h = cv2.getWindowImageRect(window_name)[3]

            cols = max(min_cols, min(max_cols, win_w // 250))
            thumb_size = min(base_thumb_size, (win_w - base_padding * (cols + 1)) // cols - 20)
            padding = base_padding
            cell_width = thumb_size + padding * 2
            cell_height = thumb_size + 50 + padding * 2

            # Find which item was clicked
            start_row = max(0, scroll_y // cell_height - 1)
            visible_rows = (win_h // cell_height) + 2
            end_row = min((len(items) + cols - 1) // cols, start_row + visible_rows)

            for row in range(start_row, end_row):
                for col in range(cols):
                    idx = row * cols + col
                    if idx >= len(items):
                        continue

                    rect_x = col * cell_width + padding
                    rect_y = row * cell_height + padding - scroll_y

                    if rect_x <= x <= rect_x + thumb_size and rect_y <= y <= rect_y + thumb_size + 50:
                        item_data = load_item_data(idx)
                        if item_data is None:
                            continue
                        _, _, has_file, item, file_path = item_data

                        # Check if clicked on X button (top-right corner)
                        x_button_size = 20
                        x_button_x = rect_x + thumb_size - x_button_size - 2
                        x_button_y = rect_y + 2
                        if x_button_x <= x <= rect_x + thumb_size - 2 and x_button_y <= y <= x_button_y + x_button_size:
                            click_action[0] = ("delete", item, file_path)
                            break

                        # Check if clicked on button area
                        button_y = rect_y + thumb_size + 32
                        if button_y <= y <= button_y + 18:
                            button_width = (thumb_size - 5) // 2
                            if has_file:
                                if x < rect_x + button_width:
                                    # New Image button
                                    click_action[0] = ("new", item, file_path)
                                else:
                                    # Edit button
                                    click_action[0] = ("edit", item, file_path)
                            else:
                                # Two buttons: Save and Edit
                                if x < rect_x + button_width:
                                    # Save button
                                    click_action[0] = ("save", item, file_path)
                                else:
                                    # Edit button (will download first if needed)
                                    click_action[0] = ("edit", item, file_path)
                        break
                else:
                    continue
                break

        elif event == cv2.EVENT_MOUSEWHEEL:
            # Handle scrolling - improved for macOS trackpad
            current_time = time.time()
            wheel_delta = 0

            # Method 1: Extract from high 16 bits (Windows/Linux)
            delta_from_flags = (flags >> 16) & 0xFFFF
            if delta_from_flags > 32768:
                delta_from_flags = delta_from_flags - 65536
            if delta_from_flags != 0:
                wheel_delta = delta_from_flags

            # Method 2: For macOS trackpad, compare flags values over time
            if wheel_delta == 0:
                last_flags = param.get('last_flags', 0) if isinstance(param, dict) else 0
                if last_wheel_time > 0 and current_time - last_wheel_time < 0.3:
                    if flags > last_flags:
                        wheel_delta = 120  # Scroll up
                    elif flags < last_flags:
                        wheel_delta = -120  # Scroll down
                if isinstance(param, dict):
                    param['last_flags'] = flags

            if wheel_delta != 0:
                # Calculate max scroll
                win_rect = cv2.getWindowImageRect(window_name)
                win_w = win_rect[2] if win_rect[2] > 0 else window_width
                win_h = win_rect[3] if win_rect[3] > 0 else window_height
                cols = max(min_cols, min(max_cols, win_w // 250))
                thumb_sz = min(base_thumb_size, (win_w - base_padding * (cols + 1)) // cols - 20)
                cell_height = thumb_sz + 50 + base_padding * 2
                max_scroll = max(0, ((len(items) + cols - 1) // cols) * cell_height - win_h)

                # Scale scroll speed for smoother trackpad experience
                scroll_amount = wheel_delta * 0.5  # Make scrolling smoother
                scroll_y = max(0, min(max_scroll, scroll_y - int(scroll_amount)))
                last_wheel_time = current_time

    cv2.setMouseCallback(window_name, grid_mouse_callback, {'last_flags': 0})

    print("\nGrid View Controls:", flush=True)
    print("  [Click SAVE]: Download and save new image", flush=True)
    print("  [Click NEW]: Download new image for existing file", flush=True)
    print("  [Click EDIT]: Edit existing image", flush=True)
    print("  [Click X]: Delete item and remove from CSV", flush=True)
    print("  [Mouse Wheel] or [W/S keys]: Scroll up/down", flush=True)
    print("  [M]: Return to category menu", flush=True)
    print("  [ESC]: Exit grid view", flush=True)
    print("  [R]: Refresh grid (re-download missing images)", flush=True)

    # Initial render
    cols = max(min_cols, min(max_cols, window_width // 250))
    thumb_size = min(base_thumb_size, (window_width - base_padding * (cols + 1)) // cols - 20)
    padding = base_padding
    cell_width = thumb_size + padding * 2
    cell_height = thumb_size + 50 + padding * 2

    while True:
        # Get current window size
        win_rect = cv2.getWindowImageRect(window_name)
        if win_rect[2] > 0 and win_rect[3] > 0:
            window_width = win_rect[2]
            window_height = win_rect[3]

        # Recalculate grid based on window size
        cols = max(min_cols, min(max_cols, window_width // 250))
        thumb_size = min(base_thumb_size, (window_width - base_padding * (cols + 1)) // cols - 20)
        cell_width = thumb_size + padding * 2
        cell_height = thumb_size + 50 + padding * 2

        # Calculate max scroll
        max_scroll = max(0, ((len(items) + cols - 1) // cols) * cell_height - window_height)
        scroll_y = min(scroll_y, max_scroll)

        # Create display image
        display_img = np.ones((window_height, window_width, 3), dtype=np.uint8) * 240

        # Render grid
        item_rects = render_grid(display_img, cols, thumb_size, cell_width, cell_height, padding, window_height)

        cv2.imshow(window_name, display_img)
        key = cv2.waitKey(1) & 0xFF

        if key == 27:  # ESC
            break

        # Return to menu
        if key == ord('m') or key == ord('M'):
            cv2.destroyAllWindows()
            return "menu"

        # Keyboard scrolling (for trackpad users) - use W/S keys
        if key == ord('w') or key == ord('W'):
            scroll_y = max(0, scroll_y - 100)
        elif key == ord('s') or key == ord('S'):
            scroll_y = min(max_scroll, scroll_y + 100)

        # Handle click action
        if click_action[0] is not None:
            action_type, item, file_path = click_action[0]
            click_action[0] = None

            if action_type == "edit":
                # Edit mode
                print(f"\nEditing: {item}", flush=True)
                # Save current scroll position
                current_scroll = scroll_y

                # If file doesn't exist, download it first
                if not file_path.exists():
                    print(f"  File doesn't exist, downloading first...", flush=True)
                    img, _ = search_and_download(item, category=category)
                    if img is not None:
                        file_path.parent.mkdir(parents=True, exist_ok=True)
                        try:
                            cv2.imwrite(str(file_path), img)
                            print(f"  Downloaded and saved to {file_path}", flush=True)
                            # Clear cache for this item
                            for idx in range(len(items)):
                                if items[idx] == item:
                                    if idx in thumb_cache:
                                        del thumb_cache[idx]
                                    break
                        except Exception as e:
                            print(f"  Failed to save downloaded image: {e}", flush=True)
                            continue
                    else:
                        print(f"  Failed to download image for editing", flush=True)
                        continue

                cv2.destroyAllWindows()
                action = process_image(str(file_path), file_path, item_title=item, category=category, from_grid=True)
                if action == "quit":
                    return "quit"
                elif action == "grid" or action == "menu":
                    result = show_grid_view(category, initial_scroll_y=current_scroll)
                    if result == "menu":
                        return "menu"
                    return result
                return show_grid_view(category, initial_scroll_y=current_scroll)
            elif action_type == "new":
                # Download new image (different from current)
                print(f"\nDownloading new image for: {item}", flush=True)
                # Save current scroll position
                current_scroll = scroll_y

                # Load current image for comparison
                current_img = None
                if file_path.exists():
                    current_img = load_image_with_alpha(file_path)

                # Build search query once
                if category == "Books":
                    query = f"{item} book cover iconic classic high resolution"
                elif category == "Movies" or category == "Disney Channel Original Movies" or category == "Rom Coms":
                    query = f"{item} movie poster iconic theatrical modern"
                elif category == "Reality tv shows":
                    query = f"{item} TV show poster reality TV iconic modern high resolution"
                elif category == "The Office":
                    query = f"{item} The Office character photo portrait high resolution"
                elif category == "Harry Potter characters":
                    query = f"{item} Harry Potter character photo portrait high resolution"
                elif category == "Superheros":
                    query = f"{item} superhero character photo portrait high resolution"
                elif category == "Video game characters":
                    query = f"{item} video game character photo portrait high resolution"
                elif category == "Thanksgiving":
                    query = f"{item} Thanksgiving photo high resolution"
                elif category == "Dogs":
                    query = f"{item} dog breed photo high resolution"
                elif category == "Horses":
                    query = f"{item} horse equestrian photo high resolution"
                elif category == "Garage" or category == "Fridge" or category == "Laundry" or category == "Junk drawer":
                    query = f"{item} isolated white background product photo high resolution"
                elif category == "Sports":
                    query = f"{item} sports action shot high resolution"
                elif category == "Comedians":
                    query = f"{item} comedian photo portrait high resolution"
                elif category == "Famous People Under 30":
                    query = f"{item} photo portrait high resolution"
                elif category == "Amusement Parks":
                    query = f"{item} amusement park photo high resolution"
                elif category == "Fast food chains":
                    query = f"{item} logo fast food restaurant high resolution"
                elif category == "MLB teams":
                    query = f"{item} MLB baseball team logo high resolution"
                elif category == "States":
                    query = f"{item} state outline map USA high resolution"
                elif category == "Holidays":
                    query = f"people celebrating {item} photo high resolution"
                elif category == "Chicago tourist stuff":
                    query = f"{item} Chicago tourist attraction landmark photo high resolution"
                elif category == "Spirit Halloween Catalogue":
                    query = f"{item} Halloween costume photo high resolution"
                elif category == "Airport codes":
                    query = f"{item} airport logo code high resolution"
                elif category == "Apps":
                    query = f"{item} app icon logo mobile high resolution"
                elif category == "Board games":
                    query = f"{item} board game box cover high resolution"
                elif category == "Brand slogans":
                    query = f"{item} brand logo advertisement high resolution"
                elif category == "Broadway shows":
                    query = f"{item} Broadway show poster musical theater high resolution"
                elif category == "Chicago neighborhoods":
                    query = f"{item} Chicago neighborhood photo high resolution"
                elif category == "City skylines":
                    query = f"{item} city skyline daytime photo high resolution"
                elif category == "Disney Characters":
                    query = f"{item} Disney character photo portrait high resolution"
                elif category == "Fair Foods":
                    query = f"{item} fair food photo high resolution"
                elif category == "Kitchen gadgets":
                    query = f"{item} kitchen gadget product photo isolated white background high resolution"
                elif category == "Pokemon":
                    query = f"{item} Pokemon character art official high resolution"
                elif category == "Pop divas":
                    query = f"{item} pop singer photo portrait high resolution"
                elif category == "Taylor Swift Lyrics":
                    query = f"{item} Taylor Swift photo album art high resolution"
                else:
                    query = f"{item} {category.lower()} high resolution"

                # Search once to get all URLs
                print(f"  Searching for images...", flush=True)
                urls = search_google_images(query, max_results=50)  # Get more URLs

                if not urls:
                    print(f"  No image URLs found", flush=True)
                    continue

                print(f"  Found {len(urls)} image URLs, trying to find different image...", flush=True)

                # Try each URL until we find a different image
                new_img = None
                tried_urls = set()

                for url_idx, url in enumerate(urls):
                    if url in tried_urls:
                        continue

                    print(f"  Trying URL {url_idx + 1}/{len(urls)}...", flush=True)
                    img, downloaded_url = download_from_url(url)

                    if img is None:
                        continue

                    tried_urls.add(url)
                    if downloaded_url and downloaded_url != url:
                        tried_urls.add(downloaded_url)

                    # If we have a current image, compare
                    if current_img is not None:
                        if not images_are_same(current_img, img):
                            new_img = img
                            print(f"  Found different image!", flush=True)
                            break
                        else:
                            print(f"  Image is the same, trying next...", flush=True)
                    else:
                        # No current image, use this one
                        new_img = img
                        break

                if new_img is not None:
                    output_path = file_path
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    try:
                        cv2.imwrite(str(output_path), new_img)
                        print(f"Saved new image to {output_path}", flush=True)
                        # Clear cache for this item
                        for idx in range(len(items)):
                            if items[idx] == item:
                                if idx in thumb_cache:
                                    del thumb_cache[idx]
                                break
                        result = show_grid_view(category, initial_scroll_y=current_scroll)
                        if result == "menu":
                            return "menu"
                        return result
                    except Exception as e:
                        print(f"Save failed: {e}", flush=True)
                else:
                    print(f"Failed to download a different image for {item} after trying {len(urls)} URLs", flush=True)
            elif action_type == "save":
                # Save mode - need to download first
                print(f"\nDownloading and saving: {item}", flush=True)
                # Save current scroll position
                current_scroll = scroll_y
                img, _ = search_and_download(item, category=category)
                if img is not None:
                    output_path = file_path
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    try:
                        cv2.imwrite(str(output_path), img)
                        print(f"Saved to {output_path}", flush=True)
                        # Clear cache
                        for idx in range(len(items)):
                            if items[idx] == item:
                                if idx in thumb_cache:
                                    del thumb_cache[idx]
                                break
                        result = show_grid_view(category, initial_scroll_y=current_scroll)
                        if result == "menu":
                            return "menu"
                        return result
                    except Exception as e:
                        print(f"Save failed: {e}", flush=True)
                else:
                    print(f"Failed to download image for {item}", flush=True)
            elif action_type == "delete":
                # Delete item - remove from CSV and delete image file
                print(f"\nDeleting: {item}", flush=True)
                current_scroll = scroll_y

                # Delete image file if it exists
                if file_path.exists():
                    try:
                        file_path.unlink()
                        print(f"  Deleted image file: {file_path.name}", flush=True)
                    except Exception as e:
                        print(f"  Failed to delete image file: {e}", flush=True)

                # Remove from CSV
                try:
                    success = remove_item_from_csv(category, item)
                    if success:
                        print(f"  Removed {item} from CSV", flush=True)
                    else:
                        print(f"  Did not remove from CSV (see warnings above)", flush=True)
                        continue  # Don't reload if deletion failed
                except Exception as e:
                    print(f"  Failed to remove from CSV: {e}", flush=True)
                    import traceback
                    traceback.print_exc()
                    continue  # Don't reload if deletion failed

                # Reload items from CSV
                items = []
                with open(csv_path, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        if row['Category'] == category:
                            items.append(row['Example'])

                # Clear cache
                thumb_cache.clear()
                print(f"  Refreshed grid. {len(items)} items remaining.", flush=True)

        if key == ord('r'):  # Refresh
            print("Refreshing grid...", flush=True)
            current_scroll = scroll_y
            thumb_cache.clear()
            cv2.destroyAllWindows()
            result = show_grid_view(category, initial_scroll_y=current_scroll)
            if result == "menu":
                return "menu"
            return result

    cv2.destroyAllWindows()
    return "menu"  # Return to menu when exiting grid view

def run_batch_mode(category="Movies", amount_to_process=2, replace=False):
    csv_path = Path(__file__).parent / 'app' / 'The Floor - Categories - Categories + Examples.csv'
    items = []

    print(f"Reading {category} list...")
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Category'] == category:
                items.append(row['Example'])

    print(f"Found {len(items)} {category.lower()}.", flush=True)
    if replace:
        print("Replace mode: Will process existing files for re-editing.", flush=True)

    # Convert category name to folder name (kebab-case)
    folder_name = category.lower().replace(' ', '-')
    save_dir = Path(__file__).parent / 'public' / 'images' / folder_name
    save_dir.mkdir(parents=True, exist_ok=True)

    count_processed = 0

    for i, item in enumerate(items):
        if count_processed >= amount_to_process:
            print(f"Batch limit of {amount_to_process} reached. Stopping.", flush=True)
            break

        print(f"\n[{i+1}/{len(items)}] Preparing: {item}", flush=True)
        filename = get_filename(item)
        file_path = save_dir / filename

        # Check for .jpg, .jpeg, and .png extensions (case-insensitive)
        if not file_path.exists():
            base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
            # Try different extensions
            for ext in ['.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.Jpg', '.Jpeg', '.Png']:
                alt_filename = base_name + ext
                alt_path = save_dir / alt_filename
                if alt_path.exists():
                    file_path = alt_path
                    filename = alt_filename
                    print(f"  Found alternative local file: {alt_filename}", flush=True)
                    break

        # Fallback for "The X" -> "x.jpg" or "x.jpeg" or "x.png" (case-insensitive)
        if not file_path.exists() and filename.startswith("the-"):
            alt_filename = filename[4:] # Remove "the-"
            alt_path = save_dir / alt_filename
            if alt_path.exists():
                print(f"  Found alternative local file: {alt_filename}", flush=True)
                file_path = alt_path
            else:
                # Try with different extensions (case-insensitive)
                base_name = alt_filename.rsplit('.', 1)[0] if '.' in alt_filename else alt_filename
                for ext in ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.Jpg', '.Jpeg', '.Png']:
                    alt_file = base_name + ext
                    alt_path = save_dir / alt_file
                    if alt_path.exists():
                        print(f"  Found alternative local file: {alt_file}", flush=True)
                        file_path = alt_path
                        break

        # SKIP if file already exists (unless in replace mode)
        if file_path.exists() and not replace:
            print(f"  Skipping {item} (already exists at {file_path.name})", flush=True)
            continue

        count_processed += 1

        # In replace mode, if file exists, load it for editing; otherwise search for new one
        # In normal mode, always search for new one (file doesn't exist at this point)
        if replace and file_path.exists():
            print(f"  Loading existing file for re-editing: {file_path.name}", flush=True)
            source = str(file_path)
        else:
            source = item
            # Add delay before search to avoid rate limiting
            time.sleep(2)

        try:
            action = process_image(source, file_path, item_title=item, category=category)

            if action == "quit":
                print("Batch processing stopped by user.", flush=True)
                break
            elif action == False:
                print(f"Skipping {item} due to load error.", flush=True)

        except Exception as e:
            print(f"Error processing {item}: {e}", flush=True)
            import traceback
            traceback.print_exc()

        time.sleep(1)

    print("Batch run finished.", flush=True)

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--grid":
        # Grid view mode: --grid <category>
        if len(sys.argv) < 3:
            print("Usage: python manual_cleaner.py --grid <category>")
            print("Example: python manual_cleaner.py --grid Books")
            return

        category = sys.argv[2]
        result = show_grid_view(category)
        if result == "menu":
            show_category_menu()
    elif len(sys.argv) > 1 and sys.argv[1] == "--batch":
        # Parse arguments: --batch <category> [amount] [--replace]
        if len(sys.argv) < 3:
            print("Usage: python manual_cleaner.py --batch <category> [amount] [--replace]")
            print("Example: python manual_cleaner.py --batch Books 2")
            return

        category = sys.argv[2]
        amount_to_process = 2
        replace = False

        # Parse arguments - look for amount and --replace flag
        for arg in sys.argv[3:]:
            if arg == "--replace":
                replace = True
            elif arg.isdigit():
                amount_to_process = int(arg)

        run_batch_mode(category, amount_to_process, replace)
    elif len(sys.argv) > 1:
        # Single mode: python manual_cleaner.py "Item Name" [category]
        input_arg = sys.argv[1]
        category = sys.argv[2] if len(sys.argv) > 2 else "Movies"

        # Convert category name to folder name
        folder_name = category.lower().replace(' ', '-')
        save_dir = Path(__file__).parent / 'public' / 'images' / folder_name
        save_dir.mkdir(parents=True, exist_ok=True)

        if os.path.exists(input_arg):
            name = Path(input_arg).stem
            if "_cleaned" in name: name = name.replace("_cleaned", "")
            output_path = save_dir / f"{name}.jpg"
            process_image(input_arg, output_path, item_title=name, category=category)
        else:
            # Name or URL
            name = "downloaded"
            if not input_arg.startswith("http"):
                name = get_filename(input_arg).replace(".jpg", "")

            output_path = save_dir / f"{name}.jpg"
            process_image(input_arg, output_path, item_title=input_arg, category=category)
    else:
        # Default: Show category menu
        show_category_menu()


if __name__ == "__main__":
    main()
