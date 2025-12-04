import os
import json

# Map category names to folder names
category_to_folder = {
    "Apps": "apps",
    "Amusement Parks": "amusement-parks",
    "Books": "books",
    "Comedians": "comedians",
    "Dogs": "dogs",
    "Fair foods": "fair-foods",
    "Fast food chains": "fast-food-chains",
    "Famous people who died before turning 30": "famous-people-under-30",
    "Fridge": "fridge",
    "Garage": "garage",
    "Holidays": "holidays",
    "Horses": "horses",
    "Laundry": "laundry",
    "MLB Teams": "mlb-teams",
    "Movies": "movies",
    "Sports": "sports",
    "States": "states",
    "Superheros": "superheros",
    "Thanksgiving": "thanksgiving",
    "Chilis": "chilis",  # might not exist
    "Math": "math",  # might not exist
}

def get_image_files(folder_path):
    """Get all image files from a folder."""
    if not os.path.exists(folder_path):
        return []
    files = [f for f in os.listdir(folder_path)
             if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
    return sorted(files)

def format_name(filename):
    """Convert filename to a readable name."""
    # Remove extension
    name = os.path.splitext(filename)[0]
    # Replace hyphens and underscores with spaces
    name = name.replace('-', ' ').replace('_', ' ')
    # Title case
    return ' '.join(word.capitalize() for word in name.split())

def generate_metadata(category, folder):
    """Generate metadata entry for a category."""
    folder_path = f"public/images/{folder}"
    images = get_image_files(folder_path)

    if not images:
        return None

    examples = []
    for img in images[:50]:  # Limit to 50 examples
        examples.append({
            "name": format_name(img),
            "image": img,
            "alternatives": []
        })

    return {
        "name": category,
        "folder": folder,
        "examples": examples
    }

# Generate metadata for all missing categories
results = {}
for category, folder in category_to_folder.items():
    metadata = generate_metadata(category, folder)
    if metadata:
        results[category] = metadata

# Print as TypeScript object
print("// Missing categories metadata:")
for category, metadata in sorted(results.items()):
    print(f'  "{category}": {{')
    print(f'    name: "{metadata["name"]}",')
    print(f'    folder: "{metadata["folder"]}",')
    print('    examples: [')
    for example in metadata["examples"]:
        print(f'      {{')
        print(f'        name: "{example["name"]}",')
        print(f'        image: "{example["image"]}",')
        print(f'        alternatives: [],')
        print(f'      }},')
    print('    ],')
    print('  },')
