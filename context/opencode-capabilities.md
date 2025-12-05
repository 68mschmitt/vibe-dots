# OpenCode Capabilities Reference

This document provides a comprehensive reference of all OpenCode capabilities for use when generating configurations or advising on OpenCode usage.

## Table of Contents
- [Core Architecture](#core-architecture)
- [Built-in Tools](#built-in-tools)
- [Agents System](#agents-system)
- [Custom Commands](#custom-commands)
- [Language Support](#language-support)
- [Integration Capabilities](#integration-capabilities)
- [Configuration System](#configuration-system)
- [Session Management](#session-management)
- [Permissions & Security](#permissions--security)

---

## Core Architecture

### Terminal User Interface (TUI)
- **Interactive prompt** with markdown rendering
- **File references**: Use `@filename` for fuzzy file search and automatic inclusion
- **Bash execution**: Prefix commands with `!` to run shell commands
- **Slash commands**: Built-in commands like `/init`, `/undo`, `/redo`, `/share`, `/help`
- **External editor**: Use `ctrl+x e` or `/editor` to compose in your preferred editor
- **Image support**: Drag and drop images into prompts for visual context

### Session Features
- **Multi-session support**: Switch between conversations with `/sessions` or `ctrl+x l`
- **Undo/Redo**: Git-based file change reversal with `/undo` and `/redo`
- **Session sharing**: Share conversations with `/share` command
- **Export**: Export conversations to Markdown with `/export` or `ctrl+x x`
- **Session compaction**: Reduce context size with `/compact` or `ctrl+x c`

---

## Built-in Tools

### File Operations
```json
{
  "tools": {
    "read": true,      // Read file contents with line range support
    "write": true,     // Create new files or overwrite existing
    "edit": true,      // Exact string replacement edits
    "patch": true,     // Apply patch files
    "list": true,      // List directory contents
    "glob": true,      // Find files by pattern (e.g., "**/*.ts")
    "grep": true       // Search file contents with regex
  }
}
```

**Key Features**:
- Uses ripgrep for fast searching
- Respects `.gitignore` by default
- `.ignore` file support for explicit inclusions

### Task Management
```json
{
  "tools": {
    "todowrite": true,  // Create and update task lists
    "todoread": true    // Read current todo state
  }
}
```

**Usage**: LLM automatically uses for organizing multi-step tasks

### Execution Tools
```json
{
  "tools": {
    "bash": true,       // Execute shell commands
    "webfetch": true    // Fetch and read web content
  }
}
```

### Tool Configuration
- **Global enable/disable**: Control all tools in `tools` section
- **Per-agent override**: Customize tool access per agent
- **Wildcard patterns**: Use `"mcp_*": false` to disable tool groups

---

## Agents System

### Agent Types

#### Primary Agents
Agents you interact with directly. Switch with **Tab** key.

**Built-in Primary Agents**:
- `build` (default): Full tools access for development
- `plan`: Read-only analysis mode (write/edit/bash disabled by default)

#### Subagents
Invoked by primary agents or via `@mention` for specialized tasks.

**Built-in Subagent**:
- `general`: Research, code search, multi-step tasks

### Agent Configuration

**JSON Configuration**:
```json
{
  "agent": {
    "agent-name": {
      "description": "What this agent does and when to use it",
      "mode": "primary",  // or "subagent" or "all"
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.1,
      "prompt": "{file:./prompts/custom.txt}",
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      },
      "permission": {
        "edit": "ask",     // "ask", "allow", or "deny"
        "bash": {
          "git push": "ask",
          "git *": "ask",
          "*": "allow"
        }
      }
    }
  }
}
```

**Markdown Configuration**:
```markdown
---
description: Reviews code for quality
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
permission:
  bash: deny
---

You are in code review mode. Focus on quality and security.
```

**Location**:
- Global: `~/.config/opencode/agent/name.md`
- Per-project: `.opencode/agent/name.md`

### Agent Options
- `description` (required): Brief description for LLM selection
- `mode`: "primary", "subagent", or "all" (default: "all")
- `model`: Override default model
- `temperature`: 0.0-1.0 (0=deterministic, 1=creative)
- `prompt`: Custom system prompt file path
- `tools`: Enable/disable specific tools
- `permission`: Fine-grained permission control
- `disable`: Set to `true` to disable agent

### Agent Navigation
- **Tab**: Cycle through primary agents
- **ctrl+x Right/Left**: Navigate parent/child sessions when subagents create child sessions

---

## Custom Commands

### Command Definition

**JSON Configuration**:
```json
{
  "command": {
    "test": {
      "template": "Run tests with coverage.\n$ARGUMENTS",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-sonnet-4-20250514",
      "subtask": false
    }
  }
}
```

**Markdown Configuration**:
```markdown
---
description: Create a new component
agent: build
subtask: true
---

Create a React component named $ARGUMENTS with TypeScript.
```

**Location**:
- Global: `~/.config/opencode/command/name.md`
- Per-project: `.opencode/command/name.md`

### Template Features

**Arguments**:
- `$ARGUMENTS`: All arguments as string
- `$1`, `$2`, `$3`, etc.: Individual positional arguments

**Shell Output Injection**:
```markdown
Recent commits:
!`git log --oneline -10`

Test results:
!`npm test`
```

**File References**:
```markdown
Review the component in @src/components/Button.tsx
```

### Command Options
- `template` (required): Prompt template
- `description`: Shown in TUI
- `agent`: Which agent executes command
- `subtask`: Force subagent invocation (boolean)
- `model`: Override model for command

---

## Language Support

### LSP Servers (20+ Languages)

**Automatic Detection** when file extensions and requirements are met:

| Language | Extensions | Requirements |
|----------|-----------|--------------|
| TypeScript/JavaScript | .ts, .tsx, .js, .jsx, .mjs, .cjs | `typescript` in package.json |
| Python | .py, .pyi | `pyright` installed |
| Go | .go | `go` command |
| Rust | .rs | `rust-analyzer` command |
| C/C++ | .c, .cpp, .h, .hpp | Auto-installs clangd |
| Java | .java | Java SDK 21+ |
| Ruby | .rb, .rake, .gemspec | `ruby` and `gem` commands |
| PHP | .php | Auto-installs intelephense |
| Elixir | .ex, .exs | `elixir` command |
| C# | .cs | .NET SDK |
| Swift/Objective-C | .swift, .objc | `swift` or Xcode |
| Zig | .zig, .zon | `zig` command |
| Lua | .lua | Auto-installs lua-ls |
| Vue | .vue | Auto-installs for Vue projects |
| Svelte | .svelte | Auto-installs for Svelte projects |
| Astro | .astro | Auto-installs for Astro projects |
| YAML | .yaml, .yml | Auto-installs yaml-language-server |
| ESLint | .ts, .tsx, .js, .jsx, .vue | `eslint` in package.json |
| Deno | .ts, .tsx, .js | `deno` command + deno.json |

**Configuration**:
```json
{
  "lsp": {
    "typescript": {
      "disabled": false,
      "command": ["typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx"],
      "env": { "NODE_ENV": "development" },
      "initialization": {}
    },
    "custom-lsp": {
      "command": ["custom-lsp", "--stdio"],
      "extensions": [".custom"]
    }
  }
}
```

### Code Formatters (15+ Formatters)

**Automatic Formatting** after edits/writes:

| Formatter | Extensions | Requirements |
|-----------|-----------|--------------|
| Prettier | .js, .ts, .html, .css, .md, .json, .yaml | `prettier` in package.json |
| Biome | .js, .ts, .html, .css, .json | `biome.json(c)` config |
| gofmt | .go | `gofmt` command |
| Ruff | .py, .pyi | `ruff` command + config |
| uv | .py, .pyi | `uv` command |
| RuboCop | .rb, .rake, .gemspec | `rubocop` command |
| StandardRB | .rb, .rake | `standardrb` command |
| htmlbeautifier | .erb, .html.erb | `htmlbeautifier` command |
| clang-format | .c, .cpp, .h, .hpp | `.clang-format` config |
| ktlint | .kt, .kts | `ktlint` command |
| mix | .ex, .exs, .eex, .heex | `mix` command |
| zig fmt | .zig, .zon | `zig` command |

**Configuration**:
```json
{
  "formatter": {
    "prettier": {
      "disabled": false,
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": { "NODE_ENV": "development" },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

**Note**: `$FILE` placeholder replaced with file path

---

## Integration Capabilities

### GitHub Integration

**Setup**:
```bash
opencode github install
# Or manually add .github/workflows/opencode.yml
```

**Workflow Configuration**:
```yaml
name: opencode
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  opencode:
    if: |
      contains(github.event.comment.body, '/oc') ||
      contains(github.event.comment.body, '/opencode')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: sst/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        with:
          model: anthropic/claude-sonnet-4-20250514
          share: true
```

**Capabilities**:
- Triage and explain issues
- Fix bugs and implement features (creates PR)
- Review PRs and make changes
- Comment on specific code lines
- Automatic branch and PR creation

**Usage Examples**:
```
/opencode explain this issue
/opencode fix this
Delete S3 attachment when note removed /oc
[On code line] /oc add error handling here
```

### GitLab Integration
Similar to GitHub integration (check docs for setup)

### MCP Servers (Model Context Protocol)

**Local MCP Servers**:
```json
{
  "mcp": {
    "local-server": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "my-mcp-server"],
      "environment": {
        "API_KEY": "{env:MY_API_KEY}"
      },
      "timeout": 5000
    }
  }
}
```

**Remote MCP Servers**:
```json
{
  "mcp": {
    "remote-server": {
      "type": "remote",
      "enabled": true,
      "url": "https://my-mcp-server.com",
      "headers": {
        "Authorization": "Bearer {env:API_KEY}"
      },
      "timeout": 5000
    }
  }
}
```

**Popular MCP Servers**:
- **Context7**: Documentation search across libraries
- **Grep by Vercel**: Search GitHub code snippets
- **GitHub MCP**: GitHub API operations (warning: high token usage)

**Tool Management**:
```json
{
  "mcp": {
    "context7": { "type": "remote", "url": "..." },
    "gh_grep": { "type": "remote", "url": "..." }
  },
  "tools": {
    "context7_*": false,  // Disable globally
    "gh_grep_*": false
  },
  "agent": {
    "research": {
      "tools": {
        "context7_*": true,  // Enable for specific agent
        "gh_grep_*": true
      }
    }
  }
}
```

### Custom Tools

Define custom functions in config:
```json
{
  "tools": {
    "my_custom_tool": {
      "description": "Does something custom",
      "parameters": {
        "param1": { "type": "string", "required": true }
      },
      "command": ["node", "scripts/custom-tool.js", "$param1"]
    }
  }
}
```

---

## Configuration System

### Configuration Hierarchy
1. **Global config**: `~/.config/opencode/config.json`
2. **Project config**: `.opencode/opencode.json`
3. **Per-project overrides** take precedence

### Core Configuration Structure
```json
{
  "$schema": "https://opencode.ai/config.json",
  
  "tools": { /* tool settings */ },
  "agent": { /* agent definitions */ },
  "command": { /* custom commands */ },
  "lsp": { /* LSP server configs */ },
  "formatter": { /* formatter configs */ },
  "mcp": { /* MCP server configs */ },
  "permission": { /* permission settings */ },
  
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": { "enabled": true }
  },
  
  "theme": "opencode",
  "keybinds": { /* keybind overrides */ }
}
```

### Project Context Files

**AGENTS.md** (created by `/init`):
- Generated analysis of project structure
- Coding patterns and conventions
- Should be committed to version control
- Used to help LLM understand project

**Custom Rules**:
- Location: `.opencode/rules/custom.md`
- Provide additional context and instructions
- Multiple rule files supported

---

## Session Management

### Basic Commands
- `/new` or `ctrl+x n`: Start new session
- `/sessions` or `ctrl+x l`: List and switch sessions
- `/exit` or `ctrl+x q`: Exit OpenCode

### History Management
- `/undo` or `ctrl+x u`: Undo last message and file changes
- `/redo` or `ctrl+x r`: Redo previously undone message
- Requires Git repository for file change tracking

### Sharing & Export
- `/share` or `ctrl+x s`: Share session (get link)
- `/unshare`: Unshare session
- `/export` or `ctrl+x x`: Export to Markdown and open in editor
- Default: Public repos share automatically

### Context Management
- `/compact` or `ctrl+x c`: Summarize and compact session
- `/details` or `ctrl+x d`: Toggle tool execution details
- Automatic token budget management

---

## Permissions & Security

### Permission Levels
- `"ask"`: Prompt for approval before execution
- `"allow"`: Execute without approval
- `"deny"`: Disable tool completely

### Configuration

**Global Permissions**:
```json
{
  "permission": {
    "edit": "ask",
    "bash": "ask",
    "webfetch": "allow"
  }
}
```

**Per-Agent Override**:
```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "allow",
        "bash": {
          "git push": "ask",
          "rm -rf*": "deny",
          "git *": "ask",
          "*": "allow"
        }
      }
    },
    "plan": {
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    }
  }
}
```

**Bash Command Patterns**:
- Specific commands: `"git push": "ask"`
- Glob patterns: `"git *": "ask"`
- Wildcard fallback: `"*": "allow"`
- Specific rules override wildcard

### Security Best Practices
1. Use `plan` agent for code review without modifications
2. Set bash commands with side effects to `"ask"` or `"deny"`
3. Restrict `webfetch` for untrusted agents
4. Use per-agent permissions for fine-grained control
5. Review permissions before enabling MCP servers

---

## Additional Features

### Model Configuration
```json
{
  "model": {
    "default": "anthropic/claude-sonnet-4-20250514",
    "providers": {
      "anthropic": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**Supported Providers**: Anthropic, OpenAI, Google, AWS Bedrock, Azure, and more
**View models**: Run `opencode models` or use `/models` in TUI

### Theme System
```json
{
  "theme": "opencode"  // or custom theme name
}
```

**List themes**: `/themes` or `ctrl+x t`
**Location**: `~/.config/opencode/theme/custom.json`

### Keybind Customization
```json
{
  "keybinds": {
    "leader": "ctrl+x",
    "switch_agent": "Tab",
    "undo": "ctrl+x u",
    "redo": "ctrl+x r"
  }
}
```

### Environment Variables
- `OPENCODE_DISABLE_LSP_DOWNLOAD=true`: Prevent auto-download of LSP servers
- `EDITOR=code --wait`: Set editor for `/editor` and `/export`
- `{env:VAR_NAME}`: Reference in config files

---

## Advanced Usage Patterns

### Multi-Agent Workflows
1. Use `plan` agent to analyze and create plan
2. Switch to `build` agent to implement
3. Use custom review agent to check changes
4. Custom subagent for specialized tasks (docs, security, etc.)

### Custom Subagent Pattern
```json
{
  "agent": {
    "researcher": {
      "description": "Research code patterns and documentation",
      "mode": "subagent",
      "tools": {
        "write": false,
        "edit": false,
        "gh_grep_*": true,
        "context7_*": true
      }
    }
  }
}
```

Invoke with: `@researcher how should I implement auth?`

### Command + Agent Combination
```json
{
  "command": {
    "research": {
      "template": "Research best practices for: $ARGUMENTS",
      "agent": "researcher",
      "subtask": true
    }
  }
}
```

Usage: `/research implementing OAuth2`

---

## CLI Usage

### Primary Commands
```bash
opencode                    # Start TUI in current directory
opencode /path/to/project   # Start TUI in specific directory
opencode auth login         # Add API credentials
opencode github install     # Setup GitHub integration
opencode agent create       # Interactive agent creation
opencode models             # List available models
```

### IDE Integration
OpenCode can be integrated into VS Code, Cursor, and other editors. Check documentation for setup instructions.

---

## Best Practices for Configuration Generation

When generating OpenCode configurations:

1. **Start with built-in agents** (`build`, `plan`) before creating custom ones
2. **Use descriptive agent names** that clearly indicate purpose
3. **Set appropriate permissions** for agent safety
4. **Choose right temperature**: 0.0-0.2 for analysis, 0.6-1.0 for creative tasks
5. **Enable only needed tools** to reduce context usage
6. **Use subagents** for specialized tasks to keep contexts separate
7. **Consider MCP token costs** before enabling servers globally
8. **Use per-agent MCP enablement** for better control
9. **Create custom commands** for repetitive workflows
10. **Document agent purposes** in descriptions for better LLM selection

---

## Token Management

### Context Optimization
- Use subagents to isolate contexts
- Enable `/compact` to summarize sessions
- Use `subtask: true` in commands to create child sessions
- Disable unused MCP servers
- Use specific file references instead of reading entire directories

### High Token Usage Sources
- GitHub MCP server (warning: very high)
- Large number of MCP tools
- Deep directory listings
- Very long conversations without compaction

---

This reference should provide complete context for generating OpenCode configurations and understanding all available capabilities.
