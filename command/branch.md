---
description: Create and checkout a new git branch
agent: build
---

Create a new git branch based on the user's description and checkout to it. The user will provide: $ARGUMENTS

Follow these steps:

1. Generate a suitable branch name from $ARGUMENTS:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters (keep only alphanumeric and hyphens)
   - Keep it concise but descriptive (e.g., "fix navigation bug" → "fix-navigation-bug")

2. Check if there are any uncommitted changes:
   - Run: git status --porcelain

3. Handle uncommitted changes if they exist:
   - If there are changes, stash them: git stash push -m "Auto-stash before branch checkout"
   - Note the stash for later restoration

4. Create and checkout the new branch:
   - Run: git branch {branch-name}
   - Run: git checkout {branch-name}

5. If changes were stashed in step 3:
   - Restore them: git stash pop

6. Confirm the branch creation and current status to the user

If any errors occur during branch creation or checkout, report them clearly and do not proceed with subsequent steps.
