---
description: Generate task list from a ticket specification
agent: general
---

You are tasked with creating an actionable task list based on a ticket specification file.

**Input**: The user will provide a path to a ticket markdown file in one of these formats:
- `.context/tickets/{ticket}.md`
- `{ticket}.md` (will automatically look in `.context/tickets/`)
- `@{ticket}.md` (using @ prefix)
- `@.context/tickets/{ticket}.md` (full path with @ prefix)

Follow these steps:

1. **Read the ticket file**: Parse the provided ticket markdown file. If the user uses the `@` prefix, extract the file path from the reference. If only a filename is provided, automatically look in the `.context/tickets/` directory.

2. **Analyze the specification**: Review all sections of the ticket including:
   - Overview and problem statement
   - Acceptance criteria
   - Technical approach
   - Testing strategy
   - Considerations and edge cases

3. **Generate a comprehensive task list** that breaks down the implementation into actionable steps. Each task should:
   - Be specific and actionable (not vague)
   - Include the file path where work needs to be done
   - Be ordered logically (dependencies before dependents)
   - Be granular enough to track progress but not overly detailed
   - Include testing tasks

4. **Organize tasks into categories**:
   - **Setup/Preparation**: Any prerequisite work (dependencies, configuration)
   - **Core Implementation**: Main feature development tasks
   - **Testing**: Unit tests, integration tests, manual testing
   - **Documentation**: Code comments, README updates, API docs
   - **Cleanup/Polish**: Refactoring, error handling, edge cases

5. **Use the TodoWrite tool** to create the task list with:
   - All tasks in "pending" status
   - Appropriate priority levels (high/medium/low)
   - Clear, actionable descriptions

6. **Create the .context/tasks directory** in the project root if it doesn't exist.

7. **Save the task list** as a markdown file in `.context/tasks/` with a filename that matches the ticket name but with `TASKS-` prefix instead of `TICKET-`. For example:
   - Ticket: `TICKET-20251119-143022-add-user-authentication.md`
   - Tasks: `TASKS-20251119-143022-add-user-authentication.md`

   The markdown file should include:
   - A header with the ticket reference and title
   - Total number of tasks
   - Tasks organized by category with checkboxes (- [ ])
   - Each task with its priority level indicated
   - File paths and specific implementation details

8. **Display confirmation** to the user showing:
   - The path where the task list was saved
   - Total number of tasks generated
   - A brief summary organized by category

IMPORTANT: 
- Accept file references with or without the `@` prefix
- If only a filename is provided (e.g., `TICKET-20251119-143022-add-user-authentication.md`), automatically look in `.context/tickets/`
- If the ticket file path is not provided or invalid, ask the user for the correct path
- Make tasks specific with file paths and function names where possible
- Ensure tasks are in logical implementation order
- Include both implementation and testing tasks
- Each task should be completable in a reasonable timeframe (break large tasks into smaller ones)
