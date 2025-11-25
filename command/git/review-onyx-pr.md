---
description: Review a PR from aderant/onyx-ui and save the review to ./devops/onyx-ui/code-review/
model: amazon-bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0
---

You are performing a comprehensive code review on pull request #$ARGUMENTS from the aderant/onyx-ui repository. This is a READ-ONLY analysis - no changes will be pushed back to GitHub.

## Context: Local Repository Location

The local onyx-ui repository is located at `./onyx-ui` (one directory down from the current working directory).

## Available MCP Servers

You have access to several MCP servers that should be utilized during this review:
- **GitHub MCP**: For fetching PR details, files, comments, and reviews
- **Azure DevOps MCP**: For cross-referencing linked work items, stories, tasks, epics, and features
- **Context7**: For looking up documentation and best practices for libraries/frameworks used in the PR
- **Sequential Thinking**: For complex analysis requiring step-by-step logical reasoning

## Step 1: Initialize Sequential Thinking

Use the `sequential-thinking_sequentialthinking` tool to plan and structure your review approach:
- Estimate the complexity of the PR review
- Break down the review into logical steps
- Identify key areas of focus based on the PR's scope
- Plan the integration of various MCP servers

## Step 2: Prepare Local Repository

1. Navigate to the onyx-ui repository:
   ```bash
   cd ./onyx-ui
   ```

2. Save the current branch name for later:
   ```bash
   PREVIOUS_BRANCH=$(git branch --show-current)
   ```

3. Check for uncommitted changes and stash them if present:
   ```bash
   if ! git diff-index --quiet HEAD --; then
     echo "Stashing local changes..."
     git stash push -m "Auto-stash before PR review #$ARGUMENTS"
     STASHED=true
   else
     echo "No local changes to stash"
     STASHED=false
   fi
   ```

## Step 3: Fetch and Checkout PR Branch

1. Fetch the PR details first using GitHub MCP:
   - Use `github_get_pull_request` with owner="aderant", repo="onyx-ui", and the provided PR number
   - Extract the source branch name from the PR details (head.ref)

2. Fetch the PR branch from the remote:
   ```bash
   git fetch origin pull/$ARGUMENTS/head:pr-$ARGUMENTS-review
   ```

3. Checkout the PR branch:
   ```bash
   git checkout pr-$ARGUMENTS-review
   ```

## Step 4: Fetch Complete PR Details

Use the GitHub MCP server to gather comprehensive PR information:
- Use `github_get_pull_request_files` to get all changed files with the same parameters
- If available, fetch existing reviews with `github_get_pull_request_reviews`
- If available, fetch comments with `github_get_pull_request_comments`

## Step 4a: Cross-Reference with Azure DevOps

Check if the PR references any Azure DevOps work items:
1. Parse the PR description and title for work item references (e.g., AB#12345, Task #12345)
2. If work items are found, use Azure DevOps MCP to:
   - Fetch work item details with `azure-devops_wit_get_work_item`
   - Get parent/child relationships to understand the feature/epic context
   - Retrieve acceptance criteria and requirements
   - Check related work items for additional context
3. Include this context in your review to ensure the PR meets the stated requirements

## Step 4b: Cross-Reference with Local Repository

Now with the PR branch checked out locally, you can:
- Examine the actual state of files being modified
- Run any local analysis tools if needed
- Understand broader context of the codebase
- Verify dependencies and imports
- Review related files not included in the PR

## Step 5: Analyze Dependencies with Context7

For any external libraries or frameworks modified or introduced in the PR:
1. Identify new dependencies or significant usage changes
2. Use `context7_resolve-library-id` to find the library documentation
3. Use `context7_get-library-docs` to fetch:
   - Best practices for the library
   - Common pitfalls and anti-patterns
   - Security considerations
   - Performance guidelines
4. Verify the PR follows documented best practices for these dependencies

## Step 6: Perform Code Review with Sequential Thinking

Use the `sequential-thinking_sequentialthinking` tool throughout this analysis to:
- Break down complex code patterns
- Analyze architectural decisions systematically
- Identify potential edge cases through logical reasoning
- Evaluate the impact of changes step-by-step

Analyze the pull request with focus on:

**Code Quality Assessment:**
- Code organization and structure
- Naming conventions and clarity
- Code duplication or opportunities for DRY
- Complexity and readability
- Proper error handling
- Input validation and edge cases

**Technical Analysis:**
- Performance implications
- Security considerations
- Potential bugs or issues
- Test coverage requirements
- Breaking changes or compatibility issues
- Dependencies and their impact

**Best Practices:**
- Design patterns usage
- SOLID principles adherence
- Language-specific idioms and conventions
- Documentation completeness
- Comments quality and necessity

**Architecture Considerations:**
- Alignment with existing codebase patterns
- Scalability implications
- Maintainability
- Technical debt introduction or reduction

## Step 7: Generate Review Document

Create a comprehensive review document with the following structure:

```markdown
# Code Review: [PR Title]

**PR Number:** #[number]
**Author:** [author name]
**Target Branch:** [branch name]
**Review Date:** [current date]
**Reviewer:** OpenCode AI with Claude Sonnet 4.5

---

## Azure DevOps Context

**Linked Work Items:** [List any linked work items or "None"]
**Parent Epic/Feature:** [If found via Azure DevOps MCP or "N/A"]
**Acceptance Criteria Met:** [Yes/No/Partial - based on work item requirements]

---

## Executive Summary

**Overall Assessment:** [Approve/Request Changes/Needs Discussion]

**Key Metrics:**
- Files Changed: [number]
- Lines Added/Removed: [+X/-Y]
- Complexity Impact: [Low/Medium/High]
- Risk Level: [Low/Medium/High]
- External Dependencies: [List new/modified dependencies]

**Main Achievements:**
• [top 3-5 accomplishments]

**Critical Issues:**
• [top 3-5 issues that must be addressed, or "None identified"]

**Quick Wins:**
• [2-3 easy improvements, or "None identified"]

---

## Library/Framework Analysis

[Include Context7 findings for any significant library usage]

**Dependencies Reviewed:**
- [Library Name]: [Version] - [Assessment based on Context7 docs]
  - Best practices: [Followed/Violations found]
  - Security considerations: [Notes]
  - Performance impact: [Notes]

---

## Detailed File Analysis

### 📁 [filename]

**Changes Summary:** [brief description of what changed]

**✅ Strengths:**
- [specific positive aspects]

**⚠️ Issues Found:**
- **[Severity]**: [detailed issue description]
  - Location: `[file:line]`
  - Impact: [explanation]
  - Recommendation: [how to fix]

**💡 Suggestions:**
- [specific improvement recommendations]

---

[Repeat for each file with significant changes]

---

## Recommended Improvements

### Priority 1 - Must Fix (Blocking)
1. **[Issue]:** [Specific fix with code example if applicable]
   - File: `[file:line]`
   - Why: [Impact explanation]

### Priority 2 - Should Fix (Important)
1. **[Issue]:** [Specific improvement]
   - File: `[file:line]`
   - Benefit: [Expected improvement]

### Priority 3 - Consider (Nice to Have)
1. **[Suggestion]:** [Enhancement idea]
   - Rationale: [Why this would help]

### Testing Recommendations
• [Specific test cases to add or "Test coverage appears adequate"]

### Documentation Needs
• [What should be documented or "Documentation appears adequate"]

---

## Sequential Analysis Summary

[Include key insights from the sequential thinking analysis]
- Decision points identified: [List major architectural/design decisions]
- Logic flow assessment: [Any issues with code flow or logic]
- Edge cases discovered: [Through systematic analysis]

---

## Conclusion

[Final thoughts and overall recommendation, incorporating insights from all MCP servers]

---

*This review was generated by OpenCode AI using Claude Sonnet 4.5, with assistance from GitHub MCP, Azure DevOps MCP, Context7, and Sequential Thinking analysis. Manual verification and human judgment should be applied before acting on any recommendations.*
```

## Step 7: Save Review to File

1. Navigate back to the parent directory:
   ```bash
   cd ..
   ```

2. Create the directory structure if it doesn't exist:
   - Target directory: `./devops/onyx-ui/code-review/`
   - Create directory with: `mkdir -p ./devops/onyx-ui/code-review/`

3. Save the review document:
   - Filename format: `[pr-number]-[sanitized-pr-title].md`
   - Sanitize the PR title by:
     - Converting to lowercase
     - Replacing spaces with hyphens
     - Removing special characters except hyphens and underscores
     - Limiting length to 50 characters
   - Full path example: `./devops/onyx-ui/code-review/123-add-new-dashboard-feature.md`

4. Confirm to the user:
   - Display the full path where the review was saved
   - Provide a summary of what was reviewed
   - Note that this is a read-only analysis and nothing was posted to GitHub

## Step 8: Restore Previous Git State

1. Navigate back to the onyx-ui repository:
   ```bash
   cd ./onyx-ui
   ```

2. Checkout the previous branch:
   ```bash
   git checkout "$PREVIOUS_BRANCH"
   echo "Restored to branch: $PREVIOUS_BRANCH"
   ```

3. Delete the temporary PR review branch:
   ```bash
   git branch -D pr-$ARGUMENTS-review
   ```

4. Restore any stashed changes:
   ```bash
   if [ "$STASHED" = "true" ]; then
     echo "Restoring stashed changes..."
     git stash pop
   else
     echo "No stashed changes to restore"
   fi
   ```

5. Return to the parent directory:
   ```bash
   cd ..
   ```

## Error Handling

- If the PR number is invalid, inform the user and ask for a valid PR number
- If the PR is not found, display an error message with the attempted PR number
- If GitHub API errors occur, provide helpful error messages
- Handle rate limiting gracefully
- If directory creation fails, inform the user about permission issues

## Important Notes

- This is a READ-ONLY review - no data will be pushed to GitHub
- Be constructive and professional in all feedback
- Acknowledge good practices and improvements
- Provide specific examples and code snippets where helpful
- Consider the PR's context and stated goals (especially Azure DevOps requirements)
- Balance thoroughness with clarity
- Focus on meaningful issues over nitpicks
- When suggesting changes, provide concrete examples
- Reference Context7 documentation for library-specific recommendations
- Use Sequential Thinking for complex logical analysis
- The review is saved locally and can be edited before sharing

## MCP Server Integration Summary

1. **GitHub MCP**: Primary source for PR data, files, and existing reviews
2. **Azure DevOps MCP**: Cross-reference work items, verify requirements alignment
3. **Context7**: Validate library usage against best practices and documentation
4. **Sequential Thinking**: Systematic analysis of complex code patterns and logic flows

Execute this code review process systematically, leveraging all available MCP servers to provide the most comprehensive and insightful analysis possible.
