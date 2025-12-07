---
description: GPT OSS 20b
mode: primary
model: ollama/gpt-oss:20b
temperature: 0.25
top_p: 0.92
color: "#00B4D8"
tools:
  task: false
  context7_resolve-library-id: true
  context7_get-library-docs: true
  github_*: false
  azure-devops_*: false
  webfetch: true
  read: true
  write: true
  edit: true
  list: true
  bash: true
  glob: true
  grep: true
  todowrite: false
  todoread: false
  tts_elevenlabs_tts: true
permission:
  edit: allow
  bash: allow
  doom_loop: ask
---
