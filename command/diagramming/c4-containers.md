---
description: Generate C4 container documentation (Phase 2)
subtask: true
---

# C4 Container Documentation Generator

You are analyzing a codebase to generate C4 Container documentation. This is Phase 2 of C4 documentation - showing the high-level technology choices and how responsibilities are distributed across deployable units.

## Your Task

Analyze the codebase and generate `docs/architecture/c4/containers.md`.

## Prerequisites

Read `docs/architecture/c4/system-context.md` first to understand the system context.

## Analysis Strategy

Use the Task tool with the "explore" agent for codebase exploration to keep your context lean:

### 1. Directory Structure Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Analyze directory structure",
     prompt="Map the top-level directory structure. Identify logical boundaries, monorepo structure, separate applications/services. Return: directory tree with purpose of each major directory.")
```

### 2. Deployment Configuration Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find deployment configs",
     prompt="Find Docker, Kubernetes, serverless configs (Dockerfile, docker-compose, k8s manifests, serverless.yml, deployment scripts). Return: list of deployable units with their configurations.")
```

### 3. Services and Applications Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Identify services",
     prompt="Find service definitions, application entry points, separate deployable units. Look for multiple package.json, main files, service registrations. Return: list of services/applications with tech stack.")
```

### 4. Data Storage Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find data storage",
     prompt="Find database configs, schemas, migrations, cache configs, file storage. Look for ORM configs, connection strings, storage clients. Return: list of data stores with technology and purpose.")
```

### 5. Infrastructure Analysis

Spawn an explore agent:
```
Task(subagent_type="explore", description="Find infrastructure components",
     prompt="Find message queues, load balancers, API gateways, monitoring, logging configs. Return: list of infrastructure components with purpose.")
```

## Output Template

After gathering information from sub-agents, write to `docs/architecture/c4/containers.md`:

```markdown
---
c4_level: containers
system_ref: {system-id}
last_updated: {YYYY-MM-DD}
---

# {System Name} - Containers

## Architecture Overview

[2-3 paragraphs describing the overall architecture style (monolith, 
microservices, serverless, etc.), key design decisions and their rationale, 
deployment model, and how the system is decomposed into containers. Include 
reasoning for technology choices.]

## Containers

### {Container 1 Name}

**Technology:** {Primary technology/framework/runtime}

[Description of this container's purpose and responsibilities. Why does it 
exist as a separate deployable unit? What business capabilities does it 
provide? What are its key characteristics (stateless, event-driven, etc.)?]

### {Container 2 Name}

**Technology:** {Primary technology/framework/runtime}

[...]

### {Data Store Name}

**Technology:** {Database/storage technology}

[Description of what data it holds, why this storage technology was chosen, 
data model characteristics (relational, document, key-value, etc.), and any 
notable operational characteristics (replication, caching, backup strategy).]

### {Message Queue / Cache / Other Infrastructure}

**Technology:** {Technology}

[Description of its role in the system and why it's needed.]

## Relationships

| From | To | Interaction |
|------|-----|-------------|
| {User/Container} | {Container} | {Protocol}: {Description of what flows between them} |

## Diagram Guidance

[Notes for diagram generation: logical groupings (e.g., "frontend tier", 
"backend services", "data layer"), primary data flows to emphasize, 
suggested visual arrangement, containers that form a logical unit.]
```

## Quality Guidelines

- Focus on deployable units, not code modules
- Be specific about technologies and protocols
- Explain architectural decisions and trade-offs
- Identify clear boundaries between containers
- Note which containers are significant enough for component-level documentation

## Execution

1. Read system-context.md for context
2. Spawn explore agents for each analysis task
3. Synthesize findings into the documentation template
4. Write the file to `docs/architecture/c4/containers.md`
5. Report completion with:
   - Summary of containers identified
   - List of containers recommended for component-level documentation
