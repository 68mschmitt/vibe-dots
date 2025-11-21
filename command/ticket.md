---
description: Generate a detailed implementation ticket
agent: general
---

You are tasked with creating a detailed implementation specification ticket based on the user's input and the context of the root project.

Follow these steps:

1. **Analyze the user's request**: Understand what feature, bug fix, or enhancement they are requesting.

2. **Gather project context**: Review the project structure, existing code patterns, technologies used, and architectural decisions to ensure the ticket aligns with the current codebase.

3. **Create a detailed specification** that includes:
   - **Title**: A clear, concise title for the ticket
   - **Overview**: A brief summary of what needs to be implemented
   - **Problem Statement**: Why this work is needed (if applicable)
   - **Acceptance Criteria**: Specific, testable criteria that define when the work is complete
   - **Technical Approach**: Suggested implementation approach including:
     - Files that need to be created or modified
     - Key functions/classes/components to implement
     - Dependencies or libraries needed
     - Integration points with existing code
   - **Testing Strategy**: How the implementation should be tested
   - **Considerations**: Edge cases, potential issues, or architectural decisions to consider
   - **Related Files**: List of relevant files in the codebase

4. **Create the .context/tickets directory** in the project root if it doesn't exist.

5. **Save the ticket** as a markdown file in `.context/tickets/` with a filename format: `TICKET-{timestamp}-{slugified-title}.md` where:
   - `{timestamp}` is in format YYYYMMDD-HHMMSS
   - `{slugified-title}` is the ticket title converted to lowercase with hyphens

6. **Confirm completion** by showing the user:
   - The path where the ticket was saved
   - A brief summary of the ticket

IMPORTANT: Make the specification detailed and actionable. Include specific file paths, function signatures, and implementation details based on the actual project structure.
