---
description: Review a pull request from the current repository (read-only analysis)
---

You are performing a comprehensive code review on a pull request from the current repository. This is a READ-ONLY analysis - no changes will be pushed back to GitHub. Follow these steps:

## Step 1: Get Repository Information

1. Extract the GitHub repository owner and name from the current working directory:
   - Run: `git remote get-url origin`
   - Parse the URL to extract owner and repository name
   - Handle both HTTPS and SSH formats

## Step 2: Fetch Pull Requests

2. Use the GitHub MCP server to list open pull requests:
   - Use `github_list_pull_requests` with the extracted owner and repo
   - Filter for open PRs only
   - Display a numbered list showing:
     - PR number and title
     - Author
     - Target branch
     - Number of changed files
     - Creation date

## Step 3: User Selection

3. Ask the user to select a PR for review:
   - Present the list clearly
   - Wait for user input (PR number or index from the list)
   - Validate the selection

## Step 4: Fetch PR Details

4. Once selected, gather comprehensive PR information:
   - Use `github_get_pull_request` for full PR details
   - Use `github_get_pull_request_files` to get all changed files
   - If there are existing reviews, fetch them with `github_get_pull_request_reviews`
   - If there are comments, fetch them with `github_get_pull_request_comments`

## Step 5: Perform Code Review

5. Analyze the pull request with focus on:

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

## Step 6: Generate Review Output

6. Present the review in three sections:

### Section A: Detailed Report
Provide a comprehensive analysis organized by file:
```
📁 File: [filename]
  Changes: [summary of changes]
  
  ✅ Strengths:
  - [specific positive aspects]
  
  ⚠️ Issues Found:
  - [severity]: [detailed issue description]
    Location: [file:line]
    Impact: [explanation]
    
  💡 Suggestions:
  - [specific improvement recommendations]
```

Repeat for each file with significant changes.

### Section B: Highlighted Overview
Provide a concise executive summary:
```
🎯 PULL REQUEST REVIEW SUMMARY
================================

Overall Assessment: [Approve/Request Changes/Needs Discussion]

Key Metrics:
- Files Changed: [number]
- Lines Added/Removed: [+X/-Y]
- Complexity Impact: [Low/Medium/High]
- Risk Level: [Low/Medium/High]

Main Achievements:
• [top 3-5 accomplishments]

Critical Issues:
• [top 3-5 issues that must be addressed]

Quick Wins:
• [2-3 easy improvements]
```

### Section C: Improvement Suggestions
Present actionable recommendations prioritized by impact:

```
🚀 RECOMMENDED IMPROVEMENTS
============================

Priority 1 - Must Fix (Blocking):
1. [Issue]: [Specific fix with code example if applicable]
   File: [file:line]
   Why: [Impact explanation]

Priority 2 - Should Fix (Important):
1. [Issue]: [Specific improvement]
   File: [file:line]
   Benefit: [Expected improvement]

Priority 3 - Consider (Nice to Have):
1. [Suggestion]: [Enhancement idea]
   Rationale: [Why this would help]

Testing Recommendations:
• [Specific test cases to add]

Documentation Needs:
• [What should be documented]
```

## Step 7: Review Complete

7. After presenting the review:
   - Inform the user that the review is complete
   - Note that this is a read-only analysis
   - The user can copy any parts of the review they wish to post manually

## Error Handling

- If unable to determine repository info, ask user to provide owner/repo
- If no open PRs exist, inform user and offer to review closed or merged PRs
- If GitHub API errors occur, provide helpful error messages
- Handle rate limiting gracefully

## Important Notes

- This is a READ-ONLY review - no data will be pushed to GitHub
- Be constructive and professional in all feedback
- Acknowledge good practices and improvements
- Provide specific examples and code snippets where helpful
- Consider the PR's context and stated goals
- Balance thoroughness with clarity
- Focus on meaningful issues over nitpicks
- When suggesting changes, provide concrete examples
- The review output can be copied by the user if they wish to post it manually

Execute this code review process systematically, ensuring comprehensive analysis while maintaining clarity and actionability in the feedback provided.