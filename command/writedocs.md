---
description: Generate comprehensive documentation for the application
agent: general
subtask: true
---

Create comprehensive documentation for this application by analyzing and documenting three key areas.

**First, ensure the documentation directory exists:**
Before starting, create the `.context/agentdocs` directory in the project root if it doesn't already exist using: `mkdir -p .context/agentdocs`

**Then, dispatch three subagents in parallel** to document the following areas of the application:

## 1. Backend Documentation (Save as `.context/agentdocs/backend.md`)
Analyze the backend/server-side code and create detailed documentation covering:
- Architecture overview and design patterns used
- API endpoints, routes, and their purpose
- Database schema and data models
- Authentication and authorization mechanisms
- Error handling and logging strategies
- Key services, utilities, and helper functions
- Configuration and environment setup
- External dependencies and integrations
- Performance considerations and optimizations

## 2. Frontend Documentation (Save as `.context/agentdocs/frontend.md`)
Analyze the frontend/client-side code and create detailed documentation covering:
- Application structure and component hierarchy
- State management approach (Redux, Context API, etc.)
- Routing and navigation flow
- UI component library and styling approach
- Data fetching and API integration
- Form handling and validation
- Authentication flow from user perspective
- Performance optimization techniques
- Browser compatibility and dependencies
- Build process and deployment

## 3. Testing Documentation (Save as `.context/agentdocs/testing.md`)
Analyze the testing infrastructure and create detailed documentation covering:
- Testing framework and libraries used
- Unit testing strategy and conventions
- Integration testing approach
- End-to-end testing setup
- Test file organization and naming conventions
- Mocking and fixture strategies
- Code coverage targets and metrics
- CI/CD testing pipeline
- Common testing patterns and examples
- Best practices for maintaining tests

**Each subagent should:**
1. Thoroughly examine their respective section of the codebase
2. Identify key files, patterns, and structures
3. Create well-organized, detailed markdown documentation
4. Include code examples where relevant
5. Save their documentation to the appropriate markdown file in `.context/agentdocs/`

Execute these tasks in parallel for efficiency, then provide a summary of what was documented.
