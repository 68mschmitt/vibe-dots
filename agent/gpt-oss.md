---
description: GPT OSS 20b
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.25
top_p: 0.92
color: "#00B4D8"
tools:
  task: false
  context7_resolve-library-id: false
  context7_get-library-docs: false
  github_*: false
  azure-devops_*: false
  webfetch: false
  read: false
  write: false
  edit: false
  list: false
  bash: false
  glob: false
  grep: false
  todowrite: false
  todoread: false
permission:
  edit: allow
  bash: ask
  doom_loop: ask
---
