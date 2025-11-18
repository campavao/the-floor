# Image Search Query Issue - Analysis and Fix

## Problem Identified

The existing Python scripts (`download_images.py`, `improve_chicago_images.py`) are using `bing_image_downloader`, which has a critical flaw: **it's not properly handling multi-word queries as phrases**.

### Root Cause

When searching for "Field Museum Chicago", the library is:

1. URL-encoding spaces as `+` signs: `Field+Museum+Chicago`
2. Bing is interpreting this as separate search terms rather than a phrase
3. Results show generic images matching only the first word (e.g., "Field" → grassy fields)

Evidence from `batch_5.log`:

- Query: `boat tour Chicago architecture river cruise`
- URL sent: `boat%2Btour%2BChicago...` (spaces → `+` → `%2B`)
- Results: Generic boat images, not Chicago architectural boat tours

### Why This Happens

The `bing_image_downloader` library internally uses `urllib.parse.quote_plus()` which:

- Converts spaces to `+` signs
- But Bing's image search doesn't treat `+` as phrase delimiters
- It needs quotes around phrases: `"Field Museum" Chicago`

## Solutions Provided

I've created three fixed versions:

### 1. `download_images_fixed.py` (Recommended)

- Uses **DuckDuckGo image search** API
- Properly handles multi-word queries as phrases
- No API key required
- More reliable for phrase searches

### 2. `download_images_bing_fixed.py`

- Uses **direct Bing image search** with proper query encoding
- Constructs Bing URLs manually to ensure phrase searches work
- More complex but gives you Bing's image quality

### 3. Fix Existing Scripts

The issue can also be fixed in existing scripts by ensuring queries use quotes:

```python
# Instead of:
query = f"{example} Chicago"

# Use:
query = f'"{example}" Chicago'
```

However, `bing_image_downloader` may still not handle quotes correctly, so switching to DuckDuckGo or direct Bing search is recommended.

## Testing Recommendation

1. Test `download_images_fixed.py` on a few examples first:

   ```bash
   python3 download_images_fixed.py
   ```

2. Check the downloaded images to verify they match the search terms correctly

3. If DuckDuckGo doesn't work well, try `download_images_bing_fixed.py`

## Next Steps

1. Run the fixed script on the Chicago tourist examples
2. Verify images are relevant (not generic)
3. Update `data.ts` with the new image paths
4. Consider replacing the old scripts with the fixed version
