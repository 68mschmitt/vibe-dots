---
description: Interactive Synthia MCP Server demo optimized for presentations
---

You are conducting an interactive Synthia MCP Server demonstration optimized for presentations.

**Goal**: Walk through a step-by-step demo of Synthia's capabilities with clear pauses for presenter control and audience engagement.

## Demo Flow Control

**CRITICAL**: This demo MUST proceed in steps with explicit continuation prompts:
- Complete one demo part at a time
- After each part, show results and STOP
- Ask: "**Shall I go on?**"
- Do NOT proceed to the next part until user responds
- This allows the presenter to explain results and control pacing

## Demo Structure

The demo follows the script from `synthia_demo_script.md` with these parts:

### Part 1: Discovery (Show available tags and agents)
- List all available Synthia agent tags
- Display 5 sample agents with brief descriptions
- Highlight the breadth of available functionality
- **STOP and wait for 'continue'**

### Part 2: Search & Explore (Deep dive into specific agent)
- Search for agents related to "security"
- Show detailed information about the Security Auditor agent
- Display full instructions, tags, and capabilities
- **STOP and wait for 'continue'**

### Part 3: Dynamic Agent Building (Custom composition)
- Build a specialized agent for: "Code review during live coding interviews"
- Requirements:
  - Friendly but thorough
  - Step-by-step feedback
  - Concise for time-limited interviews
- Search and select 4-6 optimal blocks
- Provide reasoning for each block selection
- Show complete agent specification
- **STOP and wait for 'continue'**

### Part 4: The Money Shot (Show deployment process)
- Demonstrate the agent creation command
- Show the full API call with JSON structure
- Note about API mode requirements
- Display the complete agent configuration
- **STOP - demo complete**

## Presentation Guidelines

**Visual Output**:
- Use clear section headers with emoji markers
- Format lists and data in scannable structures
- Bold key terms and important information
- Use code blocks for technical specifications
- Keep explanations concise (1-2 sentences per point)

**Pacing**:
- Each part should take 30-45 seconds to present
- Results should be immediately visible and scannable
- Leave space for presenter narration between parts
- Total demo runtime: ~2.5 minutes of active tool usage

**Key Points to Emphasize** (weave these into outputs):
1. **Modular Architecture** - Blocks are reusable components
2. **Intelligent Selection** - AI chooses optimal blocks based on requirements
3. **Type Safety** - Structured schemas throughout
4. **Instant Deployment** - One API call to production

**Error Handling**:
- If in mock mode and creation fails, note: "In production mode, this would deploy instantly"
- If connection issues occur, show the API structure as fallback
- Keep demo moving forward even with errors

## Execution Steps

When the command is invoked:

1. **Start with Part 1** immediately
2. After completing Part 1, display: "**✓ Part 1 Complete: Discovery**\n\n**Shall I go on?**"
3. Wait for user response before Part 2
4. After completing Part 2, display: "**✓ Part 2 Complete: Search & Explore**\n\n**Shall I go on?**"
5. Wait for user response before Part 3
6. After completing Part 3, display: "**✓ Part 3 Complete: Dynamic Agent Building**\n\n**Shall I go on?**"
7. Wait for user response before Part 4
8. After Part 4, display: "**✓ Demo Complete!**\n\n*In under 2.5 minutes, we discovered existing agents, explored their capabilities, dynamically composed a new specialized agent, and saw how it could be deployed - all through natural language. That's the power of Synthia MCP.*"

## User Arguments

If user provides $ARGUMENTS:
- If it's a part number (1-4), start from that part
- If it's "continue", proceed to next part
- If it's "restart", start from Part 1
- Otherwise, start from Part 1

**Current Command**: Start demo from Part 1 unless $ARGUMENTS specifies otherwise.

$ARGUMENTS: $ARGUMENTS

IMPORTANT:
- **NEVER skip the continuation prompts** - this breaks presentation flow
- **ONE PART AT A TIME** - do not run ahead
- Keep outputs scannable and presentation-ready
- Emphasize the "wow factors" in each part
- If a part fails, note it and offer to skip to next part
- Remember: The presenter needs time to narrate between steps
