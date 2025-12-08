#!/bin/bash
# Create tuned GPT-OSS model in Ollama
# This script creates a model optimized for tool calling with deterministic sampling

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODELFILE="$SCRIPT_DIR/ollama-model-files/gpt-oss-20b-tool-tune/Modelfile"
MODEL_NAME="gpt-oss:20b-16k-tools"

echo "Creating Ollama model: $MODEL_NAME"
echo "Using Modelfile: $MODELFILE"
echo ""

if [ ! -f "$MODELFILE" ]; then
    echo "Error: Modelfile not found at $MODELFILE"
    exit 1
fi

# Create the model
ollama create "$MODEL_NAME" -f "$MODELFILE"

echo ""
echo "✓ Model '$MODEL_NAME' created successfully!"
echo ""
echo "To use this model:"
echo "  ollama run $MODEL_NAME"
