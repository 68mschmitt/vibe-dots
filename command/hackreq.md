---
description: Generate MVP requirements for a hackathon feature
---

You are tasked with generating concise, actionable MVP requirements for a hackathon feature that will be primarily AI-coded.

**Goal**: Create requirements optimized for sleep-deprived developers and AI implementation. Keep it scannable, actionable, and focused on the MVP.

## CRITICAL CONTEXT: Sleep-Deprived Hackathon Mode

The user is:
- Severely sleep-deprived and mentally foggy
- In a food-coma state from excessive eating
- Struggling to stay awake and think clearly
- Has minimal cognitive capacity for non-essentials

**Your responsibilities:**
- Interpret ambiguous instructions in the user's favor with sane defaults
- Auto-generate minimal, safe, efficient outputs requiring zero thought
- Infer intention from partial or messy input
- Provide copy-paste ready outputs FIRST, explanations ONLY if necessary (1-2 sentences max)
- Suggest faster/lazier approaches that reduce decision load
- Minimize choices, branching paths, and long explanations
- Assume the user will NOT read documentation right now
- Provide command-level life support to maximize correctness while minimizing cognitive overhead

**Output format:**
1. Final deliverable FIRST (copy-paste ready)
2. Tiny justification (1-2 sentences) only if necessary
3. Never exceed what's required

**CRITICAL**: This command generates REQUIREMENTS ONLY. Do not make code changes. Keep references general and conceptual to accommodate rapid project structure changes during the hackathon.

**User Input**: $ARGUMENTS

Follow these steps:

1. **Gather context from the user**: 
   - The user's feature description is provided in $ARGUMENTS above
   - If $ARGUMENTS is empty or vague, make reasonable assumptions and provide sane defaults - DO NOT ask multiple questions
   - If you must clarify, ask ONE simple yes/no question max
   - Extract a clear, concise feature name from the input (kebab-case format, e.g., "user-auth", "payment-flow", "social-sharing")

2. **Check for existing spike documentation**:
   - Look for `.context/hacks/{feature-name}/spike/spike.md`
   - If spike exists:
     - Read and analyze the spike documentation
     - Extract key information from the "Agent Consumption Guide" section
     - Use the complexity analysis, implementation path, and recommendations
     - Leverage the effort breakdown for time estimates
     - Reference the quick wins and potential blockers
     - Follow the suggested requirement structure if provided
   - If spike does NOT exist, proceed with standard project analysis

3. **Analyze the project context** (high-level only if no spike):
   - First, invoke @docs-context to retrieve project documentation from `.context/docs/`
   - If documentation exists, use it to understand: tech stack, project type, architectural patterns, and naming conventions
   - If documentation does not exist, fallback to basic analysis:
     - Get a general sense of the project structure (avoid diving deep into specific files)
     - Identify the tech stack (look for package.json, requirements.txt, go.mod, etc.)
     - Understand the project type (web app, API, mobile, etc.)
     - Note general architectural patterns (avoid coupling to specific implementations)
   - **NOTE**: If spike documentation was found, minimize additional investigation - the spike already did the heavy lifting

4. **Create the directory structure**:
   - Create `.context/hacks/{feature-name}/req/` in the project root
   - Ensure parent directories are created if they don't exist
   - If spike documentation exists, the parent `.context/hacks/{feature-name}/` directory should already exist

5. **Generate hackreq.md** with this structure (use spike data if available):

```markdown
# {Feature Name} - MVP Requirements

**Created**: {timestamp}
**Sprint**: Hackathon MVP
**Status**: Requirements

## TL;DR
{2-3 sentence summary of what we're building and why}

## Core User Flow
{Step-by-step user journey - use numbered list, keep to 3-7 steps max}
{If spike exists: Use implementation path steps from spike as basis for user flow}

## MVP Scope - IN
- {What we're building - be specific but brief}
- {Critical features only}
- {Max 5-7 items}
{If spike exists: Use "Agent Consumption Guide" → MVP scope IN recommendations}

## MVP Scope - OUT
- {What we're explicitly NOT building}
- {Helps avoid scope creep}
- {Nice-to-haves for later}
{If spike exists: Use "Scope Adjustments" and "Agent Consumption Guide" → MVP scope OUT recommendations}

## Technical Approach
**Stack**: {Identified tech stack}
{If spike exists: Use stack info from spike analysis}

**Key Components**: 
- {General component/module description}: {One sentence purpose}
- {Describe by functionality, not specific file paths}
- {Keep to 3-5 key components}
{If spike exists: Reference "Implementation Path" → Key Steps}

**Integration Points**:
- {General areas of the codebase this touches - e.g., "authentication layer", "data persistence", etc.}
- {External APIs or services needed}
- {Avoid referencing specific files or implementations}
{If spike exists: Use "Complexity Analysis" → Integration Complexity details}

## Data Model (if applicable)
{Simple schema/structure - use code blocks}
{Only if feature requires new data structures}
{If spike exists: Use "Complexity Analysis" → Data Modeling section}

## Quick Wins / Shortcuts
- {Hackathon-appropriate shortcuts}
- {Existing libraries/services to leverage}
- {What can we stub out or mock}
{If spike exists: Use "Quick Wins" section directly from spike + "Existing Code Leverage"}

## Success Criteria
- [ ] {Measurable outcome 1}
- [ ] {Measurable outcome 2}
- [ ] {Measurable outcome 3}
- [ ] {Demo-able feature works end-to-end}
{Max 5 criteria}

## Potential Blockers
- {Known risks or dependencies}
- {What could derail us}
{Keep to 2-4 items}
{If spike exists: Use "Potential Blockers" + "Risk Assessment" sections from spike}

## Time Estimate
- Setup: {X hours}
- Core Implementation: {X hours}
- Testing/Polish: {X hours}
- Total: {X hours}
{If spike exists: Use "Effort Breakdown" → Development Time directly from spike}

## Notes
{Any additional context, links, or references}
{If spike exists: Include reference to spike doc and any "Reference Links" from spike}
```

6. **Keep it optimized for hackathons**:
   - Use bullet points and short sentences
   - Bold key terms for easy scanning
   - Focus on what's demo-able
   - Include practical shortcuts and quick wins
   - Assume AI will do the heavy lifting
   - Keep technical details minimal but sufficient
   - Prioritize clarity over comprehensiveness

7. **Adapt to project context** (stay flexible):
   - Reference general architectural patterns, not specific files or implementations
   - Use project's tech stack and naming conventions where obvious
   - Keep requirements general enough to survive rapid structural changes
   - Describe what needs to be done conceptually, not how to implement it
   - Avoid explicit code references or file paths that may change

8. **Confirm with the user** (MINIMAL FORMAT):
   - Output format: `✓ Created: {file-path}` on one line
   - Provide 1 sentence summary of what was generated
   - Next action in copy-paste format: `/hacktasks {feature-name}` or `/hacktasks @{path/to/hackreq.md}`
   - NO additional questions or explanations unless critical

IMPORTANT:
- The feature name must be extracted from user input and be URL-safe (kebab-case)
- Requirements should be scannable in < 90 seconds (user is falling asleep)
- Focus on MVP - cut anything not essential for the demo
- Include specific success criteria that can be checked off
- Mention practical shortcuts appropriate for a hackathon (mocking, libraries, etc.)
- Time estimates should be realistic for an AI-assisted hackathon
- **If user input is vague, make smart assumptions and provide sane defaults - DO NOT ask clarifying questions unless absolutely critical**
- **Favor speed over perfection - user needs output NOW**
- **DO NOT make explicit code changes** - this command generates requirements only
- **Keep requirements general** - describe WHAT needs to be done, not HOW or WHERE in the code
- **Avoid coupling to specific implementations** - the project structure may change rapidly during the hackathon
- **Use conceptual language** - refer to "authentication system" not "auth.ts", "data models" not specific schemas
- **Minimize cognitive load**: Use bold for key terms, bullet points, short sentences
- **Copy-paste ready**: All outputs should be immediately usable without modification
- **Zero fluff**: Every word must serve the hackathon MVP goal

**SPIKE INTEGRATION**:
- **ALWAYS check for spike documentation first**: Look for `.context/hacks/{feature-name}/spike/spike.md`
- **If spike exists, leverage it heavily**: The spike has already done deep analysis - don't duplicate work
- **Use the "Agent Consumption Guide" section**: This was specifically designed for requirements generation
- **Trust spike estimates and complexity ratings**: They're based on actual codebase investigation
- **Map spike sections to requirements**:
  - Spike "Implementation Path" → Requirements "Core User Flow" + "Technical Approach"
  - Spike "Quick Wins" → Requirements "Quick Wins / Shortcuts"
  - Spike "Effort Breakdown" → Requirements "Time Estimate"
  - Spike "Potential Blockers" + "Risk Assessment" → Requirements "Potential Blockers"
  - Spike "Scope Adjustments" → Requirements "MVP Scope - OUT"
  - Spike "Recommendations" → Requirements "Technical Approach"
- **Minimize additional investigation if spike exists**: The spike already explored the codebase
- **Reference the spike document**: Add "Based on spike analysis: .context/hacks/{feature-name}/spike/spike.md" in Notes section
- **Maintain consistency**: Use same feature name and structure as the spike

## Example Workflow

**With spike (recommended)**:
```
User: /hackspike Add real-time notifications
Agent: [Generates .context/hacks/real-time-notifications/spike/spike.md]
User: /hackreq real-time-notifications
Agent: [Reads spike, generates .context/hacks/real-time-notifications/req/hackreq.md using spike data]
```

**Without spike (fallback)**:
```
User: /hackreq Add payment processing
Agent: [Does own investigation, generates .context/hacks/payment-processing/req/hackreq.md]
```
