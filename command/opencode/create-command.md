---
description: Generate a custom OpenCode command
agent: build
---

Create a new OpenCode command based on the following requirements:

$ARGUMENTS

The command should:
1. Be placed in the appropriate location (global ~/.config/opencode/command/ or project-local .opencode/command/)
2. Include proper frontmatter with:
   - description: Clear, concise description of what the command does
   - agent: Specify which agent should run this (general/build/plan/docs-context)
   - model: (optional) Override default model if needed
   - subtask: (optional) Set to true if command should run as a subagent
3. Use a clear, well-structured template that:
   - Uses $ARGUMENTS, $1, $2, etc. for command arguments
   - Uses !`command` syntax for shell command output if needed
   - Uses @filename for file references if needed
   - Provides specific instructions to the LLM
   - Includes relevant context and examples

Examples of good command patterns:
- Code generation: "Create a new React component named $1 with TypeScript support"
- Analysis: "Analyze test coverage: !`npm test` and suggest improvements"
- Review: "Review @$1 for performance issues and security vulnerabilities"
- Batch operations: "Run $1 on all files matching $2 pattern"

Create the command file with the appropriate name and content, following OpenCode command best practices.
