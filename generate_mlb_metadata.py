from pathlib import Path
import re

def to_title_case(kebab):
    """Convert kebab-case to Title Case"""
    parts = kebab.split('-')
    result = []
    for part in parts:
        # Handle special cases like "st-louis" -> "St. Louis"
        if part == 'st':
            result.append('St.')
        elif part == 'louis':
            result.append('Louis')
        else:
            result.append(part.capitalize())
    return ' '.join(result)

folder_path = Path('public/images/mlb-teams')
files = sorted([f for f in folder_path.glob('*') if f.is_file() and f.suffix in ['.jpg', '.png', '.jpeg']])

print('  "MLB teams": {')
print('    name: "MLB teams",')
print('    folder: "mlb-teams",')
print('    examples: [')
entries = []
for f in files:
    name = to_title_case(f.stem)
    entries.append(f'      {{ name: "{name}", image: "{f.name}", alternatives: [] }}')
print(',\n'.join(entries))
print('    ],')
print('  },')



