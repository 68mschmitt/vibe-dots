---
description: Generate C4 component documentation for a specific container (Phase 3)
subtask: true
---

# C4 Component Documentation Generator

You are analyzing a specific container to generate C4 Component documentation. This is Phase 3 of C4 documentation - showing the internal structure of a single container.

## Arguments

Container name: $ARGUMENTS

If no container name provided, read `docs/architecture/c4/containers.md` and generate component docs for ALL significant containers.

## Your Task

Generate `docs/architecture/c4/components/{container-name}.md` for the specified container(s).

## Prerequisites

Read these files first:
- `docs/architecture/c4/system-context.md` - for overall context
- `docs/architecture/c4/containers.md` - for container details and boundaries

## Analysis Strategy

Use the Task tool with the "explore" agent for focused container analysis:

### 1. Internal Structure Analysis

Spawn an explore agent scoped to the container:
```
Task(subagent_type="explore", description="Analyze {container} structure",
     prompt="In the {container-path} directory, map the internal module/package organization. Identify layers, domains, or functional groupings. Return: directory structure with purpose of each module.")
```

### 2. Key Abstractions Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find {container} components",
     prompt="In {container-path}, find key abstractions: controllers, services, repositories, handlers, processors, managers, domain models. Return: list of components with type and responsibility.")
```

### 3. Design Patterns Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Identify {container} patterns",
     prompt="In {container-path}, identify design patterns: MVC, CQRS, Event Sourcing, DI, plugins, etc. Look at how dependencies flow. Return: patterns used with examples.")
```

### 4. Data Flow Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Trace {container} data flow",
     prompt="In {container-path}, trace request/response paths, event flows, data transformation pipelines. How does data enter, transform, and exit? Return: key data flows with component sequence.")
```

## Output Template

Write to `docs/architecture/c4/components/{container-name-kebab-case}.md`:

```markdown
---
c4_level: components
container_ref: {container-id}
last_updated: {YYYY-MM-DD}
---

# {Container Name} - Components

## Overview

[1-2 paragraphs describing the internal architecture of this container. 
What design patterns are used? How is the code organized? What are the 
main layers or modules?]

## Components

### {Component 1 Name}

**Type:** {Controller / Service / Repository / Handler / etc.}

[Description of this component's responsibilities, what abstractions it 
provides, key behaviors, and its role in the container's architecture.]

### {Component 2 Name}

**Type:** {Controller / Service / Repository / Handler / etc.}

[...]

## Relationships

| From | To | Interaction |
|------|-----|-------------|
| {External reference or Component} | {Component} | {Description of the interaction} |

## Diagram Guidance

[Notes: layering to show, groupings by responsibility, key data flows 
through the components, entry points to emphasize.]
```

## Handling Multiple Containers

If generating for ALL containers:

1. Read containers.md to get the list
2. Skip trivial containers (static file servers, basic proxies)
3. For each significant container, perform the analysis and write its file
4. Report which containers were documented

## Quality Guidelines

- Stay at component level, not class/function level
- Focus on architectural components, not every module
- Identify clear responsibilities for each component
- Show how components collaborate
- Group related components logically

## Execution

1. Determine which container(s) to document
2. For each container:
   a. Spawn explore agents for analysis
   b. Synthesize findings into documentation
   c. Write to `docs/architecture/c4/components/{name}.md`
3. Report completion with summary of components documented
