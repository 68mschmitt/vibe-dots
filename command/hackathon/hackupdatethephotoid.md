---
description: Update AI-optimized project context by re-scanning and refreshing domain documentation
---

Update the project's AI-optimized contextual documentation by re-scanning relevant files, code, and metadata, then regenerating or refreshing domain-specific summaries. This ensures the context remains accurate and aligned with the current state of the project.

**Prerequisites:**
- Ensure `.context/docs/` directory exists with existing documentation
- If no documentation exists, recommend running `/hackphotoid` first

**Process Overview:**

1. **Verify existing documentation** - Check for presence of domain documentation files in `.context/docs/`

2. **Analyze what has changed** by examining:
   - Git status and recent commits (if in a git repo)
   - File modification timestamps vs. documentation timestamps
   - New files or directories that weren't documented
   - Removed files or features that need cleanup
   - Changed dependencies in package.json or similar

3. **Dispatch six subagents in parallel** to update each domain perspective intelligently (five for project analysis + one for Context7 library documentation):

## 1. Update Product Perspective (`.context/docs/product.md`)

**Analysis Focus:**
- Review current product documentation
- Scan for new features, user flows, or business logic changes
- Identify deprecated or removed features
- Look for new TODOs, feature flags, or roadmap hints
- Check for UX/UI changes in component files

**Update Strategy:**
- Preserve existing structure and content that's still accurate
- Add new features or capabilities discovered
- Update changed features with current implementation
- Mark or remove deprecated functionality
- Refresh product requirements based on recent code changes

## 2. Update Documentation Perspective (`.context/docs/documentation.md`)

**Analysis Focus:**
- Re-read README, CONTRIBUTING, and other doc files
- Check for new configuration options or environment variables
- Look for updated API documentation or usage examples
- Scan for new troubleshooting notes or FAQ entries
- Review changelog or release notes if present

**Update Strategy:**
- Merge new documentation sections
- Update changed instructions or setup steps
- Preserve historical context where relevant
- Flag outdated information for review
- Add references to new external documentation

## 3. Update Architecture Perspective (`.context/docs/architecture.md`)

**Analysis Focus:**
- Identify new external dependencies or services
- Look for architectural changes (new patterns, refactoring)
- Check for infrastructure changes (deployment, hosting)
- Review security updates (new auth flows, data protection)
- Scan for new integration points or APIs

**Update Strategy:**
- Update technology stack with new dependencies
- Revise component structure if reorganized
- Add new integration points or external services
- Update data flow if significantly changed
- Refresh security architecture with new patterns

## 4. Update Code Perspective (`.context/docs/code.md`)

**Analysis Focus:**
- Scan for new directories, modules, or packages
- Identify refactored or relocated code
- Look for new data models, schemas, or types
- Check for new API endpoints or routes
- Review test coverage changes
- Update technical debt notes (resolved or new)

**Update Strategy:**
- Add new files and modules to key files list
- Update project structure if reorganized
- Refresh data models with new schemas
- Add new API endpoints or significant functions
- Update code conventions if they've evolved
- Mark resolved technical debt, add new issues

## 5. Update Operations Perspective (`.context/docs/operations.md`)

**Analysis Focus:**
- Check for new build scripts or commands
- Review updated dependencies and package changes
- Look for new deployment configurations
- Scan for infrastructure-as-code changes
- Identify new monitoring, logging, or debugging tools
- Check for new environment variables or secrets

**Update Strategy:**
- Update build system commands if changed
- Refresh dependency information
- Add new deployment procedures or automation
- Update environment management details
- Add new operational scripts or utilities
- Refresh secrets management approach

## 6. Update Library Documentation (`.context/docs/libraries/`)

**Analysis Focus:**
- Compare current dependencies against documented libraries
- Identify new dependencies added since last documentation
- Check for removed or deprecated dependencies
- Look for version upgrades that may have breaking changes
- Scan for new library usage patterns in the codebase
- Identify gaps in library documentation coverage

**Update Strategy Using Context7:**
1. **Audit Existing Library Docs**: Review `.context/docs/libraries/index.md` and subdirectories
2. **Detect New Dependencies**: Compare current package manifests against documented libraries
3. **Add New Libraries**: For each new dependency:
   - Use `resolve-library-id` to find the Context7 library ID
   - Use `get-library-docs` to fetch relevant documentation
   - Create new subdirectory in `.context/docs/libraries/[library-name]/`
   - Focus on topics that match observed usage patterns
4. **Update Existing Libraries**: For libraries with version changes:
   - Fetch updated documentation if major version changed
   - Add notes about breaking changes or new features
   - Update API references if significantly changed
5. **Clean Up**: Remove documentation for deprecated/removed dependencies
6. **Refresh Index**: Update `.context/docs/libraries/index.md` with:
   - New libraries added
   - Updated version information
   - Changed usage patterns
   - Removed dependencies marked as deprecated

**Context7 Update Guidelines:**
- Prioritize libraries with significant codebase changes
- Fetch multiple topic pages for heavily-used libraries
- Document new patterns or best practices discovered in code
- Note version-specific behaviors that affect the project
- Include migration guides if major version upgrades occurred
- Cross-reference library documentation with code perspective updates

---

## Update Guidelines for Each Subagent:

**Smart Diffing:**
1. Read the existing domain documentation file first
2. Understand the current documented state
3. Scan the codebase for changes in your domain
4. Identify what's new, what's changed, and what's obsolete
5. Preserve accurate existing content to maintain consistency
6. Only update sections that have actually changed

**Incremental Updates:**
- Use clear change indicators (e.g., "[Updated: YYYY-MM-DD]" or "[New: Feature X]")
- Add new sections without removing old ones unless deprecated
- Maintain the same structure and formatting conventions
- Keep file/path references up to date (e.g., `src/auth/login.ts:42`)

**Quality Checks:**
- Verify all file paths still exist and are accurate
- Ensure new features are adequately documented
- Remove references to deleted files or deprecated code
- Cross-reference with other domain docs to ensure consistency
- Note any areas of uncertainty or requiring human review

**Output Format:**
- Save updated documentation to the same file path
- Maintain the AI-optimized structure (scannable, clear sections)
- Use bullet points, bold headers, and organized sections
- Include timestamps for significant updates
- Add a "Last Updated" metadata section at the top if not present

---

## After All Updates Complete:

1. **Generate Update Summary** covering:
   - Which domains had significant changes
   - What types of changes were made (additions, updates, deletions)
   - Any inconsistencies or areas requiring human review
   - Overall project evolution since last documentation

2. **Validation Checks:**
   - Ensure all five domain files were successfully updated
   - Verify file paths and references are still valid
   - Check for cross-domain consistency
   - Flag any missing or incomplete information

3. **Report to User:**
   - Summary of changes by domain
   - Location of updated documentation files
   - Recommendations for additional documentation if needed
   - Any manual review items identified

---

**Key Principles:**
- **Preserve Accuracy**: Don't discard correct existing documentation
- **Incremental Updates**: Only change what needs changing
- **Change Tracking**: Make it clear what was updated and when
- **Consistency**: Maintain structure and style across domains
- **Reliability**: Ensure AI agents can trust the updated context
- **Efficiency**: Focus updates on changed areas, not full rewrites

Execute these update tasks in parallel for maximum efficiency, then provide a comprehensive summary of what was updated and why.
