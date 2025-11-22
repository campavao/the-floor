#!/usr/bin/env python3
"""
Alternative script to download images using Unsplash API (free, no API key needed)
Usage: python3 download_category_images_unsplash.py "Category Name" [start_line] [end_line]
   or: python3 download_category_images_unsplash.py "Category Name" (will auto-detect lines from CSV)
"""
import os
import re
import time
import sys
import csv
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

def has_text_in_image(image_path):
    """
    Use OCR to detect if an image contains text
    Returns True if text is detected, False otherwise
    Falls back to image analysis heuristics if OCR is not available
    """
    try:
        import pytesseract
        import os
        # Set Tesseract path on Windows if not in PATH
        if sys.platform == 'win32':
            tesseract_paths = [
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            ]
            for path in tesseract_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    break

        # Try to detect text in the image using OCR
        img = Image.open(image_path)

        # Try multiple OCR configurations for better text detection
        # PSM 6: Assume a single uniform block of text
        # PSM 8: Treat the image as a single word
        # PSM 11: Sparse text (find as much text as possible)
        text_configs = ['--psm 6', '--psm 8', '--psm 11']

        for config in text_configs:
            try:
                text = pytesseract.image_to_string(img, config=config).strip()
                # Remove whitespace and check if we found meaningful text
                text_clean = ''.join(text.split())
                if len(text_clean) > 2:  # Even 2-3 characters might be text
                    # Check if it contains letters (not just symbols)
                    if any(c.isalpha() for c in text_clean):
                        return True
            except:
                continue

        return False
    except Exception as e:
        # If OCR fails (e.g., tesseract not installed), use image analysis heuristics
        try:
            img = Image.open(image_path)
            from PIL import ImageStat, ImageFilter

            # Convert to grayscale for analysis
            gray = img.convert('L')

            # Apply edge detection - text creates many sharp edges
            edges = gray.filter(ImageFilter.FIND_EDGES)
            edge_stat = ImageStat.Stat(edges)
            edge_mean = edge_stat.mean[0] if len(edge_stat.mean) > 0 else 0

            # Check contrast in original image
            orig_stat = ImageStat.Stat(gray)
            contrast = orig_stat.stddev[0] if len(orig_stat.stddev) > 0 else 0

            # Heuristic: High contrast + high edge density = likely text
            # Text typically has contrast > 60 and edge density > 40
            if contrast > 60 and edge_mean > 40:
                return True

            # Also check for very high contrast alone (text is usually high contrast)
            if contrast > 80:
                return True

            return False
        except:
            # If all analysis fails, return False and rely on other scoring
            return False

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def to_kebab_case(text):
    """Convert text to kebab-case"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def search_unsplash_images(query, max_results=20):
    """
    Search Unsplash for images using their free API
    No API key required for basic usage (with rate limits)
    """
    try:
        # Unsplash Source API (free, no key needed)
        # This uses Unsplash's public API endpoint
        url = "https://source.unsplash.com/featured"

        # For search, we'll use the Unsplash Source API with keywords
        # Format: https://source.unsplash.com/featured/?{keywords}
        search_url = f"https://source.unsplash.com/featured/?{requests.utils.quote(query)}"

        # Try to get image URLs - Unsplash Source API redirects to actual images
        # We'll use a different approach: use Unsplash's search API via their public endpoint
        # Actually, let's use Pexels instead as it has a better free API

        return search_pexels_images(query, max_results)

    except Exception as e:
        print(f"    Error searching Unsplash: {e}")
        return []

def search_pexels_images(query, max_results=20):
    """
    Search Pexels for images using their free API
    No API key required, but we'll use their public search endpoint
    """
    try:
        # Pexels public search endpoint (no key needed for basic usage)
        # Note: This uses web scraping which may have rate limits
        search_url = f"https://www.pexels.com/search/{requests.utils.quote(query)}/"

        # Actually, Pexels requires API key for their API
        # Let's use a different approach - use SerpAPI or Google Images

        return search_google_images_scrape(query, max_results)

    except Exception as e:
        print(f"    Error searching Pexels: {e}")
        return []

def search_google_images_scrape(query, max_results=20):
    """
    Search Google Images using web scraping
    This is a fallback method that doesn't require API keys
    """
    try:
        # Use a simple Google Images search URL
        # Format: https://www.google.com/search?tbm=isch&q={query}
        search_url = f"https://www.google.com/search?tbm=isch&q={requests.utils.quote(query)}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        session = requests.Session()
        response = session.get(search_url, headers=headers, timeout=10)

        if response.status_code != 200:
            print(f"    [X] Google Images returned status {response.status_code}")
            return []

        # Parse Google Images results
        # Google Images embeds image URLs in the page
        # Look for patterns like "ou":"https://..." in the JSON data
        import json

        # Try to extract image URLs from the page
        # Google Images uses a specific format in the page source
        image_urls = []

        # Look for image URLs in various formats Google uses
        # Pattern 1: "ou":"URL" in JSON-like structures
        ou_matches = re.findall(r'"ou":"([^"]+)"', response.text)
        for url in ou_matches[:max_results]:
            if url.startswith('http') and any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                image_urls.append(url)

        # Pattern 2: Look for direct image URLs
        if len(image_urls) < max_results:
            img_matches = re.findall(r'https://[^"\s]+\.(?:jpg|jpeg|png|webp)', response.text, re.IGNORECASE)
            for url in img_matches[:max_results]:
                if url not in image_urls:
                    image_urls.append(url)

        return image_urls[:max_results]

    except Exception as e:
        print(f"    Error searching Google Images: {e}")
        import traceback
        traceback.print_exc()
        return []

def download_and_verify_image(url, filepath):
    """Download image and verify it's >600x600px and PNG/JPEG"""
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }, timeout=15, stream=True)

        if response.status_code != 200:
            return False

        # Check content type
        content_type = response.headers.get('content-type', '').lower()
        if 'image' not in content_type:
            return False

        # Download to memory first
        img_data = BytesIO()
        for chunk in response.iter_content(chunk_size=8192):
            img_data.write(chunk)
        img_data.seek(0)

        # Open and verify image
        img = Image.open(img_data)
        if img.format not in ['PNG', 'JPEG', 'JPG']:
            return False

        if img.width < 600 or img.height < 600:
            return False

        # Save image
        img.save(filepath, format=img.format)
        return True

    except Exception as e:
        return False

def read_category_from_csv(category_name, csv_path, start_line=None, end_line=None):
    """
    Read examples for a category from the CSV file
    Returns: (category_name, folder_name, list of examples)
    """
    examples = []
    csv_file = Path(__file__).parent / csv_path

    if not csv_file.exists():
        print(f"Error: CSV file not found at {csv_file}")
        sys.exit(1)

    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader, start=1):
            # Skip if we have line range and this line is outside it
            if start_line and i < start_line:
                continue
            if end_line and i > end_line:
                break

            if len(row) >= 2:
                csv_category = row[0].strip()
                example = row[1].strip()

                if csv_category == category_name:
                    examples.append(example)

    if not examples:
        print(f"Error: No examples found for category '{category_name}'")
        if start_line and end_line:
            print(f"  (Searched lines {start_line}-{end_line})")
        sys.exit(1)

    # Generate folder name from category
    folder_name = to_kebab_case(category_name)

    return category_name, folder_name, examples

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 download_category_images_unsplash.py \"Category Name\" [start_line] [end_line]")
        print("Example: python3 download_category_images_unsplash.py \"Junk drawer\" 294 343")
        sys.exit(1)

    category_name = sys.argv[1]
    start_line = int(sys.argv[2]) if len(sys.argv) > 2 else None
    end_line = int(sys.argv[3]) if len(sys.argv) > 3 else None

    csv_path = 'app/The Floor - Categories - Categories + Examples.csv'

    # Read category data from CSV
    category_name, folder_name, examples = read_category_from_csv(
        category_name, csv_path, start_line, end_line
    )

    category_folder = Path(__file__).parent / 'public' / 'images' / folder_name
    category_folder.mkdir(parents=True, exist_ok=True)

    # Create temp folder for temporary downloads
    temp_folder = Path(__file__).parent / 'public' / 'temp'
    temp_folder.mkdir(parents=True, exist_ok=True)

    print(f"Category: {category_name}")
    print(f"Folder: {category_folder}")
    print(f"Processing {len(examples)} examples...\n")
    print("Using Google Images search (web scraping method)\n")

    successful = []
    failed = []

    for i, example in enumerate(examples, 1):
        kebab_name = to_kebab_case(example)
        filepath_jpg = category_folder / f"{kebab_name}.jpg"
        filepath_png = category_folder / f"{kebab_name}.png"

        # Remove existing files to overwrite
        if filepath_jpg.exists():
            filepath_jpg.unlink()
        if filepath_png.exists():
            filepath_png.unlink()

        # Construct search query - check category to determine query format
        if "costume" in category_name.lower() or "halloween" in category_name.lower():
            # Costume categories - add costume to query
            if "costume" in example.lower():
                query = example
            else:
                query = f"{example} costume"
        elif "states" in category_name.lower():
            # States category - search for state outline/shape without text
            query = f"{example} state outline silhouette vector"
        elif "mlb teams" in category_name.lower():
            # MLB teams - search for team logo
            query = f"{example} logo"
        else:
            # Character/other categories - use example as-is
            query = example

        print(f"[{i}/{len(examples)}] Searching for: {example}")
        print(f"    Query: {query}")

        try:
            # Search Google Images for images
            image_urls = search_google_images_scrape(query, max_results=20)

            if not image_urls:
                print(f"    [X] No images found")
                failed.append(example)
                continue

            print(f"    Found {len(image_urls)} image URLs, checking for suitable image...")

            # If no good results, try a more generic search
            if not image_urls:
                print(f"    Trying alternative search: {example} halloween costume")
                query_alt = f"{example} halloween costume"
                image_urls = search_google_images_scrape(query_alt, max_results=20)
                if image_urls:
                    print(f"    Found {len(image_urls)} image URLs with alternative search")

            found = False
            best_image = None
            best_score = -1
            all_scored_images = []  # Store all images with their scores

            # Try multiple images and score them to find the best one
            for idx, img_url in enumerate(image_urls[:25]):  # Check first 25 images for better selection
                temp_filepath = temp_folder / f"temp_{kebab_name}_{idx}.jpg"

                # Try downloading
                if download_and_verify_image(img_url, temp_filepath):
                    try:
                        img = Image.open(temp_filepath)
                        width, height = img.width, img.height

                        # Score the image based on quality criteria
                        score = 0

                        # Prefer larger images (but not too large)
                        if width >= 800 and height >= 800:
                            score += 10
                        elif width >= 600 and height >= 600:
                            score += 5

                        # Prefer portrait orientation (costume photos are often portrait)
                        aspect_ratio = height / width if width > 0 else 1
                        if 1.2 <= aspect_ratio <= 2.0:  # Portrait-ish
                            score += 5

                        # Prefer square-ish or portrait over very wide
                        if aspect_ratio > 0.7:  # Not too wide
                            score += 3

                        # Prefer reasonable dimensions (not tiny thumbnails)
                        if width >= 700 and height >= 700:
                            score += 5

                        # Prefer JPEG over PNG for photos (costume photos are usually JPEG)
                        if img.format == 'JPEG':
                            score += 2

                        # Avoid very small images
                        if width < 600 or height < 600:
                            score -= 10

                        # Avoid very wide images (likely banners/headers with text)
                        if aspect_ratio < 0.5:
                            score -= 10

                        # Penalize images that might be promotional banners
                        # Very wide images or very tall narrow images often have text
                        if aspect_ratio < 0.6 or aspect_ratio > 3.0:
                            score -= 8

                        # For states category, prefer square images (outline images are often square)
                        if "states" in category_name.lower():
                            if 0.9 <= aspect_ratio <= 1.1:  # Square-ish
                                score += 10
                            elif 0.8 <= aspect_ratio <= 1.3:  # Close to square
                                score += 5
                        else:
                            # Prefer images in a reasonable portrait/square range (product photos)
                            # These are less likely to have text overlays
                            if 0.8 <= aspect_ratio <= 1.5:
                                score += 3

                        # Try to detect if image might have text by checking for high contrast
                        # This is a simple heuristic - images with text often have sharp edges
                        try:
                            from PIL import ImageStat
                            stat = ImageStat.Stat(img)
                            # Check for high contrast (text often creates high contrast)
                            # But we want some contrast, just not extreme
                            contrast_score = abs(stat.stddev[0]) if len(stat.stddev) > 0 else 0

                            # For states category, be more aggressive about filtering text
                            if "states" in category_name.lower():
                                # State outlines should be simple - very high contrast likely means text
                                if contrast_score > 60:  # Lower threshold - high contrast likely indicates text
                                    score -= 20  # Even heavier penalty for potential text
                                elif contrast_score > 45:
                                    score -= 12
                                # Prefer simpler images (lower contrast) for outlines
                                elif contrast_score < 25:
                                    score += 8  # Simple outline images have lower contrast - boost more
                                elif contrast_score < 35:
                                    score += 3
                            else:
                                # For other categories, use original logic
                                if contrast_score > 80:  # Very high contrast might indicate text
                                    score -= 3
                                elif 30 <= contrast_score <= 60:  # Good natural contrast
                                    score += 2
                        except:
                            pass  # If we can't analyze, skip this check

                        # For states, heavily penalize wide images (often have text labels)
                        if "states" in category_name.lower():
                            if aspect_ratio < 0.7:  # Very wide images often have text
                                score -= 20
                            if aspect_ratio > 1.5:  # Very tall images might have text
                                score -= 10

                            # Use OCR to detect text - reject images with text
                            if has_text_in_image(temp_filepath):
                                print(f"      Image {idx+1}: {width}x{height} {img.format} (score: {score}) - REJECTED: Contains text")
                                # Don't add to scored images if it has text
                                img.close()
                                continue

                        # For MLB teams, also filter out logos with text
                        if "mlb teams" in category_name.lower():
                            # Use OCR to detect text - reject images with text
                            if has_text_in_image(temp_filepath):
                                print(f"      Image {idx+1}: {width}x{height} {img.format} (score: {score}) - REJECTED: Contains text")
                                # Don't add to scored images if it has text
                                img.close()
                                continue

                        print(f"      Image {idx+1}: {width}x{height} {img.format} (score: {score})")

                        # Store this image with its score
                        all_scored_images.append((score, temp_filepath, idx+1))

                        # Close the image before moving on
                        img.close()

                        if score >= best_score:
                            # If same score, prefer lower index (earlier in results)
                            if score > best_score or (score == best_score and idx < all_scored_images[-1][1] if all_scored_images else True):
                                best_score = score
                                best_image = temp_filepath
                        # Keep all temp files for review (don't delete them)

                    except Exception as e:
                        # If we can't open/score it, delete temp file
                        if temp_filepath.exists():
                            try:
                                temp_filepath.unlink()
                            except:
                                pass  # File might be locked, will clean up later
                        continue

            # If no suitable image found and this is a state, try alternative queries
            if best_score < 0 and "states" in category_name.lower() and not all_scored_images:
                alternative_queries = [
                    f"{example} state shape svg",
                    f"{example} outline no text",
                    f"{example} silhouette",
                    f"{example} state map outline",
                ]

                for alt_query in alternative_queries:
                    print(f"    Trying alternative query: {alt_query}")
                    alt_image_urls = search_google_images_scrape(alt_query, max_results=20)
                    if alt_image_urls:
                        print(f"    Found {len(alt_image_urls)} image URLs with alternative search")
                        # Reset scoring for alternative search
                        all_scored_images = []
                        best_score = -1
                        best_image = None

                        # Check alternative images
                        for idx, img_url in enumerate(alt_image_urls[:25]):
                            temp_filepath = temp_folder / f"temp_{kebab_name}_alt_{idx}.jpg"

                            if download_and_verify_image(img_url, temp_filepath):
                                try:
                                    img = Image.open(temp_filepath)
                                    width, height = img.width, img.height

                                    # Score the image (same scoring logic as above)
                                    score = 0

                                    if width >= 800 and height >= 800:
                                        score += 10
                                    elif width >= 600 and height >= 600:
                                        score += 5

                                    aspect_ratio = height / width if width > 0 else 1
                                    if 0.9 <= aspect_ratio <= 1.1:
                                        score += 10
                                    elif 0.8 <= aspect_ratio <= 1.3:
                                        score += 5

                                    if width >= 700 and height >= 700:
                                        score += 5

                                    if width < 600 or height < 600:
                                        score -= 10

                                    if aspect_ratio < 0.7:
                                        score -= 20
                                    if aspect_ratio > 1.5:
                                        score -= 10

                                    # Check for text using OCR
                                    if has_text_in_image(temp_filepath):
                                        print(f"      Image {idx+1}: {width}x{height} {img.format} (score: {score}) - REJECTED: Contains text")
                                        img.close()
                                        continue

                                    print(f"      Image {idx+1}: {width}x{height} {img.format} (score: {score})")
                                    all_scored_images.append((score, temp_filepath, idx+1))
                                    img.close()

                                    if score >= best_score:
                                        if score > best_score:
                                            best_score = score
                                            best_image = temp_filepath
                                except:
                                    if temp_filepath.exists():
                                        try:
                                            temp_filepath.unlink()
                                        except:
                                            pass
                                    continue

                        # If we found a good image from alternative search, break
                        if best_score >= 0 and all_scored_images:
                            break

            # Determine the actual best image from all scored images
            # If multiple images have the best score, use additional criteria to break ties
            import shutil
            final_best_image = None
            best_img_num = None
            if best_score >= 0 and all_scored_images:
                # Find all images with the best score
                best_candidates = []
                for score, path, img_num in all_scored_images:
                    if score == best_score and path.exists():
                        try:
                            # Re-score with additional tie-breaking criteria
                            img = Image.open(path)
                            width, height = img.width, img.height
                            aspect_ratio = height / width if width > 0 else 1

                            # Tie-breaking score (higher is better)
                            tie_break_score = 0

                            # Prefer square-ish images (0.9-1.1) - less likely to be banners
                            if 0.9 <= aspect_ratio <= 1.1:
                                tie_break_score += 10
                            # Prefer portrait (1.2-1.8) over very tall
                            elif 1.2 <= aspect_ratio <= 1.8:
                                tie_break_score += 8

                            # Prefer larger images when scores are tied
                            if width >= 1200 and height >= 1200:
                                tie_break_score += 5
                            elif width >= 1000 and height >= 1000:
                                tie_break_score += 3

                            # Prefer images closer to ideal portrait ratio (1.33)
                            ideal_ratio = 1.33
                            ratio_diff = abs(aspect_ratio - ideal_ratio)
                            if ratio_diff < 0.2:
                                tie_break_score += 3

                            img.close()
                            best_candidates.append((tie_break_score, img_num, path))
                        except:
                            # If we can't analyze, just use image number as tie-breaker
                            best_candidates.append((0, img_num, path))

                if best_candidates:
                    # Sort by tie-break score (descending), then by image number (ascending)
                    best_candidates.sort(key=lambda x: (-x[0], x[1]))
                    tie_break_score, best_img_num, best_image_path = best_candidates[0]
                    final_best_image = best_image_path
                    print(f"    Selected image {best_img_num} (file: {final_best_image.name}) with score {best_score} (tie-break: {tie_break_score}) (from {len(best_candidates)} images with this score)")

            # Use final_best_image if we found one, otherwise fall back to best_image
            image_to_save = final_best_image if final_best_image else best_image

            # Save the best image we found
            if image_to_save and image_to_save.exists():
                # For states and MLB teams categories, verify final image doesn't have text using OCR before saving
                if "states" in category_name.lower() or "mlb teams" in category_name.lower():
                    if has_text_in_image(image_to_save):
                        print(f"    [X] Final selected image contains text - rejecting")
                        # Try to find next best image without text
                        found_alternative = False
                        if all_scored_images:
                            # Sort by score descending, then by image number ascending
                            sorted_images = sorted(all_scored_images, key=lambda x: (-x[0], x[2]))
                            for score, path, img_num in sorted_images:
                                if path.exists() and path != image_to_save:
                                    if not has_text_in_image(path):
                                        print(f"    Using alternative image {img_num} (score: {score})")
                                        image_to_save = path
                                        found_alternative = True
                                        break

                        if not found_alternative:
                            print(f"    [X] No text-free alternative found")
                            image_to_save = None

                if image_to_save and image_to_save.exists():
                    # Determine final filepath based on image format
                    try:
                        img_check = Image.open(image_to_save)
                        if img_check.format == 'PNG':
                            final_filepath = filepath_png
                        else:
                            final_filepath = filepath_jpg
                        img_check.close()
                    except:
                        final_filepath = filepath_jpg

                    # Copy temp file to final location (instead of rename to avoid Windows locking issues)
                    shutil.copy2(image_to_save, final_filepath)

                    img = Image.open(final_filepath)
                    print(f"    [OK] Downloaded best image: {img.width}x{img.height} {img.format} (score: {best_score})")
                    img.close()
                    successful.append(example)
                    found = True

                    # Clean up temp files for this example
                    import time
                    for temp_file in temp_folder.glob(f"temp_{kebab_name}_*.jpg"):
                        if temp_file.exists():
                            try:
                                temp_file.unlink()
                            except:
                                # Retry after a short delay for Windows file locking
                                time.sleep(0.1)
                                try:
                                    temp_file.unlink()
                                except:
                                    pass  # Give up if still locked
            else:
                # No suitable image found
                found = False

                # Clean up temp files for this example
                import time
                for temp_file in temp_folder.glob(f"temp_{kebab_name}_*.jpg"):
                    if temp_file.exists():
                        try:
                            temp_file.unlink()
                        except:
                            # Retry after a short delay for Windows file locking
                            time.sleep(0.1)
                            try:
                                temp_file.unlink()
                            except:
                                pass  # Give up if still locked

            if not found:
                print(f"    [X] No suitable image found (>600x600px PNG/JPEG)")
                failed.append(example)

            # Delay to avoid rate limiting
            time.sleep(2)  # Longer delay for Google Images

        except Exception as e:
            print(f"    [X] Error processing {example}: {e}")
            failed.append(example)
            import traceback
            traceback.print_exc()

    print(f"\n=== Summary ===")
    print(f"Category: {category_name}")
    print(f"Successful: {len(successful)}")
    print(f"Failed: {len(failed)}")
    if failed:
        print("\nFailed examples:")
        for ex in failed:
            print(f"  - {ex}")
    else:
        print("\n[OK] All examples downloaded successfully!")

if __name__ == "__main__":
    main()

