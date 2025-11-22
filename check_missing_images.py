#!/usr/bin/env python3
"""Check which entries in data.ts don't have corresponding image files"""
import re
from pathlib import Path

# Read actual image files
movies_files = set(f.name for f in (Path('public/images/movies')).glob('*.jpg'))
books_files = set(f.name for f in (Path('public/images/books')).glob('*.jpg'))
disney_files = set(f.name for f in (Path('public/images/disney-channel-original-movies')).glob('*.jpg'))

# Read data.ts
with open('app/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find Movies section
movies_match = re.search(r'Movies: \{.*?examples: \[(.*?)\],', content, re.DOTALL)
if movies_match:
    movies_section = movies_match.group(1)
    movies_entries = re.findall(r'image: "([^"]+)"', movies_section)
    missing_movies = [img for img in movies_entries if img not in movies_files]
    print(f"Missing Movies images: {missing_movies}")

# Find Books section
books_match = re.search(r'Books: \{.*?examples: \[(.*?)\],', content, re.DOTALL)
if books_match:
    books_section = books_match.group(1)
    books_entries = re.findall(r'image: "([^"]+)"', books_section)
    missing_books = [img for img in books_entries if img not in books_files]
    print(f"Missing Books images: {missing_books}")

# Find Disney section
disney_match = re.search(r'"Disney Channel Original Movies": \{.*?examples: \[(.*?)\],', content, re.DOTALL)
if disney_match:
    disney_section = disney_match.group(1)
    disney_entries = re.findall(r'image: "([^"]+)"', disney_section)
    missing_disney = [img for img in disney_entries if img not in disney_files]
    print(f"Missing Disney images: {missing_disney}")

print(f"\nTotal Movies files: {len(movies_files)}, entries in data.ts: {len(movies_entries) if movies_match else 0}")
print(f"Total Books files: {len(books_files)}, entries in data.ts: {len(books_entries) if books_match else 0}")
print(f"Total Disney files: {len(disney_files)}, entries in data.ts: {len(disney_entries) if disney_match else 0}")

