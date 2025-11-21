---
description: Generate AI-optimized project context organized by domain perspective
---

Generate an AI-optimized context overview of the current project, organized by domain perspective (product, documentation, architecture, code, and operations). This creates structured summaries that help AI agents quickly understand how the project works, how it's organized, and how to safely make changes.

**First, ensure the documentation directory exists:**
Before starting, create the `.context/docs` directory in the project root if it doesn't already exist using: `mkdir -p .context/docs`

**Check for existing documentation:**
Invoke @docs-context to check if project documentation already exists in `.context/docs/`. If substantial documentation already exists, inform the user and suggest using `/hackupdatethephotoid` instead to refresh existing documentation. Only proceed with new documentation generation if no docs exist or they are minimal.

**Fetch relevant library documentation using Context7:**
After analyzing the project's dependencies and technology stack:
1. Identify the key libraries, frameworks, and tools used in the project (from package.json, requirements.txt, etc.)
2. For each major dependency, use Context7's `resolve-library-id` tool to find the appropriate library ID
3. Use Context7's `get-library-docs` tool to fetch relevant documentation for each library
4. Store the fetched documentation in `.context/docs/libraries/[library-name]/` subdirectories
5. Create an index file at `.context/docs/libraries/index.md` listing all stored library documentation
6. Focus on documentation that matches the patterns and best practices implemented in the project
7. Prioritize core dependencies and frameworks over minor utilities

**Then, dispatch six subagents in parallel** to analyze and document the following domain perspectives (five for project analysis + one for Context7 library documentation):

## 1. Product Perspective (Save as `.context/docs/product.md`)
Analyze the project from a product standpoint and create documentation covering:
- **Project Purpose**: What problem does this solve? Who are the users?
- **Core Features**: Key functionality and user-facing capabilities
- **User Flows**: Critical user journeys and interaction patterns
- **Product Requirements**: Current scope and feature priorities
- **Business Logic**: Domain rules and core product behaviors
- **Value Proposition**: What makes this product valuable/unique
- **User Experience**: UX patterns, accessibility considerations
- **Product Roadmap Hints**: Based on TODOs, comments, or incomplete features

## 2. Documentation Perspective (Save as `.context/docs/documentation.md`)
Analyze existing documentation and create a unified reference covering:
- **README Overview**: Key information from project README
- **Getting Started**: Setup, installation, and first-run instructions
- **Configuration**: Environment variables, config files, settings
- **Usage Guides**: How to use the application or library
- **API Documentation**: Endpoint references, SDK usage, public interfaces
- **Troubleshooting**: Common issues and solutions found in docs
- **Contributing Guidelines**: Development workflow, coding standards
- **Changelog/History**: Version history and major changes
- **External References**: Links to related documentation, tutorials

## 3. Architecture Perspective (Save as `.context/docs/architecture.md`)
Analyze the system architecture and technical design covering:
- **System Architecture**: High-level component diagram (textual)
- **Technology Stack**: Languages, frameworks, libraries, tools
- **Design Patterns**: Architectural patterns used (MVC, microservices, etc.)
- **Component Structure**: Major modules/packages and their responsibilities
- **Data Flow**: How data moves through the system
- **External Dependencies**: Third-party services, APIs, databases
- **Integration Points**: Where the system connects to other systems
- **Scalability Considerations**: Performance and scaling patterns
- **Security Architecture**: Authentication, authorization, data protection
- **Infrastructure**: Deployment architecture, hosting, cloud services

## 4. Code Perspective (Save as `.context/docs/code.md`)
Analyze the codebase implementation details covering:
- **Project Structure**: Directory/folder organization and conventions
- **Key Files**: Most important files and what they do
- **Entry Points**: Main application entry files, startup sequence
- **Core Modules**: Critical code modules and their purposes
- **Data Models**: Database schemas, entity structures, types
- **API Layer**: Controllers, routes, endpoints implementation
- **Business Logic**: Where core functionality lives
- **State Management**: How application state is managed
- **Error Handling**: Error handling patterns and logging
- **Testing**: Test structure, coverage, testing patterns
- **Code Conventions**: Naming, formatting, style patterns observed
- **Technical Debt**: Known issues, TODOs, areas needing refactoring

## 5. Operations Perspective (Save as `.context/docs/operations.md`)
Analyze operational aspects and DevOps practices covering:
- **Build System**: Build tools, scripts, compilation process
- **Package Management**: Dependencies, package managers, lock files
- **Development Workflow**: Local development setup and commands
- **Testing Pipeline**: Test commands, CI/CD testing
- **Deployment Process**: How code gets to production
- **Environment Management**: Dev/staging/prod environments
- **Monitoring & Logging**: Observability tools and practices
- **Database Operations**: Migrations, backups, seeding
- **Scripts & Automation**: Build scripts, deployment scripts, utilities
- **Infrastructure as Code**: Terraform, CloudFormation, K8s configs
- **Secrets Management**: How secrets/credentials are handled
- **Disaster Recovery**: Backup and recovery procedures

## 6. Library Documentation Perspective (Save as `.context/docs/libraries/`)
Fetch and store official documentation for project dependencies using Context7:

**Process:**
1. **Identify Dependencies**: Scan package.json, requirements.txt, go.mod, Cargo.toml, or equivalent dependency files
2. **Prioritize Libraries**: Focus on:
   - Core frameworks (React, Vue, Angular, Express, FastAPI, etc.)
   - State management (Redux, Zustand, Pinia, etc.)
   - UI libraries (Material-UI, Tailwind, Chakra, etc.)
   - Testing frameworks (Jest, Vitest, Pytest, etc.)
   - Major utilities that have significant usage in the codebase
3. **Fetch Documentation**: For each priority library:
   - Use `resolve-library-id` to find the Context7 library ID
   - Use `get-library-docs` to fetch relevant documentation
   - Request multiple topic-specific pages if needed (e.g., "hooks", "routing", "API reference")
   - Focus on topics that align with patterns observed in the project code
4. **Store Documentation**: Save to `.context/docs/libraries/[library-name]/`
   - Create a subdirectory for each library
   - Save each documentation page as a separate markdown file
   - Include metadata (library version, fetch date, topics covered)
5. **Create Index**: Generate `.context/docs/libraries/index.md` with:
   - List of all documented libraries
   - Brief description of each library's purpose in the project
   - Links to stored documentation files
   - Notes on which patterns/features from each library are used in the project

**Library Documentation Guidelines:**
- Focus on practical usage patterns that match the project's implementation
- Include API references for commonly used functions/components
- Store best practices and recommended patterns
- Include troubleshooting and common issues
- Link to official sources for deeper reference
- Note version-specific information and breaking changes

**Each subagent should:**
1. Thoroughly examine the entire codebase from their domain perspective
2. Identify patterns, structures, and key information relevant to their domain
3. Create well-organized, scannable markdown documentation
4. Use bullet points, bold headers, and clear sections for easy AI parsing
5. Include specific file/path references where relevant (e.g., `src/auth/login.ts:42`)
6. Focus on actionable information that helps AI agents make safe decisions
7. Note areas of uncertainty or missing information
8. Save their documentation to the appropriate markdown file in `.context/docs/`
9. (Library Documentation Agent only) Use Context7 tools to fetch and store official library documentation

**Documentation Goals:**
- **AI-Optimized**: Structured for quick scanning and context building
- **Domain-Separated**: Each perspective provides a different lens on the project
- **Actionable**: Information that helps AI agents complete tasks safely
- **Complete**: Cover all aspects of the project from each perspective
- **Maintainable**: Easy to update as the project evolves

Execute these tasks in parallel for maximum efficiency, then provide a summary of what was documented and where the files are located.
