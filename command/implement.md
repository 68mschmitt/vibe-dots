---
description: Implement tasks from a task list file
agent: general
---

You are tasked with implementing tasks from a specified task list markdown file.

**Input**: The user will provide a path to a task list markdown file in one of these formats:
- `.context/tasks/{taskfile}.md`
- `{taskfile}.md` (will automatically look in `.context/tasks/`)
- `@{taskfile}.md` (using @ prefix)
- `@.context/tasks/{taskfile}.md` (full path with @ prefix)

Follow these steps:

1. **Read the task list file**: Parse the provided task list markdown file. If the user uses the `@` prefix, extract the file path from the reference. If only a filename is provided, automatically look in the `.context/tasks/` directory.

2. **Parse and extract tasks**: Review the task list and extract all tasks marked with checkboxes. For each task, identify:
   - The task description
   - Priority level (if specified)
   - Current status (checked/unchecked)
   - Associated file paths or code locations
   - Dependencies or ordering requirements

3. **Create a TodoWrite task list**: Use the TodoWrite tool to create a comprehensive task list with:
   - All unchecked tasks from the file in "pending" status
   - Tasks ordered logically (dependencies before dependents)
   - Appropriate priority levels based on the file's indicators
   - Clear, actionable descriptions

4. **Begin implementation**: Work through the tasks sequentially:
   - Mark each task as "in_progress" when you start working on it
   - Read relevant files to understand the existing codebase
   - Implement the changes required for the task
   - Test your changes when applicable
   - Mark the task as "completed" immediately after finishing
   - Move to the next task

5. **Implementation best practices**:
   - Read files before editing them to understand context
   - Make focused, incremental changes
   - Follow existing code patterns and style
   - Add comments where complexity warrants explanation
   - Handle errors gracefully
   - Consider edge cases mentioned in the task list

6. **Track progress**: 
   - Only work on ONE task at a time (one "in_progress" task)
   - Complete tasks before moving to the next
   - Update the TodoWrite list in real-time
   - If a task is blocked or unclear, mark it with a note and skip to the next

7. **Testing**:
   - Run tests when specified in the task list
   - Fix any errors or failures that occur
   - Verify implementation meets the task requirements

8. **Create implementation summary**: After all tasks are done:
   - Create the `.context/implementationSummary/` directory if it doesn't exist
   - Generate a detailed summary markdown file saved as `.context/implementationSummary/{taskfilename}.md` where {taskfilename} matches the original task file name (e.g., if input was `TASKS-20251119-143022-add-user-authentication.md`, save as `SUMMARY-20251119-143022-add-user-authentication.md`)
   
   The summary file should include:
   - **Header**: Title, date, and reference to the original task file
   - **Overview**: Brief description of what was implemented
   - **Tasks Completed**: List of all completed tasks with their status
   - **Tasks Incomplete/Blocked**: Any tasks not completed with reasons
   - **Files Modified**: List of all files that were changed or created
   - **Testing Results**: Outcomes of any tests run
   - **Issues Encountered**: Problems, blockers, or challenges faced
   - **Next Steps**: Suggestions for follow-up work or improvements
   - **Notes**: Any additional context or important observations

9. **Report completion**: Provide to the user:
   - Summary of what was implemented
   - Number of tasks completed vs total tasks
   - Path where the implementation summary was saved
   - Any critical issues or blockers encountered

IMPORTANT:
- Accept file references with or without the `@` prefix
- If only a filename is provided, automatically look in `.context/tasks/`
- If the task file path is not provided or invalid, ask the user for the correct path
- Work incrementally - complete one task fully before moving to the next
- Mark tasks as completed immediately (don't batch completions)
- If you encounter an error or blocker, document it and continue with remaining tasks
- Focus on completing the implementation, not just creating a plan
- Use the existing codebase patterns and conventions
