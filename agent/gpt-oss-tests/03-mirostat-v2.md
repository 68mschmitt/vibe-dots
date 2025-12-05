---
description: GPT OSS 20b - Mirostat v2 Sampling
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.0
mirostat: 2
mirostat_tau: 0.8
mirostat_eta: 0.1
max_new_tokens: 8192
repetition_penalty: 1.0
num_ctx: 8192
stop: ["</tool_call>", "</function_calls>", "Human:", "User:"]
color: "#95E1D3"
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

# Test Configuration 03: Mirostat v2

**Focus:** Advanced perplexity control for structured output
**Key Settings:**
- Temperature: 0.0
- Mirostat: 2 (dynamic sampling based on perplexity)
- Mirostat_tau: 0.8 (target perplexity)
- Mirostat_eta: 0.1 (learning rate)
- No top_k/top_p (Mirostat replaces these)

**Expected Behavior:** Better quality for structured generation like tool calls, potentially superior JSON/XML formatting.

**Test with:** Complex tool calls with many parameters, nested structures.
