#!/usr/bin/env python3
"""
Test script for image search - verify multi-word query handling
Usage: python3 test_image_search.py "Example Name"
"""
import os
import re
import json
import time
import sys
from pathlib import Path
from PIL import Image
import requests
from io import BytesIO

def to_kebab_case(text):
    """Convert text to kebab-case"""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def search_duckduckgo_images(query, max_results=20):
    """
    Search DuckDuckGo for images using their instant answer API
    This properly handles multi-word queries as a single phrase
    
    Note: DuckDuckGo requires proper headers including Referer and X-Requested-With
    to avoid 403 errors. We use a session to maintain cookies.
    """
    try:
        # Create a session to maintain cookies between requests
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
            print(f"    ✗ Could not extract vqd token from DuckDuckGo")
            return []
        
        vqd = vqd_match.group(1)
        print(f"    Got vqd token: {vqd[:30]}...")
        
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
            print(f"    ✗ DuckDuckGo API returned status {response.status_code}")
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

# Test with example from command line or default
if len(sys.argv) > 1:
    example = " ".join(sys.argv[1:])
else:
    example = "Billy Goat Tavern"  # Default
category_folder = Path(__file__).parent / 'public' / 'images' / 'chicago-tourist-stuff'
category_folder.mkdir(parents=True, exist_ok=True)

kebab_name = to_kebab_case(example)
filepath_jpg = category_folder / f"{kebab_name}.jpg"
filepath_png = category_folder / f"{kebab_name}.png"

# Remove existing files if they exist (for testing)
if filepath_jpg.exists():
    print(f"Removing existing {filepath_jpg}")
    filepath_jpg.unlink()
if filepath_png.exists():
    print(f"Removing existing {filepath_png}")
    filepath_png.unlink()

# Construct search query - include "Chicago" to ensure location-specific results
query = f"{example} Chicago"

print(f"Testing: {example}")
print(f"Query: {query}")
print(f"Target folder: {category_folder}")
print(f"Target filename: {kebab_name}.jpg/png\n")

try:
    # Search DuckDuckGo for images
    print("Searching DuckDuckGo...")
    image_urls = search_duckduckgo_images(query, max_results=20)
    
    if not image_urls:
        print(f"✗ No images found")
        exit(1)
    
    print(f"✓ Found {len(image_urls)} image URLs")
    print(f"\nChecking first few URLs:")
    for i, url in enumerate(image_urls[:5], 1):
        print(f"  {i}. {url[:80]}...")
    
    print(f"\nTrying to download suitable image (>600x600px PNG/JPEG)...")
    
    found = False
    for i, img_url in enumerate(image_urls, 1):
        print(f"\n  Trying image {i}/{len(image_urls)}...")
        # Try jpg first, then png
        if download_and_verify_image(img_url, filepath_jpg):
            img = Image.open(filepath_jpg)
            print(f"  ✓ Successfully downloaded as JPG!")
            print(f"    Size: {img.width}x{img.height}")
            print(f"    Format: {img.format}")
            print(f"    Saved to: {filepath_jpg}")
            found = True
            break
        elif download_and_verify_image(img_url, filepath_png):
            img = Image.open(filepath_png)
            print(f"  ✓ Successfully downloaded as PNG!")
            print(f"    Size: {img.width}x{img.height}")
            print(f"    Format: {img.format}")
            print(f"    Saved to: {filepath_png}")
            found = True
            break
        else:
            print(f"  ✗ Image {i} didn't meet requirements (size/format)")
    
    if not found:
        print(f"\n✗ No suitable image found (>600x600px PNG/JPEG)")
        exit(1)
    else:
        print(f"\n✓ Test successful! Image downloaded correctly.")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

