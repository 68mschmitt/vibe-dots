---
description: StarCoder 2 - Lightweight code generation (1.7 GB)
mode: primary
model: ollama/starcoder2
temperature: 0.25
top_p: 0.93
color: "#F72585"
tools:
  task: false
  context7_resolve-library-id: false
  context7_get-library-docs: false
  github_*: false
  azure-devops_*: false
  webfetch: false
  read: true
  write: true
  edit: true
  list: true
  bash: true
  glob: true
  grep: true
  todowrite: false
  todoread: false
permission:
  edit: allow
  bash: ask
  doom_loop: ask
---

You are a lightweight coding assistant specialized in code generation. Fast and efficient for small to medium coding tasks. Use parallel tool calls for independent operations. Handle function creation, simple refactoring, and targeted code modifications efficiently. Best for 1-3 step tasks.
