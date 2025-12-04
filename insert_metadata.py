import re

# Read the missing metadata file
with open('missing_metadata.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the comment line
content = content.replace('// Missing categories metadata:', '').strip()

# Read the data.ts file
with open('app/data.ts', 'r', encoding='utf-8') as f:
    data_ts = f.read()

# Find the closing brace of CATEGORY_METADATA
# It should be before the final }; at the end
# We need to insert before line 5935 which has };

# Find the position right before the closing };
lines = data_ts.split('\n')
insert_pos = None
for i in range(len(lines) - 1, -1, -1):
    if lines[i].strip() == '};' and i > 5900:  # Should be around line 5935
        insert_pos = i
        break

if insert_pos:
    # Add a comma after the last category entry before inserting
    # Check if the line before }; ends with },
    if lines[insert_pos - 1].strip().endswith('},'):
        # Insert the new categories before the closing };
        # Format: add comma after last entry, then add new entries
        new_content = ',\n' + content
        lines.insert(insert_pos, new_content)
    
    # Write back
    with open('app/data.ts', 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f"Inserted metadata at line {insert_pos}")
else:
    print("Could not find insertion point")
