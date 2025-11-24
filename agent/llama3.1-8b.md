---
description: Llama 3.1 8B - Balanced for moderate complexity (4.9 GB)
mode: primary
model: ollama/llama3.1:8b
temperature: 0.3
top_p: 0.9
color: "#4ECDC4"
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
  todowrite: true
  todoread: true
permission:
  edit: allow
  bash: ask
  doom_loop: ask
---

You are a balanced coding assistant. Be direct and efficient. Handle moderate-complexity tasks with 2-4 steps. Use parallel tool calls when operations are independent. Use todowrite for tasks with 3+ steps. Focus on file operations, basic refactoring, and straightforward implementations.
