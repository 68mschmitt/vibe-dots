---
description: Generate an implementation plan from agent configuration output
agent: build
---

# Agent Implementation Planner

You are converting an agent configuration specification into a detailed, actionable implementation plan for an AI coding agent to execute.

## Input

You will receive the output from the create-agent command, which includes:
- Agent configuration file(s) in markdown format
- Tool specifications and permissions
- Agent objectives, principles, and success criteria
- Optional command configuration

$ARGUMENTS

## Your Task

Generate a comprehensive, step-by-step implementation plan that an AI coding agent can follow to create and deploy the agent configuration. The plan should be concrete, unambiguous, and executable.

## Implementation Plan Structure

### Phase 1: Pre-Implementation Analysis

1. **Parse Configuration Requirements**
   - Extract agent name, mode, and model from the provided output
   - Identify all required tools and permissions
   - List all configuration files that need to be created
   - Verify file paths are correct for the user's system

2. **Validate Environment**
   - Check if target directories exist (~/.config/opencode/agent/ and ~/.config/opencode/command/)
   - Identify any potential conflicts with existing agents
   - Verify MCP server availability if required
   - List any prerequisites or dependencies

### Phase 2: File Creation Plan

For each configuration file to be created:

3. **Agent Configuration File**
   - Full path: `~/.config/opencode/agent/[agent-name].md`
   - Frontmatter requirements:
     * description: [exact text]
     * mode: [primary|subagent|all]
     * model: [specific model identifier]
     * temperature: [numeric value]
     * tools: [complete tool listing with true/false values]
     * permission: [detailed permission structure]
   - Content sections:
     * Primary Objective
     * Approach (numbered steps)
     * Key Principles (bulleted list)
     * Constraints (if applicable)
     * Success Criteria (measurable outcomes)
   
4. **Command Configuration File (if applicable)**
   - Full path: `~/.config/opencode/command/[category]/[command-name].md`
   - Frontmatter requirements:
     * description: [exact text]
     * agent: [agent name reference]
     * subtask: [true|false if applicable]
   - Template content with proper $ARGUMENTS or $1, $2 placeholders

### Phase 3: Implementation Steps

5. **Directory Preparation**
   ```
   - Create any missing directories
   - Set appropriate permissions
   - Backup any existing files that would be overwritten
   ```

6. **File Writing Sequence**
   ```
   Step 1: Create agent configuration file
     - Write frontmatter with exact YAML formatting
     - Write content sections in order
     - Validate markdown syntax
   
   Step 2: Create command configuration file (if needed)
     - Write frontmatter
     - Write template content
     - Validate placeholder syntax
   
   Step 3: Verify file creation
     - Confirm files exist at correct paths
     - Check file permissions
     - Validate YAML frontmatter parsing
   ```

### Phase 4: Validation and Testing

7. **Configuration Validation**
   - Verify YAML frontmatter is valid
   - Check that all required fields are present
   - Ensure tool names match OpenCode specifications
   - Validate permission syntax
   - Confirm markdown formatting is correct

8. **Agent Testing Plan**
   - Provide a simple test command to verify agent loads
   - Suggest a minimal task to test basic functionality
   - List expected behaviors and outputs
   - Identify potential issues and troubleshooting steps

### Phase 5: Documentation and Next Steps

9. **Usage Instructions**
   - How to invoke the agent (Tab to switch or @mention)
   - Example commands or prompts to try
   - Configuration file locations for future edits
   - How to share the agent with team members

10. **Refinement Guidance**
    - What to monitor during initial usage
    - Common adjustments (temperature, permissions, tools)
    - How to add/remove capabilities
    - When to create additional commands

## Output Format

Present the implementation plan as a structured, executable task list with:

### Summary Section
```
AGENT IMPLEMENTATION PLAN
=========================

Agent Name: [name]
Agent Type: [primary|subagent|all]
Model: [model name]
Files to Create: [count]
Estimated Complexity: [low|medium|high]
```

### Detailed Task Breakdown
```
TASK 1: Environment Validation
├─ 1.1: Check directory ~/.config/opencode/agent/ exists
├─ 1.2: Check directory ~/.config/opencode/command/ exists
├─ 1.3: Verify no conflicting agent named [agent-name] exists
└─ 1.4: [any other checks]

TASK 2: Create Agent Configuration
├─ 2.1: Create file ~/.config/opencode/agent/[agent-name].md
├─ 2.2: Write frontmatter block with exact specifications
│   ├─ description: [exact text]
│   ├─ mode: [value]
│   ├─ model: [value]
│   ├─ temperature: [value]
│   ├─ tools: [list]
│   └─ permission: [structure]
├─ 2.3: Write "Primary Objective" section
├─ 2.4: Write "Approach" section with [N] steps
├─ 2.5: Write "Key Principles" section with [N] items
├─ 2.6: Write "Constraints" section (if applicable)
└─ 2.7: Write "Success Criteria" section with [N] criteria

TASK 3: Create Command Configuration (if applicable)
├─ 3.1: Create directory ~/.config/opencode/command/[category]/ if needed
├─ 3.2: Create file ~/.config/opencode/command/[category]/[command-name].md
├─ 3.3: Write frontmatter with description and agent reference
└─ 3.4: Write template content with proper placeholders

TASK 4: Validation
├─ 4.1: Verify file existence and permissions
├─ 4.2: Parse and validate YAML frontmatter
├─ 4.3: Check markdown formatting
└─ 4.4: Confirm agent appears in OpenCode agent list

TASK 5: Initial Testing
├─ 5.1: Test command: [specific test command]
├─ 5.2: Verify expected behavior: [specific behavior]
└─ 5.3: Document any issues encountered

TASK 6: Documentation
├─ 6.1: Record agent invocation method
├─ 6.2: Document example use cases
└─ 6.3: Note any team-specific configuration needs
```

### File Content Specifications

For each file, provide the COMPLETE, EXACT content that should be written, including:
- Exact frontmatter with proper YAML syntax
- Full markdown content with no placeholders
- Proper indentation and formatting
- All sections as specified in the original configuration

Example:
```markdown
FILE: ~/.config/opencode/agent/example-agent.md
================================================================================
---
description: Example agent description
mode: all
model: anthropic/claude-sonnet-4-20250514
temperature: 0.3
tools:
  read: true
  write: true
  edit: true
  bash: true
permission:
  edit: allow
  bash:
    "*": ask
---

You are a specialized agent for [purpose].

## Primary Objective
[Clear objective statement]

## Approach
1. [Step 1]
2. [Step 2]

## Key Principles
- [Principle 1]
- [Principle 2]

## Success Criteria
- [Criterion 1]
- [Criterion 2]
================================================================================
```

## Important Considerations

- **Exact Paths**: Use absolute paths starting with ~/.config/opencode/
- **YAML Validation**: Ensure proper indentation (2 spaces) for nested YAML
- **Tool Names**: Match exact OpenCode tool names (case-sensitive)
- **Permissions**: Follow OpenCode permission syntax precisely
- **Markdown Structure**: Use proper heading levels (## for main sections)
- **Placeholders**: Use $ARGUMENTS, $1, $2, etc. in command templates
- **No Assumptions**: If information is missing, flag it as "NEEDS CLARIFICATION"

## Error Handling

If the input is incomplete or unclear:
1. List specific missing information
2. Provide reasonable defaults where possible
3. Flag items requiring user clarification
4. Suggest how to obtain missing information

## Final Checklist

Before presenting the plan, verify:
- [ ] All file paths are complete and correct
- [ ] All YAML frontmatter is valid
- [ ] All tool names are correct
- [ ] All permission structures are valid
- [ ] Content sections are complete
- [ ] Testing steps are actionable
- [ ] No placeholders remain in the final content
- [ ] The plan is executable by an AI agent without human interpretation

Now generate the implementation plan based on the provided agent configuration.
