#!/usr/bin/env python3
"""Verify all entries in data.ts have corresponding image files"""
from pathlib import Path
import re

# Get actual files
movies_files = {f.name for f in Path('public/images/movies').glob('*.jpg')}
books_files = {f.name for f in Path('public/images/books').glob('*.jpg')}
disney_files = {f.name for f in Path('public/images/disney-channel-original-movies').glob('*.jpg')}

# Read data.ts
with open('app/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

missing = []

# Check Movies
movies_section = re.search(r'Movies: \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if movies_section:
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', movies_section.group(1)):
        name, img = match.group(1), match.group(2)
        if img not in movies_files:
            missing.append(('Movies', name, img))

# Check Books
books_section = re.search(r'Books: \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if books_section:
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', books_section.group(1)):
        name, img = match.group(1), match.group(2)
        if img not in books_files:
            missing.append(('Books', name, img))

# Check Disney
disney_section = re.search(r'"Disney Channel Original Movies": \{.*?examples: \[(.*?)\],\s*\},', content, re.DOTALL)
if disney_section:
    for match in re.finditer(r'name: "([^"]+)",\s*image: "([^"]+)"', disney_section.group(1)):
        name, img = match.group(1), match.group(2)
        if img not in disney_files:
            missing.append(('Disney Channel Original Movies', name, img))

if missing:
    print("Entries with missing image files:")
    for cat, name, img in missing:
        print(f"  {cat}: {name} -> {img}")
else:
    print("All entries have corresponding image files!")

