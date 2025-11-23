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
        pipe = StableDiffusionInpaintPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16,
            safety_checker=None
        )
        if torch.cuda.is_available():
            pipe = pipe.to("cuda")
            print("    [OK] Model loaded on GPU (CUDA)")
        else:
            print("    [WARNING] CUDA not available! Using CPU.")
            pipe = pipe.to("cpu")
    except Exception as e:
        print(f"Failed to load AI model: {e}")
        return None
    return pipe

def mouse_callback(event, x, y, flags, param):
    global ix, iy, drawing, mask_layer, img_display, brush_size, last_wheel_y

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            cv2.circle(mask_layer, (x, y), brush_size, (255, 255, 255), -1)
            cv2.circle(img_display, (x, y), brush_size, (0, 0, 255), -1)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        cv2.circle(mask_layer, (x, y), brush_size, (255, 255, 255), -1)
        cv2.circle(img_display, (x, y), brush_size, (0, 0, 255), -1)

    elif event == cv2.EVENT_MOUSEWHEEL:
        # Check if CTRL is held down
        if flags & cv2.EVENT_FLAG_CTRLKEY:
            global last_wheel_time, last_wheel_flags
            import time

            current_time = time.time()
            # On Windows, OpenCV encodes scroll delta in the high 16 bits of flags
            # Extract the wheel delta (typically 120 for one scroll unit)
            wheel_delta = (flags >> 16) & 0xFFFF
            # Handle signed value (can be negative for scroll down)
            if wheel_delta > 32768:  # Handle unsigned to signed conversion
                wheel_delta = wheel_delta - 65536

            # Alternative: if wheel_delta extraction doesn't work, use relative comparison
            if wheel_delta == 0 and last_wheel_time > 0 and current_time - last_wheel_time < 0.2:
                # Fallback: compare flags values
                if flags > last_wheel_flags:
                    wheel_delta = 120  # Scroll up
                elif flags < last_wheel_flags:
                    wheel_delta = -120  # Scroll down

            if wheel_delta > 0:
                brush_size = min(brush_size + 2, 200)  # Increase brush size, max 200
            elif wheel_delta < 0:
                brush_size = max(brush_size - 2, 5)  # Decrease brush size, min 5

            last_wheel_time = current_time
            last_wheel_flags = flags
            if wheel_delta != 0:  # Only print if we detected a change
                print(f"Brush size: {brush_size}", flush=True)

def get_filename(movie_name):
    name = movie_name.lower()
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'\s+', '-', name)
    return name.strip('-') + ".jpg"

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
    elif category == "Thanksgiving":
        # Thanksgiving category searches for Thanksgiving-related photos (food, activities, objects)
        query = f"{item_name} Thanksgiving photo high resolution"
    elif category == "Dogs":
        # Dogs category searches for dog breed photos
        query = f"{item_name} dog breed photo high resolution"
    elif category == "Horses":
        # Horses category searches for horse breeds, activities, and equipment
        query = f"{item_name} horse equestrian photo high resolution"
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
                img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
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

def process_image(image_source, output_path, item_title="Image", category="Movies"):
    global mask_layer, img_display, original_img

    # Track URLs we've already tried for this item
    tried_urls = set()

    # Load logic
    if isinstance(image_source, str) and os.path.exists(image_source):
        original_img = cv2.imread(image_source)
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
    print("Controls: [Space]=Trad | [Tab]=AI | [S]=Save+Next | [N]=Skip | [R]=Reset | [T]=Try Again | [Esc]=Quit Batch", flush=True)
    print("Brush: [Ctrl+Scroll]=Adjust size (current: {})".format(brush_size), flush=True)

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
        elif key == ord('r'): # Reset
            current_img = original_img.copy()
            mask_layer = np.zeros((h, w), dtype=np.uint8)
            img_display = current_img.copy()
            print("Reset.")
        elif key == ord('t'): # Try Again (Re-download)
            # Determine item type based on category
            if category == "Books":
                item_type = "book cover"
            elif category == "Movies" or category == "Disney Channel Original Movies" or category == "Reality tv shows" or category == "Rom Coms":
                item_type = "poster"
            elif category == "The Office":
                item_type = "character photo"
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
                action = "next"
            except Exception as e:
                print(f"Save failed: {e}")
            break

    cv2.destroyAllWindows()
    return action

def run_batch_mode(category="Movies", amount_to_process=2):
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

    count_processed = 0

    for i, item in enumerate(items):
        if count_processed >= amount_to_process:
            print(f"Batch limit of {amount_to_process} reached. Stopping.", flush=True)
            break

        print(f"\n[{i+1}/{len(items)}] Preparing: {item}", flush=True)
        filename = get_filename(item)
        file_path = save_dir / filename

        # Fallback for "The X" -> "x.jpg"
        if not file_path.exists() and filename.startswith("the-"):
            alt_filename = filename[4:] # Remove "the-"
            alt_path = save_dir / alt_filename
            if alt_path.exists():
                print(f"  Found alternative local file: {alt_filename}", flush=True)
                file_path = alt_path

        # SKIP if file already exists
        if file_path.exists():
            print(f"  Skipping {item} (already exists at {file_path.name})", flush=True)
            continue

        count_processed += 1

        # Check if we already have a local file to start with
        source = str(file_path) if file_path.exists() else item

        try:
            # Add delay before search to avoid rate limiting
            if not file_path.exists():
                time.sleep(2)

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
    if len(sys.argv) > 1 and sys.argv[1] == "--batch":
        # Parse arguments: --batch <category> <amount>
        if len(sys.argv) < 3:
            print("Usage: python manual_cleaner.py --batch <category> [amount]")
            print("Example: python manual_cleaner.py --batch Books 2")
            print("Example: python manual_cleaner.py --batch Movies 2")
            print("Example: python manual_cleaner.py --batch \"Reality tv shows\" 2")
            print("Example: python manual_cleaner.py --batch \"The Office\" 2")
            print("Example: python manual_cleaner.py --batch Thanksgiving 2")
            print("Example: python manual_cleaner.py --batch Dogs 2")
            print("Example: python manual_cleaner.py --batch Horses 2")
            print("Example: python manual_cleaner.py --batch \"Rom Coms\" 2")
            return

        category = sys.argv[2]
        amount_to_process = int(sys.argv[3]) if len(sys.argv) > 3 else 2
        run_batch_mode(category, amount_to_process)
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
        print("Usage:")
        print("  python manual_cleaner.py --batch <category> [amount]")
        print("  python manual_cleaner.py 'Item Name' [category]")
        print("")
        print("Examples:")
        print("  python manual_cleaner.py --batch Books 2")
        print("  python manual_cleaner.py --batch Movies 2")
        print("  python manual_cleaner.py --batch \"Reality tv shows\" 2")
        print("  python manual_cleaner.py --batch \"The Office\" 2")
        print("  python manual_cleaner.py --batch Thanksgiving 2")
        print("  python manual_cleaner.py --batch Dogs 2")
        print("  python manual_cleaner.py --batch Horses 2")
        print("  python manual_cleaner.py --batch \"Rom Coms\" 2")
        print("  python manual_cleaner.py 'The Great Gatsby' Books")
        print("  python manual_cleaner.py 'Michael Scott' \"The Office\"")
        print("  python manual_cleaner.py 'Turkey' Thanksgiving")
        print("  python manual_cleaner.py 'Labrador Retriever' Dogs")
        print("  python manual_cleaner.py 'Arabian Horse' Horses")
        print("  python manual_cleaner.py 'When Harry Met Sally' \"Rom Coms\"")

if __name__ == "__main__":
    main()
