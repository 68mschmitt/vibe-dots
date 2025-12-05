# GPT-OSS 20b Tool Calling Test Configurations

This directory contains 7 different agent configurations for testing tool calling reliability with the GPT-OSS 20b model.

## Quick Test Guide

### Phase 1: Simple Tool Calls
Test each configuration with:
```
"Read the file gpt-oss.md"
"List files in the current directory"
"Find all .md files in the agent directory"
```

### Phase 2: Sequential Tool Calls
```
"Read the README.md file, then create a summary file called summary.txt"
"Find all Python files, then count how many there are"
```

### Phase 3: Complex Tool Usage
```
"Search for all instances of 'temperature' in agent configs, then create a comparison table"
"Read multiple config files and identify common patterns"
```

## Configuration Overview

| Config | Focus | Temperature | Top_k | Top_p | Best For |
|--------|-------|-------------|-------|-------|----------|
| **01-ultra-deterministic** | Max consistency | 0.0 | 10 | 0.85 | Most reliable tool calling |
| **02-balanced-sampling** | Recommended baseline | 0.0 | 20 | 0.9 | General use |
| **03-mirostat-v2** | Structured output | 0.0 | - | - | Complex JSON/XML |
| **04-high-context** | Long conversations | 0.0 | 20 | 0.9 | Multi-step workflows |
| **05-low-temp-creative** | Slight flexibility | 0.1 | 40 | 0.95 | Creative tasks |
| **06-no-repetition-penalty** | No penalties | 0.0 | 20 | 0.9 | Repeated structures |
| **07-minimal-aggressive** | Nuclear option | 0.0 | 5 | 0.8 | Last resort |

## Testing Strategy

1. **Start with 01-ultra-deterministic** - Most likely to work
2. **Try 02-balanced-sampling** - If you want more flexibility
3. **Test 03-mirostat-v2** - If having JSON formatting issues
4. **Use 04-high-context** - For complex multi-tool tasks
5. **Try 06-no-repetition-penalty** - If tools seem "hesitant"
6. **Use 07-minimal-aggressive** - Only if others fail

## Success Criteria

✅ **Pass:** Model correctly formats tool calls and they execute
✅ **Pass:** Model can chain multiple tools together
✅ **Pass:** Model provides good explanations alongside tool use

❌ **Fail:** Malformed tool call XML/JSON
❌ **Fail:** Tools not called when needed
❌ **Fail:** Incomplete or truncated tool calls

## Recommended Next Steps

Once you find a working configuration:

1. **Gradually enable more tools** (webfetch, github, azure-devops)
2. **Test task agent** (important for complex workflows)
3. **Adjust temperature up slightly** if you need more creativity
4. **Increase context window** if working with large files

## Notes

- All configs have external tools disabled by default
- Start with basic file operations before enabling bash
- Color coding helps quickly identify which agent you're using
- Test each config for at least 5-10 tool calls before deciding

## Performance Tips

- **GPU Memory:** Configs with higher num_ctx need more VRAM
- **Speed:** Lower top_k values = faster generation
- **Quality:** Lower temperature = more consistent but less creative

## Recording Results

Create a test log:
```markdown
## Config 01 Test Results
- Simple read: ✅ Worked perfectly
- Sequential tasks: ✅ Good
- Complex workflows: ❌ Sometimes skips tools

## Config 02 Test Results
...
```

Good luck testing! 🚀
