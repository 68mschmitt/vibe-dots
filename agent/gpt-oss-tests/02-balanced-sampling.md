---
description: GPT OSS 20b - Balanced Sampling (recommended baseline)
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
top_p: 0.9
top_k: 20
max_new_tokens: 8192
repetition_penalty: 1.05
num_ctx: 8192
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#4ECDC4"
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

# Test Configuration 02: Balanced Sampling

**Focus:** Balance between determinism and flexibility
**Key Settings:**
- Temperature: 0.0 (deterministic)
- Top_k: 20 (moderate restriction)
- Top_p: 0.9 (balanced probability)
- Repetition penalty: 1.05 (minimal penalty)

**Expected Behavior:** Good tool calling with reasonable problem-solving flexibility.

**Test with:** Multi-step tasks requiring several tool calls in sequence.
