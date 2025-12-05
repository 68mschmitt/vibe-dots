# Creating AI agent workflow for task automation

**Session ID:** ses_5429b9282ffezGd3yKS8U2VWF8
**Created:** 11/25/2025, 6:41:06 PM
**Updated:** 11/25/2025, 6:52:56 PM

---

## User

Assist me in creating a workflow for ai agent creation for the purposes of streamlining my current tasks and operations.

My current workflow as a software developer...
# If I need to perform a code review
- Task the ai coding tool agent in open code to create a command to use git mcp to pull down the pr# that I need to review and generate a review for it
- Execute the command and look for placed it struggles, does something unexpected, or I have an idea on how to improve
- Go back to the command creation session and task the ai coding agent tool to improve the command in certain ways
- Then I repeat the process until I get something that does what I am satisfied with

# General workflow
- The above workflow is the general workflow I have
- I task the opencode ai coding tool to generate a command with general instructions on what to do
- I test it
- I go back and improve
- Iterate

# The problem
- I see this getting unwieldy very quickly
- I will have to keep track of bespoke commands and know when to use them

use sequential thinking mcp



---

## Assistant

I'll help you create a streamlined workflow for AI agent creation that addresses your current challenges. Let me think through this systematically to design a scalable solution.

```
Tool: sequential-thinking_sequentialthinking
```

---

## Assistant

```
Tool: sequential-thinking_sequentialthinking
```

---

## Assistant

```
Tool: sequential-thinking_sequentialthinking
```

---

## Assistant

```
Tool: sequential-thinking_sequentialthinking
```

---

## Assistant

```
Tool: sequential-thinking_sequentialthinking
```

---

## Assistant

```
Tool: todowrite
```

---

## Assistant

Based on your existing structure and workflow challenges, here's a comprehensive **AI Agent Creation Workflow** that will streamline your operations:

## 🎯 Enhanced AI Agent Workflow Framework

### Phase 1: Discovery & Intent Analysis
```markdown
Before creating a new command:
1. Run a discovery command: `/find-command <task-description>`
   - Searches existing commands in your catalog
   - Suggests similar commands that might work
   - Shows modification patterns from past iterations

2. If no suitable command exists:
   - Check for similar patterns in command history
   - Identify reusable components from existing commands
```

### Phase 2: Structured Command Creation

**Template-Based Approach:**
```markdown
/create-command --type=<category> --template=<base-pattern>

Categories aligned with your structure:
- git (PR reviews, branch operations)
- testing (unit tests, integration tests)
- refactoring (code improvements)
- analysis (code quality, security)
```

**Command Specification Format:**
```yaml
name: review-pr
category: git
version: 1.0.0
purpose: "Automated PR review with context awareness"
parameters:
  - pr_number: required
  - focus_areas: optional (security, performance, style)
  - depth: optional (quick, standard, thorough)
test_cases:
  - input: "PR #123"
    expected: "Comprehensive review generated"
evolution_notes:
  - v1.0.0: "Initial implementation"
  - v1.1.0: "Added focus area filtering"
```

### Phase 3: Iterative Testing & Refinement

**Testing Workflow:**
```markdown
1. Sandbox Testing
   /test-command <command-name> --sandbox --input=<test-data>
   
2. Validation Checklist
   - ✅ Handles edge cases
   - ✅ Provides expected output
   - ✅ Performance acceptable
   - ✅ Error handling robust

3. A/B Testing
   - Run old vs new version
   - Compare outputs
   - Measure improvements
```

### Phase 4: Intelligent Command Management

**Command Registry System:**
```javascript
// config.json structure enhancement
{
  "commands": {
    "git/review-pr": {
      "version": "1.2.0",
      "usage_count": 45,
      "last_used": "2024-11-25",
      "success_rate": 0.92,
      "tags": ["review", "git", "pr"],
      "related_commands": ["git/codereview", "git/branch"]
    }
  },
  "workflows": {
    "pr-review-complete": ["git/review-pr", "git/commit", "testing/run-tests"]
  }
}
```

### Phase 5: Smart Command Dispatcher

**Usage Pattern:**
```markdown
# Instead of remembering specific commands:
/do "review PR #456 focusing on security"

# Dispatcher automatically:
1. Identifies intent: PR review
2. Finds best command: git/review-pr
3. Maps parameters: pr_number=456, focus_areas=security
4. Executes with context
```

## 🚀 Implementation Recommendations

### 1. **Meta-Command for Discovery**
Create a command that helps you find and suggest appropriate commands:
```markdown
/command-assist <natural-language-task>
- Returns: Suggested commands with confidence scores
- Shows: Previous similar tasks and their solutions
```

### 2. **Version Control for Commands**
Track command evolution:
```markdown
/command-history <command-name>
- Shows all versions
- Diff between versions
- Performance metrics per version
- Rollback capability
```

### 3. **Command Composition**
Build complex workflows from simple commands:
```markdown
/workflow create "full-pr-review"
  - step: git/review-pr
  - step: testing/run-relevant-tests
  - step: security/scan-changes
  - step: generate-summary
```

### 4. **Learning System**
Track what works:
```markdown
- Auto-tag successful command patterns
- Learn from modifications
- Suggest improvements based on usage patterns
- Alert when commands become stale
```

## 📊 Metrics & Monitoring

**Track Key Metrics:**
- Command success rate
- Average iteration count before satisfaction
- Time saved per command use
- Most frequently modified commands (candidates for improvement)

## 🔄 Continuous Improvement Loop

```markdown
Weekly Review Process:
1. Analyze command usage statistics
2. Identify top 3 commands needing improvement
3. Review failed executions for patterns
4. Update templates based on learnings
5. Deprecate unused commands
```

```
Tool: todowrite
```

---

## Assistant

## Next Steps

1. **Start with a Discovery Command**: Create a simple command that searches your existing commands based on keywords or task descriptions

2. **Implement Version Tracking**: Add version numbers to your existing commands in the git/ folder

3. **Create a Testing Template**: Develop a standard testing pattern for validating commands before promoting them

4. **Build a Command Composer**: Create a meta-command that can chain existing commands together

This workflow transforms your ad-hoc command creation into a systematic, scalable process that grows more intelligent over time. Would you like me to help you implement any specific part of this workflow, starting with perhaps the command discovery system or the testing framework?

---

## User

Incorporate the entire feature set of opencode (tools, rules, agents, models, commands, formatters, permissions, lsp servers, mcp servers, acp support, and custom tools). for reference (https://opencode.ai/docs/)

---

## Assistant

I'll fetch the OpenCode documentation to understand the complete feature set and then incorporate it into a comprehensive AI agent workflow framework.

```
Tool: todowrite
```

---

## Assistant

```
Tool: webfetch
```

---

## Assistant

Let me fetch more detailed information about each of the OpenCode features.

```
Tool: webfetch
```

---

## Assistant

```
Tool: webfetch
```

---

## Assistant

Let me continue fetching information about commands, MCP servers, and other features.

```
Tool: webfetch
```

---

## Assistant

```
Tool: webfetch
```

---

## Assistant

Now let me update the todos and create a comprehensive AI agent workflow framework that incorporates all OpenCode features.

```
Tool: todowrite
```

---

## Assistant

## 🚀 Complete OpenCode AI Agent Creation Workflow

Based on your existing structure and the full OpenCode feature set, here's a comprehensive workflow that leverages all capabilities:

### 📋 Phase 1: Agent Architecture & Discovery

#### 1.1 **Agent Hierarchy Design**
```markdown
Primary Agents (Tab-switchable):
├── build (full access)
├── plan (read-only analysis)
└── custom-primary (your specialized agents)

Subagents (@-mentionable):
├── general (research & discovery)
├── quality-analyzer
├── security-analyzer
├── style-analyzer
├── docs-context
└── custom-subagents (domain-specific)
```

#### 1.2 **Discovery Command System**
Create a discovery command that searches through your agent/command structure:

`.opencode/command/discover.md`:
```markdown
---
description: Find relevant commands and agents for a task
agent: general
subtask: true
---
Search for existing commands and agents that match: $ARGUMENTS

Check in:
- command/ directory for relevant commands
- agent/ directory for specialized agents
- config.json for registered tools and MCPs

Return:
1. Matching commands with descriptions
2. Relevant agents with their capabilities
3. Similar past solutions from command history
```

### 📦 Phase 2: Modular Component System

#### 2.1 **Tools Configuration**
Leverage the complete tool ecosystem:

`opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    // Built-in tools
    "bash": true,
    "edit": true,
    "write": true,
    "read": true,
    "grep": true,
    "glob": true,
    "list": true,
    "patch": true,
    "todowrite": true,
    "todoread": true,
    "webfetch": true,
    
    // MCP tools (controlled via glob patterns)
    "github_*": true,
    "azure-devops_*": true,
    "context7_*": true,
    "puppeteer_*": false  // Disabled by default
  }
}
```

#### 2.2 **MCP Server Integration**
Configure specialized MCP servers for your workflow:

```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "{env:GITHUB_TOKEN}"
      }
    },
    "azure-devops": {
      "type": "local",
      "command": ["npx", "-y", "azure-devops-mcp"],
      "environment": {
        "AZURE_TOKEN": "{env:AZURE_TOKEN}"
      }
    },
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

### 🎯 Phase 3: Specialized Agent Templates

#### 3.1 **PR Review Agent**
`.opencode/agent/pr-reviewer.md`:
```markdown
---
description: Comprehensive PR review with focus areas
mode: subagent
model: anthropic/claude-3-5-sonnet-20241022
temperature: 0.1
tools:
  write: false
  edit: false
  bash:
    "git diff*": allow
    "git log*": allow
    "*": deny
  github_*: true
permission:
  edit: deny
  bash:
    "git status": allow
    "git diff*": allow
    "*": ask
---
You are a specialized PR reviewer. Focus on:
1. Code quality and best practices
2. Security vulnerabilities
3. Performance implications
4. Test coverage
5. Documentation completeness

Use GitHub MCP tools to fetch PR details and comment directly.
```

#### 3.2 **Test Generator Agent**
`.opencode/agent/test-generator.md`:
```markdown
---
description: Generate comprehensive test suites
mode: subagent
model: anthropic/claude-3-5-sonnet-20241022
tools:
  write: true
  edit: true
  bash:
    "npm test*": allow
    "jest*": allow
    "*": ask
---
Generate comprehensive test suites with:
- Unit tests for all functions
- Integration tests for APIs
- Edge case coverage
- Mock implementations
- Performance benchmarks
```

### 🔧 Phase 4: Command Evolution System

#### 4.1 **Versioned Command Structure**
`.opencode/command/git/review-pr-v2.md`:
```markdown
---
description: Review PR with enhanced analysis (v2)
agent: pr-reviewer
subtask: true
model: anthropic/claude-3-5-sonnet-20241022
---
# PR Review v2.0
PR Number: $1
Focus Areas: $2

## Fetch PR Details
Use github_get_pull_request to fetch PR #$1

## Analyze Changes
!`git diff origin/main...HEAD`

## Run Checks
!`npm test -- --coverage`
!`npm run lint`

## Security Scan
Use security-analyzer agent to scan for vulnerabilities

## Generate Review
Provide comprehensive review covering:
- Code quality
- Test coverage
- Security issues
- Performance implications
```

#### 4.2 **Command History Tracking**
`.opencode/command/history.md`:
```markdown
---
description: Show command evolution and usage
---
Display command usage statistics:
!`ls -la .opencode/command/`

Show most frequently used commands and their success patterns.
```

### 🧪 Phase 5: Testing & Validation Framework

#### 5.1 **Test Harness Command**
`.opencode/command/test-command.md`:
```markdown
---
description: Test a command in sandbox mode
agent: plan
---
Test command: $1
Test input: $2

Run in plan mode (no actual changes):
1. Execute the command with test input
2. Validate expected output
3. Check for edge cases
4. Measure performance
5. Report results
```

#### 5.2 **Validation Rules**
`AGENTS.md`:
```markdown
## Command Validation Rules

Before promoting a command from experimental to production:
1. Must handle edge cases gracefully
2. Must have clear error messages
3. Must complete within reasonable time
4. Must have documented parameters
5. Must include rollback capability

When testing commands:
- Use plan mode for dry runs
- Test with various input formats
- Verify idempotency where applicable
```

### 🔄 Phase 6: Workflow Composition

#### 6.1 **Complex Workflow Commands**
`.opencode/command/workflow/full-feature.md`:
```markdown
---
description: Complete feature implementation workflow
agent: build
---
Feature Name: $1
Requirements: $2

## Phase 1: Planning
@plan Create implementation plan for $1

## Phase 2: Implementation
1. Create branch: !`git checkout -b feature/$1`
2. Implement core functionality
3. @test-generator Create tests for new feature

## Phase 3: Quality Checks
@quality-analyzer Review implementation
@security-analyzer Scan for vulnerabilities
@style-analyzer Check code style

## Phase 4: Documentation
@docs-context Update documentation

## Phase 5: PR Creation
Use github_create_pull_request to create PR
```

#### 6.2 **Workflow Orchestration**
`.opencode/command/orchestrate.md`:
```markdown
---
description: Orchestrate multi-agent workflows
subtask: true
---
Workflow: $1
Parameters: $2

Based on the workflow type, coordinate between:
- Primary agents for main implementation
- Subagents for specialized tasks
- MCP servers for external integrations
- Commands for reusable operations

Track progress using todowrite/todoread tools.
```

### 📊 Phase 7: Monitoring & Analytics

#### 7.1 **Performance Tracking**
`.opencode/command/analytics.md`:
```markdown
---
description: Analyze agent and command performance
---
## Command Usage Analytics
!`grep -c "command/" ~/.opencode/logs/* | sort -rn`

## Agent Performance
- Response times
- Success rates
- Token usage
- Error patterns

## Optimization Recommendations
Based on usage patterns, suggest:
1. Commands to optimize
2. Agents to refine
3. Tools to add/remove
```

### 🛠️ Phase 8: Custom Tool Integration

#### 8.1 **Custom Tools Configuration**
`opencode.json`:
```json
{
  "customTools": [
    {
      "name": "deploy",
      "description": "Deploy to production",
      "command": "npm run deploy",
      "parameters": {
        "environment": {
          "type": "string",
          "enum": ["staging", "production"]
        }
      }
    }
  ]
}
```

### 🔐 Phase 9: Permission Management

#### 9.1 **Granular Permissions**
```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "rm*": "deny",
      "git push*": "ask",
      "npm install": "allow",
      "*": "ask"
    },
    "webfetch": "allow"
  },
  "agent": {
    "production-deploy": {
      "permission": {
        "bash": {
          "npm run deploy:prod": "ask",
          "*": "deny"
        }
      }
    }
  }
}
```

### 🎨 Phase 10: Integration Examples

#### 10.1 **Complete PR Review Workflow**
```bash
# User command
/review-pr 456 security,performance

# This triggers:
1. pr-reviewer agent activation
2. GitHub MCP tools fetch PR details
3. Security-analyzer subagent scan
4. Performance analysis
5. Automated comment posting via GitHub API
6. Summary generation
```

#### 10.2 **Feature Development Workflow**
```bash
# User command
/implement user-authentication oauth

# This triggers:
1. Plan agent creates blueprint
2. Build agent implements
3. Test-generator creates tests
4. Security-analyzer validates
5. Docs-context updates documentation
6. GitHub MCP creates PR
```

### 📈 Implementation Roadmap

```
Tool: todowrite
```

---

## Assistant

#### **Week 1: Foundation**
1. Set up directory structure (agent/, command/, context/)
2. Configure MCP servers (GitHub, Azure DevOps, Context7)
3. Create base agents (pr-reviewer, test-generator)
4. Implement discovery command

#### **Week 2: Command Library**
1. Build versioned command templates
2. Create workflow composition commands
3. Set up testing harness
4. Implement command history tracking

#### **Week 3: Integration**
1. Configure LSP servers for enhanced code intelligence
2. Set up formatters for consistent code style
3. Implement custom tools for deployment
4. Create permission profiles

#### **Week 4: Optimization**
1. Add analytics and monitoring
2. Create performance optimization agents
3. Build command recommendation system
4. Document best practices

### 🎯 Key Benefits of This Workflow

1. **Scalability**: Modular agents and commands that grow with your needs
2. **Discoverability**: Built-in discovery system finds relevant tools
3. **Version Control**: Track command evolution and improvements
4. **Safety**: Granular permissions prevent accidental changes
5. **Integration**: MCP servers connect to external services
6. **Automation**: Complex workflows handled by orchestration
7. **Intelligence**: Agents learn from patterns and usage
8. **Flexibility**: Mix and match components for any task

### 🚦 Quick Start Commands

```bash
# Initialize your agent system
opencode agent create      # Create new agent
opencode init              # Initialize project

# Discovery and exploration
/discover "code review"    # Find relevant tools
/history                  # Show command usage

# Common workflows
/review-pr 123            # Review PR #123
/implement feature-name   # Full feature workflow
/test-command my-cmd     # Test in sandbox

# Analytics
/analytics               # Performance metrics
```

This comprehensive workflow transforms your ad-hoc command creation into a systematic, intelligent agent ecosystem that leverages every OpenCode feature for maximum efficiency and safety. Would you like me to help you implement any specific component first, such as setting up the discovery system or creating your first specialized agent?

---


