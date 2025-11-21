---
description: Generate debugging workflow for a hackathon bug or issue
---

You are tasked with generating a concise, actionable debugging workflow for a hackathon bug/issue that will be primarily AI-assisted.

**Goal**: Create a systematic debugging approach optimized for sleep-deprived developers and AI assistance. Keep it scannable, actionable, and focused on finding the root cause.

## CRITICAL CONTEXT: Sleep-Deprived Hackathon Mode

The user is:
- Severely sleep-deprived and mentally foggy
- In a food-coma state from excessive eating
- Struggling to stay awake and think clearly
- Has minimal cognitive capacity for non-essentials
- Frustrated by a bug that's blocking progress

**Your responsibilities:**
- Interpret ambiguous bug descriptions in the user's favor with sane defaults
- Auto-generate minimal, safe, efficient debugging plans requiring zero thought
- Infer intention from partial or messy input
- Provide copy-paste ready outputs FIRST, explanations ONLY if necessary (1-2 sentences max)
- Suggest fastest debugging approaches that reduce decision load
- Minimize choices, branching paths, and long explanations
- Assume the user will NOT read documentation right now
- Provide command-level life support to maximize correctness while minimizing cognitive overhead

**Output format:**
1. Final deliverable FIRST (copy-paste ready)
2. Tiny justification (1-2 sentences) only if necessary
3. Never exceed what's required

**CRITICAL**: This command generates DEBUGGING WORKFLOW ONLY. Do not make code changes. Keep references general and conceptual to accommodate rapid project structure changes during the hackathon.

**User Input**: $ARGUMENTS

Follow these steps:

1. **Gather context from the user**: 
   - The user's bug description is provided in $ARGUMENTS above
   - If $ARGUMENTS is empty or vague, make reasonable assumptions and provide sane defaults - DO NOT ask multiple questions
   - If you must clarify, ask ONE simple yes/no question max
   - Extract a clear, concise bug identifier from the input (kebab-case format, e.g., "auth-failing", "api-timeout", "ui-not-rendering")

2. **Analyze the project context** (high-level only):
   - First, invoke @docs-context to retrieve project documentation from `.context/docs/`
   - If documentation exists, use it to understand: tech stack, project type, architectural patterns, and debugging tools
   - If documentation does not exist, fallback to basic analysis:
     - Get a general sense of the project structure (avoid diving deep into specific files)
     - Identify the tech stack (look for package.json, requirements.txt, go.mod, etc.)
     - Understand the project type (web app, API, mobile, etc.)
     - Note general architectural patterns (avoid coupling to specific implementations)
     - Identify logging/debugging tools available (console, debugger, logging libraries)

3. **Create the directory structure**:
   - Create `.context/hacks/bugs/{bug-identifier}/debug/` in the project root
   - Ensure parent directories are created if they don't exist

4. **Generate debug.md** with this structure:

```markdown
# {Bug Name} - Debugging Workflow

**Created**: {timestamp}
**Sprint**: Hackathon MVP
**Status**: Active Debug
**Priority**: {High/Medium/Low based on impact}

## TL;DR
{2-3 sentence summary of the bug and its impact}

## Bug Description
**Symptom**: {What's visibly broken}
**Expected**: {What should happen}
**Actual**: {What's actually happening}
**Reproduces**: {Always/Sometimes/Rarely}

## Reproduction Steps
1. {Step 1}
2. {Step 2}
3. {Step 3}
{Keep to 3-7 steps max - must be copy-paste executable}

## Impact Assessment
**Severity**: {Critical/High/Medium/Low}
**Blocks**: {What features/work is blocked}
**Users Affected**: {Who can't use what}

## Debug Strategy

### Phase 1: Information Gathering (Quick)
- [ ] {Specific log to check - e.g., "Check browser console for errors"}
- [ ] {Specific state to verify - e.g., "Verify API response structure"}
- [ ] {Specific test to run - e.g., "Run unit tests for auth module"}
{Max 5 quick checks - should take < 10 minutes total}

### Phase 2: Hypothesis Testing
**Primary Hypothesis**: {Most likely cause based on symptoms}
- [ ] {Test to validate/invalidate hypothesis 1}
- [ ] {Expected result if hypothesis is correct}

**Secondary Hypothesis**: {Second most likely cause}
- [ ] {Test to validate/invalidate hypothesis 2}
- [ ] {Expected result if hypothesis is correct}

{Max 3 hypotheses - order by likelihood}

### Phase 3: Root Cause Isolation
**Suspect Areas**:
- {General area 1 - e.g., "authentication layer"}
- {General area 2 - e.g., "data persistence"}
- {General area 3 - e.g., "API integration"}

**Debug Actions**:
- [ ] {Specific debug step 1 - e.g., "Add console.log before API call"}
- [ ] {Specific debug step 2 - e.g., "Check network tab for failed requests"}
- [ ] {Specific debug step 3 - e.g., "Verify environment variables are set"}
{Max 7 actions - ordered by likely ROI}

## Known Variables
**Environment**: {dev/staging/prod - where does it happen?}
**Recent Changes**: {What changed before this broke?}
**Data State**: {Any specific data conditions needed?}
**Browser/Platform**: {If relevant}

## Quick Fixes to Try First
- {Common fix 1 - e.g., "Clear cache and restart"}
- {Common fix 2 - e.g., "Reinstall dependencies"}
- {Common fix 3 - e.g., "Check environment variables"}
{Hackathon-appropriate quick wins to try first}

## Debugging Tools Available
- {Tool 1}: {Quick usage - e.g., "DevTools: F12 -> Console"}
- {Tool 2}: {Quick usage - e.g., "Logger: import logger; logger.debug()"}
- {Tool 3}: {Quick usage - e.g., "Debugger: Add 'debugger;' statement"}
{List what's actually available in the project}

## Resolution Checklist
- [ ] Root cause identified and documented
- [ ] Fix implemented and tested
- [ ] Bug no longer reproduces
- [ ] Related functionality still works
- [ ] Quick smoke test passed

## Workaround (if needed)
{Temporary workaround to unblock development while debugging}
{Only if applicable - leave empty if not needed}

## Notes & Observations
{Space for adding observations during debugging}
{Links to relevant docs/Stack Overflow/etc.}
{Anything that might help future debugging}

## Time Budget
- Quick checks: {X minutes}
- Deep debugging: {X minutes}
- Fix & test: {X minutes}
- Total: {X minutes}
**Kill switch**: If not resolved in {X minutes}, escalate or workaround
```

5. **Keep it optimized for hackathons**:
   - Use checklists for everything - make it satisfying to check off
   - Bold key terms for easy scanning
   - Focus on fastest path to root cause
   - Include practical debugging shortcuts
   - Assume AI will help with implementation
   - Keep technical details minimal but sufficient
   - Prioritize speed over thoroughness
   - Include a "kill switch" time limit to avoid rabbit holes

6. **Adapt to project context** (stay flexible):
   - Reference general architectural patterns, not specific files or implementations
   - Use project's tech stack and available debugging tools
   - Keep workflow general enough to survive rapid structural changes
   - Describe what to check conceptually, not exactly where in the code
   - Avoid explicit code references or file paths that may change

7. **Confirm with the user** (MINIMAL FORMAT):
   - Output format: `✓ Created: {file-path}` on one line
   - Provide 1 sentence summary of what was generated
   - Next action suggestion: "Start with Phase 1 quick checks"
   - NO additional questions or explanations unless critical

IMPORTANT:
- The bug identifier must be extracted from user input and be URL-safe (kebab-case)
- Workflow should be executable in < 5 minutes for quick checks
- Focus on systematic elimination - not random guessing
- Include specific success criteria that can be checked off
- Mention practical debugging tools/techniques appropriate for a hackathon
- Time estimates should include a "kill switch" to avoid rabbit holes
- **If user input is vague, make smart assumptions and provide sane defaults - DO NOT ask clarifying questions unless absolutely critical**
- **Favor speed over thoroughness - user needs to unblock NOW**
- **DO NOT make explicit code changes** - this command generates debugging workflow only
- **Keep workflow general** - describe WHAT to check, not exactly WHERE in the code
- **Avoid coupling to specific implementations** - the project structure may change rapidly during the hackathon
- **Use conceptual language** - refer to "API layer" not "api.ts", "database queries" not specific ORM calls
- **Minimize cognitive load**: Use checklists, bold for key terms, short sentences
- **Copy-paste ready**: All debugging steps should be immediately executable
- **Zero fluff**: Every word must serve the debugging goal
- **Include kill switch**: Set time limits to avoid debugging rabbit holes during hackathon
