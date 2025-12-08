#!/bin/bash
# Setup script to make scripts executable and run them
# This will install OpenCode configuration and create the tuned Ollama model

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "Vibe Dots Setup"
echo "=========================================="
echo ""

# Make scripts executable
echo "Making scripts executable..."
chmod +x "$SCRIPT_DIR/install.sh"
chmod +x "$SCRIPT_DIR/create-tuned-model.sh"
echo "✓ Scripts are now executable"
echo ""

# Run install.sh
echo "=========================================="
echo "Step 1: Installing OpenCode configuration"
echo "=========================================="
echo ""
"$SCRIPT_DIR/install.sh"

echo ""
echo "=========================================="
echo "Step 2: Creating tuned Ollama model"
echo "=========================================="
echo ""
"$SCRIPT_DIR/create-tuned-model.sh"

echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Your OpenCode configuration has been installed and"
echo "the gpt-oss:20b-16k-tools model has been created."
