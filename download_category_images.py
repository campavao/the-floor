#!/usr/bin/env python3
"""
Generic script to download images for any category from the CSV file
Usage: python3 download_category_images.py "Category Name" [start_line] [end_line]
   or: python3 download_category_images.py "Category Name" (will auto-detect lines from CSV)
"""
import os
import re
import json
import time
import sys
import csv
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

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

def search_duckduckgo_images(query, max_results=20, session=None):
    """
    Search DuckDuckGo for images using their instant answer API
    This properly handles multi-word queries as a single phrase

    Note: DuckDuckGo requires proper headers including Referer and X-Requested-With
    to avoid 403 errors. We use a session to maintain cookies.
    """
    try:
        # Reuse session if provided, otherwise create new one
        if session is None:
            session = requests.Session()

        # DuckDuckGo image search endpoint
        url = "https://duckduckgo.com/"

        # First, get the vqd token (required for image search)
        params = {
            'q': query
        }
        headers1 = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        response = session.get(url, params=params, headers=headers1)

        # Extract vqd token from response
        vqd_match = re.search(r'vqd=([\d-]+)', response.text)
        if not vqd_match:
            print(f"    [X] Could not extract vqd token from DuckDuckGo")
            return []

        vqd = vqd_match.group(1)

        # Now search for images - requires specific headers to avoid 403
        image_url = "https://duckduckgo.com/i.js"
        params = {
            'l': 'us-en',
            'o': 'json',
            'q': query,  # Full query as-is, DuckDuckGo handles it properly
            'vqd': vqd,
            'f': ',,,',
            'p': '1',
            's': '0'
        }

        # Critical headers to avoid 403 error
        headers2 = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://duckduckgo.com/',  # Required!
            'X-Requested-With': 'XMLHttpRequest',  # Required!
            'Origin': 'https://duckduckgo.com',
        }

        response = session.get(image_url, params=params, headers=headers2)

        if response.status_code != 200:
            print(f"    [X] DuckDuckGo API returned status {response.status_code}")
            return []

        data = response.json()
        results = data.get('results', [])

        # Return image URLs
        image_urls = []
        for result in results[:max_results]:
            image_url = result.get('image')
            if image_url:
                image_urls.append(image_url)

        return image_urls

    except Exception as e:
        print(f"    Error searching DuckDuckGo: {e}")
        import traceback
        traceback.print_exc()
        return []

def download_and_verify_image(url, filepath):
    """Download image and verify it's >600x600px and PNG/JPEG"""
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
        print("Usage: python3 download_category_images.py \"Category Name\" [start_line] [end_line]")
        print("Example: python3 download_category_images.py \"Junk drawer\" 294 343")
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

    print(f"Category: {category_name}")
    print(f"Folder: {category_folder}")
    print(f"Processing {len(examples)} examples...\n")
    print("Using DuckDuckGo image search (handles multi-word queries properly)\n")

    successful = []
    failed = []

    for i, example in enumerate(examples, 1):
        kebab_name = to_kebab_case(example)
        filepath_jpg = category_folder / f"{kebab_name}.jpg"
        filepath_png = category_folder / f"{kebab_name}.png"

        # Skip if already exists
        if filepath_jpg.exists() or filepath_png.exists():
            print(f"[{i}/{len(examples)}] [OK] Skipping {example} (already exists)")
            successful.append(example)
            continue

        # Construct search query - use the example name as-is
        # For location-specific categories, you might want to add location
        query = example

        print(f"[{i}/{len(examples)}] Searching for: {example}")
        print(f"    Query: {query}")

        try:
            # Search DuckDuckGo for images (create new session for each query to avoid rate limiting)
            image_urls = search_duckduckgo_images(query, max_results=20, session=None)

            if not image_urls:
                print(f"    [X] No images found")
                failed.append(example)
                continue

            print(f"    Found {len(image_urls)} image URLs, checking for suitable image...")

            found = False
            for img_url in image_urls:
                # Try jpg first, then png
                if download_and_verify_image(img_url, filepath_jpg):
                    img = Image.open(filepath_jpg)
                    print(f"    [OK] Downloaded: {img.width}x{img.height} {img.format}")
                    successful.append(example)
                    found = True
                    break
                elif download_and_verify_image(img_url, filepath_png):
                    img = Image.open(filepath_png)
                    print(f"    [OK] Downloaded: {img.width}x{img.height} {img.format}")
                    successful.append(example)
                    found = True
                    break

            if not found:
                print(f"    [X] No suitable image found (>600x600px PNG/JPEG)")
                failed.append(example)

            # Delay to avoid rate limiting
            time.sleep(1)

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

