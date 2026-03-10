import { tool, type Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = async ({ $ }) => {
  const FAILURE_INSTRUCTION =
    "TOOL FAILURE: This tool call did not fully succeed. When responding to the user, you MUST mention the failures noted above and include the relevant error details. Continue performing any other tasks you were asked to do."

  return {
    tool: {
      gh_pr_context: tool({
        description:
          "Load complete PR context including diff, comments, review status, inline review comments, and CI checks for code review assistance",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or 'owner/repo#123' or full GitHub URL)"),
        },
        async execute(args) {
          // Parse PR identifier to extract owner/repo/number for API calls
          const parsePRIdentifier = (pr: string): { owner?: string; repo?: string; number: string } | null => {
            // Full URL: https://github.com/owner/repo/pull/123
            const urlMatch = pr.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
            if (urlMatch) {
              return { owner: urlMatch[1], repo: urlMatch[2], number: urlMatch[3] }
            }

            // owner/repo#123 format
            const refMatch = pr.match(/^([^\/]+)\/([^#]+)#(\d+)$/)
            if (refMatch) {
              return { owner: refMatch[1], repo: refMatch[2], number: refMatch[3] }
            }

            // Just a number
            if (/^\d+$/.test(pr)) {
              return { number: pr }
            }

            return null
          }

          const prIdentifier = parsePRIdentifier(args.pr)
          let owner = prIdentifier?.owner
          let repo = prIdentifier?.repo
          const prNumber = prIdentifier?.number

          // If we don't have owner/repo, get from current repo context
          if ((!owner || !repo) && prNumber) {
            const repoResult = await $`gh repo view --json owner,name`.nothrow().quiet()
            if (repoResult.exitCode === 0) {
              const repoInfo = repoResult.json()
              owner = repoInfo.owner.login
              repo = repoInfo.name
            }
          }

          // Build parallel calls array
          const calls: Promise<any>[] = [
            $`gh pr diff ${args.pr}`.nothrow().quiet(),
            $`gh pr view ${args.pr} --json title,body,author,state,baseRefName,headRefName,comments,reviewDecision,additions,deletions,changedFiles`.nothrow().quiet(),
            $`gh pr checks ${args.pr}`.nothrow().quiet(),
            $`gh pr view ${args.pr} --json reviews`.nothrow().quiet(),
          ]

          // Add inline review comments API call if we have required info
          const hasApiInfo = owner && repo && prNumber
          if (hasApiInfo) {
            calls.push($`gh api repos/${owner}/${repo}/pulls/${prNumber}/comments --paginate`.nothrow().quiet())
          }

          const results = await Promise.all(calls)

          const [diffResult, viewResult, checksResult, reviewsResult] = results
          const reviewCommentsResult = hasApiInfo ? results[4] : null

          const diff = diffResult.text()
          const prInfo = viewResult.exitCode === 0 ? viewResult.json() : { error: viewResult.text() }
          const checks = checksResult.text()
          const reviews = reviewsResult.exitCode === 0 ? reviewsResult.json() : { error: reviewsResult.text() }

          const failures: string[] = []
          if (diffResult.exitCode !== 0) failures.push("diff")
          if (viewResult.exitCode !== 0) failures.push("pr view")
          if (checksResult.exitCode !== 0) failures.push("checks")
          if (reviewsResult.exitCode !== 0) failures.push("reviews")
          if (reviewCommentsResult && reviewCommentsResult.exitCode !== 0) failures.push("review comments")

          const comments = prInfo.comments || []

          // Parse inline review comments (comments attached to specific lines in the diff)
          let reviewComments: any[] = []
          if (reviewCommentsResult?.exitCode === 0) {
            try {
              const rawComments = JSON.parse(reviewCommentsResult.text())
              reviewComments = (Array.isArray(rawComments) ? rawComments : []).map((c: any) => ({
                id: String(c.id),
                path: c.path,
                line: c.line,
                originalLine: c.original_line,
                diffHunk: c.diff_hunk,
                body: c.body,
                author: c.user?.login,
                createdAt: c.created_at,
                inReplyToId: c.in_reply_to_id ? String(c.in_reply_to_id) : undefined,
                htmlUrl: c.html_url,
              }))
            } catch {
              // JSON parse error, leave empty
            }
          }

          return JSON.stringify(
            {
              ...(failures.length > 0 && {
                _failedSources: failures,
                _failureInstruction: FAILURE_INSTRUCTION,
              }),
              pr: {
                title: prInfo.title,
                author: prInfo.author?.login,
                state: prInfo.state,
                baseRefName: prInfo.baseRefName,
                headRefName: prInfo.headRefName,
                reviewDecision: prInfo.reviewDecision,
                additions: prInfo.additions,
                deletions: prInfo.deletions,
                changedFiles: prInfo.changedFiles,
                body: prInfo.body,
              },
              diff,
              comments,
              checks,
              reviews: reviews.reviews || [],
              reviewComments,
            },
            null,
            2
          )
        },
      }),
    },
  }
}

export default plugin
