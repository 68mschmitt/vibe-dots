---
description: GPT OSS 20b - High Context Window
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
top_p: 0.9
top_k: 20
max_new_tokens: 12288
repetition_penalty: 1.05
num_ctx: 16384
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#F38181"
tools:
  read: true
  write: true
  edit: true
  list: true
  bash: true
  glob: true
  grep: true
  todowrite: true
  todoread: true
  task: false
  context7_*: false
  github_*: false
  azure-devops_*: false
  webfetch: false
permission:
  edit: allow
  bash: allow
  doom_loop: allow
---

# Test Configuration 04: High Context Window

**Focus:** Maximum context for better tool call understanding
**Key Settings:**
- Temperature: 0.0
- Num_ctx: 16384 (doubled context window)
- Max_new_tokens: 12288 (increased output length)
- Standard sampling parameters

**Expected Behavior:** Better understanding of complex multi-tool sequences, improved reasoning about which tools to use.

**Test with:** Long conversations with many tool calls, complex multi-step workflows.

**Note:** Requires more VRAM (~24GB+), may be slower.
