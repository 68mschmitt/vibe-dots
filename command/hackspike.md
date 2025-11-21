---
description: Generate level of effort spike documentation for hackathon features
---

You are tasked with generating a concise level of effort (LOE) spike that analyzes the complexity and implementation path for a feature. This spike will be consumed by future agents to generate requirements.

**Goal**: Create a structured LOE analysis optimized for AI agents to understand scope, complexity, and implementation strategy.

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

**CRITICAL**: This command generates SPIKE DOCUMENTATION ONLY. Do not make code changes. Keep analysis general and optimized for future agent consumption.

**User Input**: $ARGUMENTS

Follow these steps:

1. **Gather context from the user**: 
   - The user's feature description is provided in $ARGUMENTS above
   - If $ARGUMENTS is empty or vague, make reasonable assumptions and provide sane defaults - DO NOT ask multiple questions
   - If you must clarify, ask ONE simple yes/no question max
   - Extract a clear, concise feature name from the input (kebab-case format, e.g., "user-auth", "payment-flow", "social-sharing")

2. **Analyze the project context** (focused investigation):
   - First, invoke @docs-context to retrieve project documentation from `.context/docs/`
   - If documentation exists, use it to understand: tech stack, architecture, existing features, integration points, and technical constraints
   - Supplement with focused investigation:
     - Identify the tech stack (look for package.json, requirements.txt, go.mod, etc.)
     - Understand project architecture and patterns
     - Identify existing similar features or components
     - Locate relevant integration points
     - Assess current codebase complexity
     - Note any existing technical debt or constraints

3. **Create the directory structure**:
   - Create `.context/hacks/{feature-name}/spike/` in the project root
   - Ensure parent directories are created if they don't exist

4. **Generate spike.md** with this structure:

```markdown
# {Feature Name} - Level of Effort Spike

**Created**: {timestamp}
**Sprint**: Hackathon MVP
**Status**: Spike Analysis

## TL;DR
**Complexity**: {Low/Medium/High/Unknown}
**Est. Time**: {X-Y hours}
**Risk Level**: {Low/Medium/High}

{1-2 sentence summary of what needs to be built and overall complexity}

## Feature Overview
{2-3 sentence description of what the user wants to accomplish}

## Complexity Analysis

### Technical Complexity: {Low/Medium/High}
**Reason**: {1 sentence explanation}

**Breakdown**:
- **Architecture Changes**: {None/Minor/Moderate/Major} - {Why}
- **New Dependencies**: {None/Few/Many} - {What kind}
- **Integration Complexity**: {Simple/Moderate/Complex} - {With what}
- **Data Modeling**: {None/Simple/Complex} - {What needs modeling}
- **UI/UX Work**: {None/Simple/Moderate/Complex} - {What's involved}

### Existing Code Leverage
**Can we reuse existing code?** {Yes/Partially/No}

{List existing components, patterns, or features that can be leveraged}
- {Component/Pattern 1}: {How it helps}
- {Component/Pattern 2}: {How it helps}

### Unknown Factors
{List any unknowns that could impact LOE}
- {Unknown 1}: {Why it matters}
- {Unknown 2}: {Why it matters}

## Implementation Path

### Approach: {Describe the general strategy in 1 sentence}

**Key Steps** (in order):
1. {Step 1}: {Time estimate} - {Complexity: Low/Med/High}
2. {Step 2}: {Time estimate} - {Complexity: Low/Med/High}
3. {Step 3}: {Time estimate} - {Complexity: Low/Med/High}
{3-7 steps total}

### Quick Wins
{Shortcuts, libraries, or hacks that speed up implementation}
- {Win 1}: {Saves X hours}
- {Win 2}: {Saves X hours}

### Potential Blockers
{Things that could derail or significantly slow down implementation}
- **{Blocker 1}**: {Impact} - {Mitigation strategy}
- **{Blocker 2}**: {Impact} - {Mitigation strategy}

## Effort Breakdown

### Development Time
- **Setup & Scaffolding**: {X hours}
- **Core Implementation**: {X hours}
- **Integration Work**: {X hours}
- **Testing & Debugging**: {X hours}
- **Buffer (unknowns)**: {X hours}
- **Total**: {X-Y hours}

### Skill Requirements
- {Skill 1}: {Required level: Basic/Intermediate/Advanced}
- {Skill 2}: {Required level: Basic/Intermediate/Advanced}

### Dependencies
**External**:
- {Library/API/Service 1}: {Why needed}

**Internal**:
- {Team/Resource 1}: {Why needed}

## Risk Assessment

### High Risk Items
{List items that could significantly impact delivery}
- **{Risk 1}**: {Likelihood} - {Impact} - {Mitigation}

### Medium Risk Items
{List items with moderate impact}
- **{Risk 1}**: {Likelihood} - {Impact}

### Low Risk Items
{List minor concerns}
- {Risk 1}

## Recommendations

### Approach
**Recommended**: {Describe recommended approach in 1-2 sentences}

**Alternatives Considered**:
- {Alternative 1}: {Why not recommended}
- {Alternative 2}: {Why not recommended}

### Scope Adjustments
**To reduce complexity/time, consider**:
- {Scope reduction 1}: {Time saved}
- {Scope reduction 2}: {Time saved}

### Phase Breakdown (if complex)
**Phase 1 (MVP)**: {X hours} - {What to build first}
**Phase 2 (Polish)**: {X hours} - {What to add next}

## Agent Consumption Guide

**For requirements generation**, focus on:
- Core user flow: {Steps X-Y above}
- MVP scope IN: {Key steps that must be done}
- MVP scope OUT: {What can be deferred - list from scope adjustments}
- Quick wins: {From quick wins section above}
- Technical approach: {From implementation path above}

**Critical considerations for AI implementation**:
- {Consideration 1}: {Why it matters}
- {Consideration 2}: {Why it matters}
- {Consideration 3}: {Why it matters}

**Suggested requirement structure**:
{Brief outline of how requirements should be organized based on this spike}

## Reference Links
{Any relevant documentation, examples, or resources discovered during spike}
- {Link 1}
- {Link 2}

## Notes
{Any additional context, observations, or gotchas discovered during analysis}
```

5. **Keep it optimized for AI agent consumption**:
   - Use clear hierarchical structure with semantic headers
   - Provide explicit complexity ratings (Low/Med/High)
   - Include concrete time estimates
   - Separate facts from recommendations
   - Use consistent formatting for similar items
   - Bold key decisions and numbers
   - Structure data for easy extraction
   - Focus on actionable insights

6. **Thorough but efficient analysis**:
   - Actually explore the codebase to understand context
   - Look for existing patterns and components
   - Identify real integration points
   - Assess actual technical complexity
   - Provide evidence-based time estimates
   - Note specific unknowns discovered during investigation
   - BUT keep investigation focused - don't go down rabbit holes

7. **Confirm with the user** (MINIMAL FORMAT):
   - Output format: `✓ Created: {file-path}` on one line
   - Provide 1 sentence summary of LOE conclusion
   - Next action in copy-paste format: `/hackreq {feature-name}` (with context from spike)
   - NO additional questions or explanations unless critical

IMPORTANT:
- The feature name must be extracted from user input and be URL-safe (kebab-case)
- Spike should be scannable in < 2 minutes by an AI agent
- Provide specific, evidence-based estimates (not vague ranges)
- Include both optimistic and realistic scenarios
- Call out unknowns explicitly - don't hide them
- Recommendations must be clear and actionable
- Time estimates should account for AI-assisted development speed
- Structure the "Agent Consumption Guide" to directly map spike findings to requirement generation
- **If user input is vague, make smart assumptions and investigate the codebase to fill gaps**
- **DO NOT make code changes** - this command generates spike documentation only
- **Actually look at the code** - provide evidence-based analysis, not generic speculation
- **Focus on what a future agent needs to know** to generate good requirements
- **Minimize cognitive load for user**: Bold key numbers, use clear ratings, provide TL;DR
- **Optimize for agent parsing**: Consistent structure, explicit labels, clear hierarchies
- **Be honest about complexity** - better to over-estimate than under-deliver
