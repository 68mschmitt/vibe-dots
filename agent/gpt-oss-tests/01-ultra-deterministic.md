---
description: GPT OSS 20b - Ultra Deterministic (temp=0, minimal sampling)
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
top_p: 0.85
top_k: 10
max_new_tokens: 8192
repetition_penalty: 1.0
num_ctx: 8192
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#FF6B6B"
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

# Test Configuration 01: Ultra Deterministic

**Focus:** Maximum determinism for consistent tool calling
**Key Settings:**
- Temperature: 0.0 (completely deterministic)
- Top_k: 10 (very restricted token selection)
- Top_p: 0.85 (focused probability mass)
- Repetition penalty: 1.0 (disabled to allow parameter repetition)

**Expected Behavior:** Most consistent tool call structure, may be less creative in problem-solving.

**Test with:** Simple file read/write operations, then bash commands.
