# Categories that already exist (found at earlier lines)
existing_categories = {
    "Apps": 2265,
    "Books": 3999,
    "Dogs": 5593,
}

# Read the file
with open('app/data.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and mark duplicate entries to remove
# Duplicates start at: 6156 (Apps), 6407 (Books), 6914 (Dogs)
duplicate_starts = [6156, 6407, 6914]

# For each duplicate, find where it ends (look for closing },)
to_remove = set()
for start_line in duplicate_starts:
    # Start from the line with the category name
    i = start_line - 1  # Convert to 0-based index
    depth = 0
    started = False
    while i < len(lines):
        line = lines[i]
        if '"' in line and ':' in line and '{' in line and not started:
            started = True
            depth = 1
        elif '{' in line:
            depth += line.count('{')
        if '}' in line:
            depth -= line.count('}')
            if depth == 0 and started:
                # Found the end
                to_remove.update(range(start_line - 1, i + 1))
                break
        i += 1

# Remove the duplicate lines (in reverse order to maintain indices)
for line_num in sorted(to_remove, reverse=True):
    del lines[line_num]

# Write back
with open('app/data.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f"Removed {len(to_remove)} lines containing duplicate entries")
