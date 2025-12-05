#!/usr/bin/env bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/.config/opencode"

echo "Source directory: $SCRIPT_DIR"
echo "Target directory: $TARGET_DIR"
echo ""

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Function to create symlink
create_symlink() {
    local source="$1"
    local target="$2"
    local relative_path="${source#$SCRIPT_DIR/}"
    
    # Skip the install script itself
    if [[ "$relative_path" == "install.sh" ]]; then
        return
    fi
    
    # Check if target already exists
    if [[ -e "$target" ]] || [[ -L "$target" ]]; then
        # Check if it's already a symlink pointing to our source
        if [[ -L "$target" ]] && [[ "$(readlink "$target")" == "$source" ]]; then
            echo -e "${GREEN}✓${NC} Already linked: $relative_path"
            return
        fi
        
        # Check if it's a symlink pointing somewhere else or a different file
        if [[ -L "$target" ]]; then
            existing_target="$(readlink "$target")"
            echo -e "${YELLOW}⊘${NC} Skipping (existing symlink): $relative_path -> $existing_target"
        else
            echo -e "${YELLOW}⊘${NC} Skipping (existing file): $relative_path"
        fi
        return
    fi
    
    # Create parent directory if needed
    local target_parent="$(dirname "$target")"
    mkdir -p "$target_parent"
    
    # Create the symlink
    ln -s "$source" "$target"
    echo -e "${GREEN}+${NC} Linked: $relative_path"
}

# Function to recursively process directory
process_directory() {
    local source_dir="$1"
    local target_dir="$2"
    
    # Process all files and directories in source
    while IFS= read -r -d '' item; do
        local relative_path="${item#$SCRIPT_DIR/}"
        local target_path="$TARGET_DIR/$relative_path"
        
        if [[ -d "$item" ]]; then
            # For directories, just ensure they exist in target and recurse
            mkdir -p "$target_path"
            process_directory "$item" "$target_path"
        else
            # For files, create symlink
            create_symlink "$item" "$target_path"
        fi
    done < <(find "$source_dir" -maxdepth 1 -mindepth 1 -print0 | sort -z)
}

echo "Starting symlink installation..."
echo ""

# Process all items in the source directory
for item in "$SCRIPT_DIR"/*; do
    if [[ ! -e "$item" ]]; then
        continue
    fi
    
    relative_path="${item#$SCRIPT_DIR/}"
    target_path="$TARGET_DIR/$relative_path"
    
    # Skip the install script
    if [[ "$relative_path" == "install.sh" ]]; then
        continue
    fi
    
    if [[ -d "$item" ]]; then
        # For directories, create target directory and process contents
        mkdir -p "$target_path"
        process_directory "$item" "$target_path"
    else
        # For files, create symlink
        create_symlink "$item" "$target_path"
    fi
done

echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo "All files from $SCRIPT_DIR have been symlinked to $TARGET_DIR"
echo "Existing files that don't match source files were preserved."
