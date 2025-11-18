# Image Download Scripts - Documentation

## Overview

This project includes scripts to download images for categories from a CSV file. The scripts use DuckDuckGo image search API with proper multi-word query handling to ensure accurate image results.

## Problem Solved

The original scripts using `bing_image_downloader` had a critical flaw: they were not properly handling multi-word queries as phrases. When searching for "Field Museum Chicago", the library would:
- URL-encode spaces as `+` signs (`Field+Museum+Chicago`)
- Bing would interpret this as separate search terms rather than a phrase
- Results would show generic images matching only the first word (e.g., "Field" → grassy fields)

**Solution**: Use DuckDuckGo image search API with proper headers, which correctly handles multi-word queries as phrases.

## Files

### Main Scripts

1. **`download_category_images.py`** - Generic script for downloading images for any category
   - Reads from CSV file
   - Handles multi-word queries correctly
   - Creates appropriate folder structure
   - Skips existing images

2. **`test_image_search.py`** - Test script for individual examples
   - Useful for testing specific examples before batch processing
   - Accepts command-line arguments

### Documentation

- **`IMAGE_SEARCH_FIX.md`** - Original analysis of the problem
- **`IMAGE_DOWNLOAD_README.md`** - This file

## Usage

### Download Images for a Category

```bash
python3 download_category_images.py "Category Name" [start_line] [end_line]
```

**Examples:**
```bash
# Download all images for "Junk drawer" category (lines 294-343)
python3 download_category_images.py "Junk drawer" 294 343

# Download all images for "Laundry" category (lines 344-392)
python3 download_category_images.py "Laundry" 344 392

# If you don't specify line numbers, it will search the entire CSV
python3 download_category_images.py "Category Name"
```

### Test Individual Examples

```bash
python3 test_image_search.py "Example Name"
```

**Examples:**
```bash
python3 test_image_search.py "Billy Goat Tavern"
python3 test_image_search.py "Buckingham Fountain"
python3 test_image_search.py "Field Museum"
```

## Workflow for Processing a New Category

1. **Identify the category and line range in CSV**
   - Open `app/The Floor - Categories - Categories + Examples.csv`
   - Find the category name and note the line numbers (e.g., lines 294-343 for "Junk drawer")

2. **Download images**
   ```bash
   python3 download_category_images.py "Category Name" start_line end_line
   ```
   - Images will be saved to `public/images/{kebab-cased-category-name}/`
   - Script skips existing images automatically

3. **Generate data.ts entry**
   ```bash
   python3 << 'EOF'
   import re
   import csv
   from pathlib import Path
   
   def to_kebab_case(text):
       text = text.lower()
       text = re.sub(r'[^\w\s-]', '', text)
       text = re.sub(r'\s+', '-', text)
       text = re.sub(r'-+', '-', text)
       return text.strip('-')
   
   # Read examples from CSV
   examples = []
   csv_path = Path('app/The Floor - Categories - Categories + Examples.csv')
   
   with open(csv_path, 'r', encoding='utf-8') as f:
       reader = csv.reader(f)
       for i, row in enumerate(reader, start=1):
           if START_LINE <= i <= END_LINE:  # Replace with actual line numbers
               if len(row) >= 2:
                   csv_category = row[0].strip()
                   example = row[1].strip()
                   if csv_category == "Category Name":  # Replace with actual category
                       examples.append(example)
   
   category_folder = Path('public/images/{kebab-cased-folder}')  # Replace with actual folder
   
   print('  "Category Name": {')  # Replace with actual category
   print('    name: "Category Name",')
   print('    folder: "{kebab-cased-folder}",')
   print('    examples: [')
   
   for example in examples:
       kebab_name = to_kebab_case(example)
       jpg_path = category_folder / f"{kebab_name}.jpg"
       png_path = category_folder / f"{kebab_name}.png"
       
       if jpg_path.exists():
           ext = ".jpg"
       elif png_path.exists():
           ext = ".png"
       else:
           ext = ".jpg"
       
       print(f'      {{')
       print(f'        name: "{example}",')
       print(f'        image: "{kebab_name}{ext}",')
       print(f'        alternatives: [],')
       print(f'      }},')
   
   print('    ],')
   print('  },')
   EOF
   ```

4. **Add to data.ts**
   - Open `app/data.ts`
   - Find the `CATEGORY_METADATA` object
   - Add the generated entry in alphabetical order (or appropriate location)
   - Ensure the category name matches exactly with the category in the `CATEGORIES` array

## Technical Details

### DuckDuckGo Image Search API

The script uses DuckDuckGo's image search API which requires:

1. **Session Management**: Uses `requests.Session()` to maintain cookies between requests
2. **VQD Token**: First request gets a vqd token from the main DuckDuckGo page
3. **Required Headers**:
   - `Referer: https://duckduckgo.com/` (Required!)
   - `X-Requested-With: XMLHttpRequest` (Required!)
   - `Origin: https://duckduckgo.com`
   - Proper `Accept` header for JSON
   - Proper `User-Agent` header

Without these headers, DuckDuckGo returns a 403 Forbidden error.

### Image Requirements

- Minimum size: 600x600 pixels
- Formats: PNG or JPEG only
- Images are saved with kebab-cased filenames (e.g., "Billy Goat Tavern" → `billy-goat-tavern.jpg`)

### Folder Structure

Images are organized by category in:
```
public/images/
  ├── chicago-tourist-stuff/
  ├── junk-drawer/
  ├── laundry/
  └── {other-categories}/
```

## Categories Processed

- ✅ **Chicago tourist stuff** (lines 101-149) - 48 examples
- ✅ **Junk drawer** (lines 294-343) - 50 examples  
- ✅ **Laundry** (lines 344-392) - 49 examples

## Troubleshooting

### 403 Errors from DuckDuckGo

If you get 403 errors, ensure:
- The script is using a session (`requests.Session()`)
- All required headers are present (especially `Referer` and `X-Requested-With`)
- There's a delay between requests (script includes 1 second delay)

### Images Not Found

- Check that the query is being formatted correctly (multi-word queries should work)
- Try testing with `test_image_search.py` first
- Some examples might need more specific search terms

### Rate Limiting

- The script includes a 1-second delay between requests
- If you encounter rate limiting, increase the delay in the script

## Notes

- The script automatically skips existing images (checks for both `.jpg` and `.png`)
- File extensions are determined automatically based on what was downloaded
- The kebab-case conversion handles special characters and spaces correctly
- For location-specific categories (like "Chicago tourist stuff"), the script adds "Chicago" to the query automatically

## Example: Complete Workflow

```bash
# 1. Download images
python3 download_category_images.py "Junk drawer" 294 343

# 2. Test a specific example
python3 test_image_search.py "Rubber bands"

# 3. Generate data.ts entry (see workflow section above)

# 4. Add to data.ts manually
```

## Key Functions

### `to_kebab_case(text)`
Converts text to kebab-case:
- Lowercases the text
- Removes special characters
- Replaces spaces with hyphens
- Example: "Billy Goat Tavern" → "billy-goat-tavern"

### `search_duckduckgo_images(query, max_results=20)`
Searches DuckDuckGo for images with proper multi-word query handling.

### `download_and_verify_image(url, filepath)`
Downloads and verifies an image meets requirements (>600x600px, PNG/JPEG).

## Dependencies

- Python 3.9+
- `requests` library
- `PIL` (Pillow) library
- Standard library: `csv`, `re`, `pathlib`, `io`, `time`, `sys`

## Future Improvements

- Add support for location-specific queries (currently hardcoded for Chicago)
- Add retry logic for failed downloads
- Add progress bar for large batches
- Add option to force re-download existing images

