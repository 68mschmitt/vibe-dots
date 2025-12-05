---
description: GPT OSS 20b
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.25
top_p: 0.92
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
  bash: ask
  doom_loop: ask
---
