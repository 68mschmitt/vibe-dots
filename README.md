# vibe-dots

Personal OpenCode configuration with custom commands and agents optimized for hackathons and AI-assisted development.

## Overview

This repository contains my OpenCode configuration, custom slash commands, and specialized agents designed to accelerate development workflows, particularly in hackathon environments with sleep-deprived developers.

## Structure

```
vibe-dots/
├── config.json           # OpenCode keybindings and UI configuration
├── opencode.json         # MCP server configurations (Context7, Synthia)
├── agent/                # Custom OpenCode agents
│   ├── docs-context.md   # Documentation context provider agent
│   └── file-writer.md    # File creation/editing agent
└── command/              # Custom slash commands
    ├── branch.md         # Git branch creation
    ├── commit.md         # Git commit workflow
    ├── implement.md      # Task implementation
    ├── ticket.md         # Ticket generation
    ├── taskgenny.md      # Task list generation
    ├── writedocs.md      # Documentation generation
    ├── synthia.md        # Synthia MCP demo
    ├── hackbug.md        # Bug debugging workflow
    ├── hackdisrupt.md    # Task execution
    ├── hackphotoid.md    # Project context generation
    ├── hackupdatethephotoid.md  # Context refresh
    ├── hackreq.md        # Requirements generation
    ├── hackspike.md      # LOE spike analysis
    ├── hacktasks.md      # Task breakdown
    └── hackupdatethephotoid.md  # Context updates
```

## Configuration

### Keybindings (config.json)

- **Leader key**: `ctrl+x`
- **Quick access**: 
  - `ctrl+p` - Command list
  - `<leader>e` - Open editor
  - `<leader>m` - Model list
  - `<leader>t` - Theme list
  - `<leader>b` - Toggle sidebar
  - `<leader>s` - Status view

### MCP Servers (opencode.json)

**Context7**: Remote library documentation server
- Access up-to-date documentation for libraries and frameworks
- URL: `https://mcp.context7.com/mcp`

**Synthia**: Local agent composition server
- Dynamic agent building and block composition
- Command: `node /Users/michael.schmitt/sc/hackathon/Synthia/apps/mcp-server/build/index.js`

## Custom Agents

### @docs-context
Provides project documentation context from `.context/docs/` directory. Read-only agent that retrieves relevant project documentation for other agents to use.

**Model**: Claude Haiku 4.5
**Tools**: Read, Glob, Grep, List only (no modifications)

### @file-writer
Creates or edits files based on provided specifications. Focused file operation agent for writing and editing operations.

**Model**: Claude Haiku 4.5
**Tools**: Write, Edit, Read, List

## Custom Commands

### Git Workflow

- `/branch` - Create and checkout a new git branch from description
- `/commit` - Create a git commit with analyzed staged changes

### Standard Workflow

- `/ticket` - Generate detailed implementation specification ticket
- `/taskgenny` - Convert ticket into actionable task list
- `/implement` - Execute tasks from a task list file
- `/writedocs` - Generate comprehensive application documentation

### Hackathon Workflow ("hack" commands)

Optimized for sleep-deprived developers in fast-paced hackathon environments:

#### Project Context
- `/hackphotoid` - Generate AI-optimized project context organized by domain (product, docs, architecture, code, ops)
- `/hackupdatethephotoid` - Update existing project context by re-scanning and refreshing documentation

#### Feature Development
- `/hackspike` - Generate level of effort spike documentation for feature analysis
- `/hackreq` - Generate MVP requirements for hackathon features (supports spike integration)
- `/hacktasks` - Convert requirements or bugs into AI-ready step-by-step task instructions
- `/hackdisrupt` - Execute task list with zero intervention mode

#### Bug Fixing
- `/hackbug` - Generate debugging workflow for hackathon bugs/issues
- `/hacktasks` (with bug file) - Convert debug workflow into step-by-step diagnostic tasks
- `/hackdisrupt` (with bug tasks) - Execute debugging and fixing tasks

#### Demo & Presentation
- `/synthia` - Interactive Synthia MCP Server demo optimized for presentations

## Hackathon Workflow Philosophy

The "hack" commands are designed around these principles:

- **Zero-thought operation**: Auto-generate with sane defaults, minimal user input
- **Sleep-deprived friendly**: Copy-paste ready outputs, minimal cognitive load
- **AI-first**: Optimized for AI agent consumption and execution
- **MVP focused**: Cut non-essentials, prioritize demo-visible features
- **Speed over perfection**: Done > Perfect
- **Fail-forward**: Document blockers and move on

## Typical Workflows

### Standard Development Flow

```bash
# Create ticket from feature description
/ticket Add user authentication

# Generate task list from ticket
/taskgenny TICKET-20241121-143022-add-user-authentication.md

# Implement tasks
/implement TASKS-20241121-143022-add-user-authentication.md

# Commit work
/commit
```

### Hackathon Feature Flow

```bash
# Generate project context (first time only)
/hackphotoid

# Analyze feature complexity
/hackspike Add real-time notifications

# Generate MVP requirements (leverages spike)
/hackreq real-time-notifications

# Break down into tasks
/hacktasks real-time-notifications

# Execute autonomously
/hackdisrupt real-time-notifications

# Create branch and commit
/branch feat/real-time-notifications
/commit
```

### Hackathon Bug Flow

```bash
# Generate debugging workflow
/hackbug Auth failing on mobile devices

# Convert to diagnostic tasks
/hacktasks auth-failing

# Execute debugging and fix
/hackdisrupt auth-failing

# Commit fix
/commit
```

## Context Organization

Commands create structured context in `.context/` directory:

```
.context/
├── docs/                    # Project documentation (from /hackphotoid)
│   ├── product.md
│   ├── documentation.md
│   ├── architecture.md
│   ├── code.md
│   ├── operations.md
│   └── libraries/           # Context7 library docs
│       ├── index.md
│       └── [library-name]/
├── hacks/                   # Hackathon artifacts
│   ├── [feature-name]/
│   │   ├── spike/          # LOE analysis
│   │   │   └── spike.md
│   │   ├── req/            # Requirements
│   │   │   └── hackreq.md
│   │   └── tasks/          # Task breakdown
│   │       └── tasks.md
│   └── bugs/
│       └── [bug-name]/
│           ├── debug/      # Debug workflow
│           │   └── debug.md
│           └── tasks/      # Debug tasks
│               └── tasks.md
├── tickets/                 # Standard tickets
│   └── TICKET-*.md
├── tasks/                   # Standard tasks
│   └── TASKS-*.md
└── implementationSummary/   # Post-implementation reports
    └── SUMMARY-*.md
```

## Usage Tips

1. **First time setup**: Run `/hackphotoid` to generate project context for better AI assistance
2. **Update context**: Run `/hackupdatethephotoid` after significant project changes
3. **Spike before requirements**: Use `/hackspike` before `/hackreq` for better requirements generation
4. **Reference with @**: Use `@` prefix to reference files (e.g., `/implement @TASKS-20241121-143022.md`)
5. **Trust the defaults**: Hack commands make smart assumptions - don't overthink inputs
6. **Use kill switches**: Respect time budgets in bug workflows to avoid rabbit holes

## Dependencies

- OpenCode CLI
- Context7 MCP server (for library documentation)
- Synthia MCP server (for agent composition)

## License

Personal configuration - use at your own discretion.
