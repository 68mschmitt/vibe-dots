---
description: GPT OSS 20b - Low Temp Creative
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.1
top_p: 0.95
top_k: 40
max_new_tokens: 8192
repetition_penalty: 1.1
num_ctx: 8192
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#AA96DA"
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

# Test Configuration 05: Low Temp Creative

**Focus:** Slight creativity while maintaining structure
**Key Settings:**
- Temperature: 0.1 (minimal randomness)
- Top_p: 0.95 (wider probability)
- Top_k: 40 (more token choices)
- Repetition penalty: 1.1 (standard)

**Expected Behavior:** More varied tool selection and parameter choices while still maintaining proper formatting.

**Test with:** Creative problem-solving tasks where multiple tool approaches are valid.

**Note:** This is closest to your original configuration but with temperature lowered.
