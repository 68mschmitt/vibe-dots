---
description: GPT OSS 20b - Minimal Aggressive
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
top_p: 0.8
top_k: 5
max_new_tokens: 8192
repetition_penalty: 1.0
num_ctx: 8192
min_p: 0.05
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#FFFFD2"
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

# Test Configuration 07: Minimal Aggressive

**Focus:** Extremely restricted sampling for maximum consistency
**Key Settings:**
- Temperature: 0.0
- Top_k: 5 (very aggressive restriction)
- Top_p: 0.8 (narrow probability)
- Min_p: 0.05 (minimum probability threshold)
- No repetition penalty

**Expected Behavior:** Most reliable tool call formatting, potentially less creative problem-solving.

**Test with:** Start here if all other configs fail - if this works, gradually relax constraints.

**Note:** This is the "nuclear option" for tool calling reliability.
