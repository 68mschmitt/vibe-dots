---
description: Deep-analyze the project and create CONTEXT.md files at every directory level for AI agent context
agent: context-mapper
subtask: true
---
Analyze this project and create CONTEXT.md files throughout the directory tree.

Target directory: $ARGUMENTS

If no target directory was specified, analyze the entire project starting from the root.

Steps:
1. Map the full directory structure, skipping ignored directories (node_modules, .git, dist, build, etc.).
2. Identify every directory that contains meaningful source code.
3. Announce the full list of directories you will process and the order (bottom-up, leaves first).
4. For each directory, read its source files and create a CONTEXT.md following your format guidelines.
5. Finish with the root-level CONTEXT.md that ties everything together.
6. Print a final summary: how many files created, total directories processed.

Be thorough but concise. These files exist to save future AI agents from having to do this same exploration.
