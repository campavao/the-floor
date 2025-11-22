#!/usr/bin/env python3
"""Find entries in data.ts that don't have corresponding image files"""
from pathlib import Path
import re

# Get actual files
movies_files = {f.name for f in Path('public/images/movies').glob('*.jpg')}
books_files = {f.name for f in Path('public/images/books').glob('*.jpg')}
disney_files = {f.name for f in Path('public/images/disney-channel-original-movies').glob('*.jpg')}

# Read data.ts
with open('app/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract Movies entries
movies_section = re.search(r'Movies: \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if movies_section:
    movies_entries = []
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', movies_section.group(1)):
        movies_entries.append((match.group(1), match.group(2)))

    print("Movies - Missing files:")
    for name, img in movies_entries:
        if img not in movies_files:
            print(f"  {name} -> {img}")

# Extract Books entries
books_section = re.search(r'Books: \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if books_section:
    books_entries = []
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', books_section.group(1)):
        books_entries.append((match.group(1), match.group(2)))

    print("\nBooks - Missing files:")
    for name, img in books_entries:
        if img not in books_files:
            print(f"  {name} -> {img}")

# Extract Disney entries
disney_section = re.search(r'"Disney Channel Original Movies": \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if disney_section:
    disney_entries = []
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', disney_section.group(1)):
        disney_entries.append((match.group(1), match.group(2)))

    print("\nDisney Channel Original Movies - Missing files:")
    for name, img in disney_entries:
        if img not in disney_files:
            print(f"  {name} -> {img}")

