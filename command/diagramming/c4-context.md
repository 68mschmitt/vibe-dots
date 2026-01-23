---
description: Generate C4 system context documentation (Phase 1)
subtask: true
---

# C4 System Context Documentation Generator

You are analyzing a codebase to generate C4 System Context documentation. This is Phase 1 of C4 documentation - the highest level view showing the system, its users, and external dependencies.

## Your Task

Analyze the codebase and generate `docs/architecture/c4/system-context.md`.

## Analysis Strategy

Use the Task tool with the "explore" agent for codebase exploration to keep your context lean:

### 1. Project Metadata Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find project metadata", 
     prompt="Find and summarize: package.json, README, build configs, project description. Return: project name, description, purpose, tech stack.")
```

### 2. Entry Points Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find entry points",
     prompt="Find main entry points, exported APIs, and public interfaces. Return: list of entry points with descriptions.")
```

### 3. External Dependencies Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find external integrations",
     prompt="Find external API calls, database connections, third-party services, SDKs. Check HTTP clients, environment variables, config files. Return: list of external systems with integration type.")
```

### 4. Users/Actors Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Identify users and actors",
     prompt="Analyze auth, roles, user types from code and docs. Return: list of user types with their roles and interactions.")
```

## Output Template

After gathering information from sub-agents, write to `docs/architecture/c4/system-context.md`:

```markdown
---
c4_level: context
system: {system-id-kebab-case}
last_updated: {YYYY-MM-DD}
---

# {System Name} - System Context

## Overview

[2-3 paragraphs describing what the system is, why it exists, its business 
value, and high-level purpose. Written for someone unfamiliar with the 
project. Include historical context if relevant.]

## Users

### {User/Actor Type 1}

[Description of who they are, how frequently they interact with the system, 
what they're trying to accomplish, and what parts of the system they use. 
Focus on their goals and interaction patterns.]

### {User/Actor Type 2}

[...]

## External Systems

### {External System 1}

[What this system is, why we integrate with it, what data or functionality 
flows between systems, the integration approach (REST API, webhooks, SDK, 
etc.), and any notable constraints, SLAs, or considerations.]

### {External System 2}

[...]

## Relationships

| From | To | Interaction |
|------|-----|-------------|
| {Actor/System} | {Actor/System} | {Description of the interaction, including protocol if relevant} |

## Diagram Guidance

[Notes for diagram generation: what relationships are most important to 
emphasize, any logical groupings, visual hierarchy suggestions, elements 
that should be prominently featured vs. de-emphasized.]
```

## Quality Guidelines

- Write for humans first, diagrams second
- Stay at the conceptual/architecture level, not code-level details
- Be specific about technologies and protocols
- Explain the "why" behind architectural decisions
- Use consistent terminology throughout

## Execution

1. Create the output directory if needed: `docs/architecture/c4/`
2. Spawn explore agents for each analysis task
3. Synthesize findings into the documentation template
4. Write the file
5. Report completion with a brief summary of what was documented
