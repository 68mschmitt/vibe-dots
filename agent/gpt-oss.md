---
description: GPT OSS 20b
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.2
top_p: 0.95
top_k: 40
max_new_tokens: 4096
repetition_penalty: 1.1
color: "#00B4D8"
tools:
  task: true
  context7_resolve-library-id: true
  context7_get-library-docs: true
  github_*: true
  azure-devops_*: true
  webfetch: true
  read: true
  write: true
  edit: true
  list: true
  bash: true
  glob: true
  grep: true
  todowrite: true
  todoread: true
permission:
  edit: allow
  bash: allow
  doom_loop: allow
---
