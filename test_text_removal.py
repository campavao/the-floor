import os
import sys
import cv2
import numpy as np
import pytesseract
from PIL import Image
from pathlib import Path
import requests
from io import BytesIO

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def setup_tesseract():
    if sys.platform == 'win32':
        tesseract_paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
            os.path.expandvars(r'%LOCALAPPDATA%\Tesseract-OCR\tesseract.exe')
        ]
        for path in tesseract_paths:
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                return True
    return False

def download_image(url, filepath):
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"Error downloading: {e}")
    return False

def remove_text_from_image(image_path, output_path):
    try:
        # Read image
        img = cv2.imread(str(image_path))
        if img is None:
            print("Could not read image")
            return False

        # Create a mask for text
        mask = np.zeros(img.shape[:2], dtype=np.uint8)
        
        # Convert to RGB for Tesseract
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Detect text data
        # Using psm 11 (Sparse text) and 6 (Assume a single uniform block of text)
        configs = [r'--psm 11', r'--psm 6']
        
        found_text = False
        
        for config in configs:
            data = pytesseract.image_to_data(rgb, config=config, output_type=pytesseract.Output.DICT)
            n_boxes = len(data['text'])
            
            for i in range(n_boxes):
                # Filter out low confidence and empty text
                text = data['text'][i].strip()
                conf = int(data['conf'][i])
                
                if conf > 30 and len(text) > 1:
                    found_text = True
                    (x, y, w, h) = (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
                    
                    # Draw rectangle on mask
                    # Expand slightly to cover anti-aliasing
                    pad = 5
                    cv2.rectangle(mask, (max(0, x-pad), max(0, y-pad)), (min(img.shape[1], x+w+pad), min(img.shape[0], y+h+pad)), 255, -1)

        if not found_text:
            print("  No text detected to remove.")
            # Just copy original if no text found
            cv2.imwrite(str(output_path), img)
            return True

        # Dilate mask to connect letters and cover artifacts
        kernel = np.ones((3,3), np.uint8)
        mask = cv2.dilate(mask, kernel, iterations=2)
        
        # Inpaint
        # Radius 3, using Telea algorithm
        restored = cv2.inpaint(img, mask, 3, cv2.INPAINT_TELEA)
        
        # Save
        cv2.imwrite(str(output_path), restored)
        print("  Text removed and image saved.")
        return True

    except Exception as e:
        print(f"Error removing text: {e}")
        return False

def main():
    setup_tesseract()
    
    # Test with Shawshank Redemption - a standard poster URL
    # This is a placeholder URL for a known poster (just an example search result)
    test_url = "https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" 
    # Using a high res poster URL usually found in search
    
    temp_dir = Path("public/temp_clean_test")
    temp_dir.mkdir(exist_ok=True)
    
    input_path = temp_dir / "shawshank_original.jpg"
    output_path = temp_dir / "shawshank_cleaned.jpg"
    
    print("Downloading test poster...")
    if download_image(test_url, input_path):
        print("Attempting to remove text...")
        remove_text_from_image(input_path, output_path)
        print(f"Check {output_path}")
    else:
        print("Failed to download test image")

if __name__ == "__main__":
    main()

