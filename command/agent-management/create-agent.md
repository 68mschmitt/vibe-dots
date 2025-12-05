---
description: Generate optimized OpenCode agents based on task requirements
agent: build
---

# Agent Generator for OpenCode

Generate an optimized OpenCode agent configuration based on the task: "$ARGUMENTS"

## Generation Process

### Phase 1: Task Analysis
Use sequential thinking to analyze the request:
1. Extract primary objective and domain
2. Determine complexity level (simple/moderate/complex)
3. Identify required capabilities
4. Define success criteria

If the request is ambiguous, ask for clarification:
- For development tasks: language, framework, testing approach
- For automation: target systems, frequency, error handling
- For analysis: depth, output format, specific metrics

### Phase 2: Capability Mapping

Map required capabilities to OpenCode tools:

#### Core Tool Categories
- **File Operations**: read, write, edit, list, glob, grep
- **Execution**: bash, webfetch
- **Task Management**: todowrite, todoread, task
- **Thinking**: sequential-thinking (for complex reasoning)
- **Specialized**: Browser automation (puppeteer), TTS, GitHub/Azure DevOps tools

#### MCP Servers (if available)
- **context7**: Library documentation search
- **github**: GitHub API operations (high token usage)
- **azure-devops**: Azure DevOps operations

Select minimal required tools for the task. Prefer core tools over MCP servers when possible.

### Phase 3: Model Selection

Choose appropriate model based on task requirements:

```
Simple tasks (formatting, basic edits):
  → anthropic/claude-haiku-4-20250514 or openai/gpt-4o-mini

Standard development tasks:
  → anthropic/claude-sonnet-4-20250514 (default)

Complex reasoning/architecture:
  → anthropic/claude-opus-4-20250514 or openai/gpt-4o

Research/documentation:
  → Model with good context length (sonnet or gpt-4o)
```

### Phase 4: Agent Configuration Generation

Generate two configuration files:

1. **Agent Configuration**: `~/.config/opencode/agent/[agent-name].md`
2. **Optional Command**: `~/.config/opencode/command/[command-name].md` (if task is repetitive)

## Output Format

### Agent Configuration Template

```markdown
# ~/.config/opencode/agent/[descriptive-name].md
---
description: [Clear, concise description for LLM agent selection]
mode: [primary|subagent|all]
model: [selected-model]
temperature: [0.0-1.0, lower for deterministic, higher for creative]
tools:
  # Core tools
  read: [true|false]
  write: [true|false]
  edit: [true|false]
  bash: [true|false]
  webfetch: [true|false]
  # Task management
  todowrite: [true|false]
  task: [true|false]
  # Disable unnecessary MCP tools
  mcp_*: false
permission:
  edit: [allow|ask|deny]
  bash:
    "[specific-command]*": [allow|ask|deny]
    "*": ask
---

You are a specialized agent for [specific purpose].

## Primary Objective
[Clear statement of what this agent accomplishes]

## Approach
1. [Step 1 of your methodology]
2. [Step 2 of your methodology]
3. [Step 3 of your methodology]

## Key Principles
- [Principle 1: e.g., "Prioritize code clarity over brevity"]
- [Principle 2: e.g., "Write comprehensive tests"]
- [Principle 3: e.g., "Follow project conventions"]

## Constraints
- [Any limitations or boundaries]
- [Security considerations]
- [Resource limitations]

## Success Criteria
- [Measurable outcome 1]
- [Measurable outcome 2]
```

### Optional Command Configuration

For repetitive tasks, also generate:

```markdown
# ~/.config/opencode/command/[command-name].md
---
description: [Brief description shown in TUI]
agent: [agent-name-from-above]
subtask: [true if should run in child session]
---

[Template with $ARGUMENTS or $1, $2 placeholders]
```

## Implementation Guidelines

### Agent Naming Conventions
- Use descriptive, lowercase names with hyphens
- Examples: `api-builder`, `test-writer`, `code-reviewer`, `doc-generator`

### Temperature Settings
- 0.0-0.2: Deterministic tasks (formatting, refactoring)
- 0.3-0.5: Standard development tasks
- 0.6-0.8: Creative tasks (design, architecture)
- 0.9-1.0: Brainstorming, exploration

### Mode Selection
- `primary`: For main workflow agents (switch with Tab)
- `subagent`: For specialized tasks (invoke with @mention)
- `all`: Flexible use in both contexts

### Permission Strategy
- Development agents: `edit: allow`, `bash: ask` for dangerous commands
- Analysis agents: `edit: deny`, `bash: deny` or highly restricted
- Automation agents: Specific command allowlists

## Examples

### Example 1: API Builder Agent
Task: "Build REST API with FastAPI"

Generated configuration:
```markdown
# ~/.config/opencode/agent/fastapi-builder.md
---
description: Builds REST APIs with FastAPI including tests and docs
mode: all
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
tools:
  read: true
  write: true
  edit: true
  bash: true
  webfetch: true
  todowrite: true
  mcp_*: false
permission:
  edit: allow
  bash:
    "pip install*": allow
    "pytest*": allow
    "uvicorn*": allow
    "rm -rf*": deny
    "*": ask
---

You are specialized in building FastAPI REST APIs.

## Primary Objective
Build production-ready REST APIs with FastAPI, including comprehensive testing and documentation.

## Approach
1. Design RESTful endpoints following OpenAPI specifications
2. Implement with FastAPI best practices and Pydantic validation
3. Write pytest tests with high coverage
4. Generate interactive API documentation

## Key Principles
- Use dependency injection for clean architecture
- Implement proper error handling and status codes
- Follow 12-factor app principles
- Write tests before or alongside implementation

## Success Criteria
- All endpoints have Pydantic models for request/response
- Test coverage above 80%
- API documentation auto-generated and accurate
- Proper async/await usage where beneficial
```

### Example 2: Code Reviewer Subagent
Task: "Review code for security and quality"

Generated configuration:
```markdown
# ~/.config/opencode/agent/security-reviewer.md
---
description: Reviews code for security vulnerabilities and quality issues
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  read: true
  write: false
  edit: false
  bash: false
  grep: true
  glob: true
permission:
  edit: deny
  bash: deny
---

You are a security-focused code reviewer.

## Primary Objective
Identify security vulnerabilities, code smells, and quality issues without modifying code.

## Approach
1. Scan for common security vulnerabilities (OWASP Top 10)
2. Check for code quality issues and anti-patterns
3. Verify proper input validation and sanitization
4. Review authentication and authorization logic

## Key Principles
- Never modify code directly - only provide recommendations
- Prioritize security issues by severity
- Provide actionable feedback with examples
- Reference security best practices and standards

## Success Criteria
- All security vulnerabilities identified and documented
- Clear remediation steps provided
- False positive rate minimized
```

## Error Handling

If agent generation fails:
1. Provide manual configuration template
2. Explain which capabilities are missing
3. Suggest alternative approaches

## Usage

After generating configurations:
1. Review generated files in `~/.config/opencode/agent/` and `~/.config/opencode/command/`
2. Test agent with: `@[agent-name] test task` or switch with Tab key
3. Refine configuration as needed
4. Share successful agents with team via version control

## Important Notes

- Start with minimal tool sets and add as needed
- Use subagents to isolate contexts and reduce token usage
- Set appropriate permissions for safety
- Document agent purpose clearly for LLM selection
- Test agents with simple tasks before complex ones

Now generating agent configuration based on your requirements...
