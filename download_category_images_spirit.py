#!/usr/bin/env python3
"""
Script to download images directly from Spirit Halloween website
Usage: python3 download_category_images_spirit.py "Category Name" [start_line] [end_line]
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
from bs4 import BeautifulSoup

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

def search_spirit_halloween(query):
    """
    Search Spirit Halloween website for a costume
    Returns list of product URLs
    """
    try:
        # Spirit Halloween search URL
        search_url = f"https://www.spirithalloween.com/search?q={requests.utils.quote(query)}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        session = requests.Session()
        response = session.get(search_url, headers=headers, timeout=30)

        if response.status_code != 200:
            print(f"    [X] Spirit Halloween returned status {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find product links - this will depend on Spirit Halloween's HTML structure
        # Common patterns: product cards, links with product URLs
        product_urls = []

        # Look for product links - adjust selectors based on actual site structure
        # Common patterns:
        # - Links containing '/product/' or '/p/'
        # - Product card links
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            if '/product/' in href or '/p/' in href or '/costume/' in href:
                # Make absolute URL if relative
                if href.startswith('/'):
                    href = 'https://www.spirithalloween.com' + href
                elif not href.startswith('http'):
                    href = 'https://www.spirithalloween.com/' + href

                if href not in product_urls:
                    product_urls.append(href)

        return product_urls[:5]  # Return first 5 results

    except Exception as e:
        print(f"    Error searching Spirit Halloween: {e}")
        import traceback
        traceback.print_exc()
        return []

def get_product_image(product_url):
    """
    Get the main product image from a Spirit Halloween product page
    Returns image URL or None
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }

        session = requests.Session()
        response = session.get(product_url, headers=headers, timeout=30)

        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, 'html.parser')

        # Look for product images - common patterns:
        # - img tags with product-image class
        # - img tags in product galleries
        # - meta og:image tags
        # - data attributes with image URLs

        # Try meta og:image first (most reliable)
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            img_url = og_image.get('content')
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            return img_url

        # Try to find main product image
        # Look for common product image selectors
        img_selectors = [
            'img.product-image',
            'img[data-product-image]',
            '.product-image img',
            '.product-gallery img',
            '.product-main-image img',
            'img[src*="product"]',
        ]

        for selector in img_selectors:
            img_tag = soup.select_one(selector)
            if img_tag:
                img_url = img_tag.get('src') or img_tag.get('data-src') or img_tag.get('data-lazy-src')
                if img_url:
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    elif img_url.startswith('/'):
                        img_url = 'https://www.spirithalloween.com' + img_url
                    return img_url

        return None

    except Exception as e:
        print(f"    Error getting product image: {e}")
        return None

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
        print("Usage: python3 download_category_images_spirit.py \"Category Name\" [start_line] [end_line]")
        print("Example: python3 download_category_images_spirit.py \"Spirit Halloween Catalogue\" 692 740")
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
    print("Scraping images from Spirit Halloween website\n")

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

        print(f"[{i}/{len(examples)}] Searching for: {example}")

        try:
            # Search Spirit Halloween website
            product_urls = search_spirit_halloween(example)

            if not product_urls:
                print(f"    [X] No products found on Spirit Halloween website")
                failed.append(example)
                continue

            print(f"    Found {len(product_urls)} product(s), checking images...")

            found = False
            for product_url in product_urls:
                print(f"    Checking: {product_url[:80]}...")
                img_url = get_product_image(product_url)

                if img_url:
                    print(f"    Found image: {img_url[:80]}...")
                    # Try downloading
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
                print(f"    [X] No suitable image found from Spirit Halloween products")
                failed.append(example)

            # Delay to avoid rate limiting
            time.sleep(2)

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

