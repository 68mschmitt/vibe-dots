---
description: GPT OSS 20b - No Repetition Penalty
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
top_p: 0.9
top_k: 20
max_new_tokens: 8192
repetition_penalty: 1.0
num_ctx: 8192
stop: ["</tool_call>", "</function_calls>", "Human:", "User:", "<|im_end|>", "<|end|>"]
color: "#FCBAD3"
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

# Test Configuration 06: No Repetition Penalty

**Focus:** Eliminate repetition penalty that may harm tool calling
**Key Settings:**
- Temperature: 0.0
- Repetition penalty: 1.0 (disabled)
- Additional stop tokens for common chat templates
- Standard sampling otherwise

**Expected Behavior:** Better handling of repeated parameter names and tool structures without penalty.

**Test with:** Tool calls with many similar parameters, repeated tool usage.

**Note:** Tool calls often require repetitive JSON/XML structures - penalizing repetition may break formatting.
