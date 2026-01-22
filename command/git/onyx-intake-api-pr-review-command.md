# OpenCode CLI Custom Command Configuration
# Command: /onyx-intake-api-pr-review
# Description: Comprehensive PR review for aderant/onyx-intake-api with Azure DevOps integration
# Usage: /onyx-intake-api-pr-review <PR_NUMBER>

name: onyx-intake-api-pr-review
description: Comprehensive PR review for aderant/onyx-intake-api with Azure DevOps integration
arguments:
  - name: pr_number
    description: Pull request number
    required: true

prompt: |
  You are performing a comprehensive code review for PR #$ARGUMENTS from aderant/onyx-intake-api repository.
  
  ## Step 1: Initialize Sequential Thinking
  
  Use sequential-thinking_sequentialthinking to plan your review approach:
  - Estimate complexity based on files changed
  - Identify key areas requiring deep analysis
  - Plan integration of GitHub, Azure DevOps, and Context7 MCPs
  
  ## Step 2: Fetch PR Details from GitHub
  
  Use GitHub MCP to gather comprehensive information:
  
  1. Get PR details:
     - Use github_get_pull_request with owner="aderant", repo="onyx-intake-api", pull_number=$ARGUMENTS
     - Extract: title, author, description, state, created date, base/head branches
  
  2. Get changed files:
     - Use github_get_pull_request_files with same parameters
     - Analyze: file paths, additions/deletions, change types
  
  3. Get existing reviews and comments:
     - Use github_get_pull_request_reviews
     - Use github_get_pull_request_comments
     - Note: Consider existing feedback in your review
  
  ## Step 3: Cross-Reference Azure DevOps Work Items
  
  Parse the PR description and title for Azure DevOps work item references:
  - Patterns: "AB#12345", "#12345", "User Story 12345", "Task 12345"
  - Use azure-devops_wit_get_work_item with project="Compliance Platform" for each found work item
  - Get parent work items to understand epic/feature context
  - Extract acceptance criteria and requirements
  
  Verify work item is in current sprint:
  - Use azure-devops_core_list_project_teams to get team info
  - Use azure-devops_work_list_team_iterations with timeframe="current"
  - Check if work item's iteration matches current sprint
  - Flag if work item is NOT in current sprint or is in wrong state
  
  ## Step 4: Analyze Dependencies with Context7
  
  For each significant library/framework used in the PR:
  
  1. Identify libraries from:
     - Import statements in changed files
     - package.json changes
     - New dependencies introduced
  
  2. For each library:
     - Use context7_resolve-library-id to find documentation
     - Use context7_get-library-docs with mode="code" for API usage validation
     - Use context7_get-library-docs with mode="info" for architectural patterns
     - Document: best practices followed/violated, security concerns, performance implications
  
  ## Step 5: Perform Comprehensive Code Review with Sequential Thinking
  
  Use sequential-thinking_sequentialthinking throughout analysis to:
  - Break down complex code patterns systematically
  - Analyze architectural decisions step-by-step
  - Identify edge cases through logical reasoning
  - Evaluate impact of changes methodically
  
  Review focus areas:
  
  ### Code Quality
  - Organization and structure
  - Code duplication (DRY principle)
  - Complexity and readability
  - Error handling completeness
  - Input validation and edge cases
  - Debug statements or temporary code left in
  
  ### Technical Analysis
  - Performance implications (database queries, API calls)
  - Security considerations (authentication, authorization, data validation)
  - Potential bugs or logic errors
  - Test coverage (check for test files, xUnit/NUnit)
  - Breaking changes to API contracts
  - Dependencies and version compatibility
  - Database migration impacts
  
  ### Best Practices
  - Design patterns usage (validated with Context7)
  - SOLID principles adherence
  - Language-specific idioms (typescript)
  - Documentation completeness (XML comments)
  - API documentation (OpenAPI/Swagger)
  - Logging and observability
  
  ### Architecture
  - Alignment with existing codebase patterns
  - RESTful API design principles
  - Scalability implications
  - Maintainability assessment
  - Technical debt introduced/reduced
  - API versioning considerations
  - Dependency injection patterns
  
  ### Azure DevOps Alignment
  - Acceptance criteria met (from work item)
  - Requirements fulfilled
  - Proper work item state (should be "In Development" or similar)
  - Story points reasonable for changes made
  
  ## Step 6: Generate Comprehensive Review Report
  
  Create directory structure if needed:
  - Check if ./devops/onyx-intake-api/pr-reviews/ exists
  - Create directory with: mkdir -p ./devops/onyx-intake-api/pr-reviews/
  
  Generate report with this structure:
  
  ```markdown
  # Code Review: [PR Title]
  
  **PR Number:** #$ARGUMENTS
  **Author:** [author name]
  **Target Branch:** [branch name]
  **Review Date:** [current date]
  **Reviewer:** OpenCode AI with Claude Sonnet 4.5
  
  ---
  
  ## Azure DevOps Context
  
  **Linked Work Items:** [List with links]
  **Parent Epic/Feature:** [If found or "N/A"]
  **Current Sprint:** [Sprint name or "Not in current sprint ⚠️"]
  **Work Item State:** [State - flag if not "In Development" or "Active"]
  **Acceptance Criteria:** [List from work item]
  **Acceptance Criteria Met:** [Yes/No/Partial with details]
  
  ---
  
  ## Executive Summary
  
  **Overall Assessment:** [Approve/Request Changes/Needs Discussion]
  
  **Key Metrics:**
  - Files Changed: [number]
  - Lines Added/Removed: [+X/-Y]
  - Complexity Impact: [Low/Medium/High]
  - Risk Level: [Low/Medium/High]
  - Test Coverage: [Adequate/Needs Tests/Missing]
  - External Dependencies: [List new/modified]
  - API Contract Changes: [Breaking/Non-breaking/None]
  
  **Main Achievements:**
  • [Top 3-5 accomplishments]
  
  **Critical Issues:**
  • [Top 3-5 blocking issues or "None identified"]
  
  **Quick Wins:**
  • [2-3 easy improvements or "None identified"]
  
  ---
  
  ## Library/Framework Analysis
  
  [Include Context7 findings]
  
  **Dependencies Reviewed:**
  - [Library Name]: [Version]
    - Best practices: [Assessment from Context7]
    - Security: [Concerns or "None identified"]
    - Performance: [Implications]
    - Recommendations: [Any changes needed]
  
  ---
  
  ## Detailed File Analysis
  
  ### 📁 [filename]
  
  **Changes Summary:** [Brief description]
  
  **✅ Strengths:**
  - [Specific positive aspects]
  
  **⚠️ Issues Found:**
  - **[Severity]**: [Detailed issue]
    - Location: `[file:line]`
    - Impact: [Explanation]
    - Recommendation: [How to fix with code example if applicable]
  
  **💡 Suggestions:**
  - [Improvements]
  
  [Repeat for each significant file]
  
  ---
  
  ## API Contract Review
  
  **New Endpoints:** [List new API endpoints or "None"]
  **Modified Endpoints:** [List modified endpoints or "None"]
  **Deprecated Endpoints:** [List deprecated endpoints or "None"]
  
  **OpenAPI/Swagger Changes:**
  - [Assessment of API documentation updates]
  
  **Breaking Changes:**
  - [List breaking changes or "None identified"]
  
  **Versioning:**
  - [API version affected and strategy]
  
  ---
  
  ## Recommended Improvements
  
  ### Priority 1 - Must Fix (Blocking) ⛔
  1. **[Issue]:** [Description with code example]
     - File: `[file:line]`
     - Why: [Impact explanation]
     - Fix: [Specific solution]
  
  ### Priority 2 - Should Fix (Important) ⚠️
  1. **[Issue]:** [Description]
     - File: `[file:line]`
     - Benefit: [Expected improvement]
  
  ### Priority 3 - Consider (Nice to Have) 💡
  1. **[Suggestion]:** [Enhancement idea]
     - Rationale: [Why this would help]
  
  ### Testing Recommendations
  [Specific test cases needed or "Test coverage appears adequate"]
  
  ### Documentation Needs
  [What should be documented or "Documentation appears adequate"]
  
  ---
  
  ## Sequential Analysis Summary
  
  [Key insights from sequential thinking]
  - Decision points identified: [Major architectural decisions]
  - Logic flow assessment: [Code flow analysis]
  - Edge cases discovered: [Through systematic analysis]
  - Complexity evaluation: [Cyclomatic complexity concerns]
  
  ---
  
  ## Conclusion
  
  [Final recommendation with summary of findings]
  
  **Risk Assessment:**
  | Risk | Likelihood | Impact | Mitigation |
  |------|-----------|--------|------------|
  | [Risk description] | [H/M/L] | [H/M/L] | [How to mitigate] |
  
  **Next Steps:**
  - [ ] [Immediate actions needed]
  - [ ] [Short-term improvements]
  - [ ] [Long-term considerations]
  
  ---
  
  *This review was generated by OpenCode AI using Claude Sonnet 4.5, with assistance from GitHub MCP, Azure DevOps MCP, Context7, and Sequential Thinking analysis. Manual verification and human judgment should be applied before acting on any recommendations.*
  ```
  
  Save the report to: ./devops/onyx-intake-api/pr-reviews/$ARGUMENTS-review.md
  
  ## Step 7: Provide Summary
  
  After saving the report, provide the user with:
  - Location of saved review file
  - Overall assessment (Approve/Request Changes)
  - Count of Priority 1, 2, 3 issues found
  - Brief summary of most critical findings
  - Link to Azure DevOps work item(s)
  
  ## Error Handling
  
  - If PR not found: Display error with PR number and ask for valid number
  - If no Azure DevOps work items found: Note this in report but continue review
  - If Context7 library not found: Note in report and continue with general best practices
  - If directory creation fails: Display error about permissions
  
  ## Important Notes
  
  - This is a READ-ONLY analysis - no changes will be pushed to GitHub
  - Be constructive and professional in all feedback
  - Acknowledge good practices and improvements
  - Provide specific examples and code snippets where helpful
  - Consider the PR's context and stated goals
  - Balance thoroughness with clarity
  - Focus on meaningful issues over nitpicks
  - local source code repo is located within the './onyx-intake-api' directory
