import { tool, type Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = async ({ $ }) => {
  const toolError = (errorObj: Record<string, any>): string =>
    JSON.stringify(
      {
        ...errorObj,
        _failureInstruction:
          "TOOL FAILURE: This tool call did not succeed. When responding to the user, you MUST mention that this tool call failed and include the relevant error details. Continue performing any other tasks you were asked to do.",
      },
      null,
      2
    )

  return {
    tool: {
      gh_pr_reply_comment: tool({
        description:
          "Reply to a PR review comment thread. Use this to respond to inline code review comments on a pull request.",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or 'owner/repo#123' or full GitHub URL)"),
          comment_id: tool.schema
            .string()
            .describe("The numeric databaseId of the review comment to reply to (from gh_pr_context reviewComments or gh_pr_get_threads). This must be the databaseId, NOT the GraphQL node ID."),
          body: tool.schema.string().describe("The reply message body (markdown supported)"),
        },
        async execute(args) {
          const parsePRIdentifier = (
            pr: string
          ): { owner?: string; repo?: string; number: string } | null => {
            const urlMatch = pr.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
            if (urlMatch) {
              return { owner: urlMatch[1], repo: urlMatch[2], number: urlMatch[3] }
            }
            const refMatch = pr.match(/^([^\/]+)\/([^#]+)#(\d+)$/)
            if (refMatch) {
              return { owner: refMatch[1], repo: refMatch[2], number: refMatch[3] }
            }
            if (/^\d+$/.test(pr)) {
              return { number: pr }
            }
            return null
          }

          const prIdentifier = parsePRIdentifier(args.pr)
          let owner = prIdentifier?.owner
          let repo = prIdentifier?.repo
          const prNumber = prIdentifier?.number

          if (!owner || !repo) {
            const repoResult = await $`gh repo view --json owner,name`.nothrow().quiet()
            if (repoResult.exitCode === 0) {
              const repoInfo = repoResult.json()
              owner = repoInfo.owner.login
              repo = repoInfo.name
            }
          }

          if (!owner || !repo || !prNumber) {
            return toolError({ error: "Could not determine repository owner/name or PR number" })
          }

          const result = await $`gh api repos/${owner}/${repo}/pulls/${prNumber}/comments/${args.comment_id}/replies -f body=${args.body}`
            .nothrow()
            .quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: result.stderr.toString() || result.text(),
            })
          }

          try {
            const reply = JSON.parse(result.text())
            return JSON.stringify(
              {
                success: true,
                id: reply.id,
                body: reply.body,
                author: reply.user?.login,
                htmlUrl: reply.html_url,
                createdAt: reply.created_at,
              },
              null,
              2
            )
          } catch {
            return JSON.stringify({ success: true, raw: result.text() })
          }
        },
      }),

      gh_pr_resolve_thread: tool({
        description:
          "Resolve or unresolve a PR review thread. Use this to mark a conversation as resolved after addressing feedback, or unresolve it if more discussion is needed.",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or 'owner/repo#123' or full GitHub URL)"),
          thread_id: tool.schema
            .string()
            .describe(
              "The GraphQL node ID of the review thread (starts with 'PRRT_' - get this from gh_pr_context reviewComments by finding the thread)"
            ),
          resolve: tool.schema
            .boolean()
            .default(true)
            .describe("True to resolve the thread, false to unresolve it"),
        },
        async execute(args) {
          const mutation = args.resolve ? "resolveReviewThread" : "unresolveReviewThread"
          const query = `
            mutation {
              ${mutation}(input: { threadId: "${args.thread_id}" }) {
                thread {
                  id
                  isResolved
                  viewerCanResolve
                  viewerCanUnresolve
                }
              }
            }
          `

          const result = await $`gh api graphql -f query=${query}`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: result.stderr.toString() || result.text(),
            })
          }

          try {
            const response = JSON.parse(result.text())
            if (response.errors) {
              return toolError({ error: response.errors })
            }
            const thread = response.data?.[mutation]?.thread
            return JSON.stringify(
              {
                success: true,
                threadId: thread?.id,
                isResolved: thread?.isResolved,
                action: args.resolve ? "resolved" : "unresolved",
              },
              null,
              2
            )
          } catch {
            return JSON.stringify({ success: true, raw: result.text() })
          }
        },
      }),

      gh_pr_get_threads: tool({
        description:
          "Get all review threads from a PR with their thread IDs, resolution status, and comments. Use this to find thread IDs for resolving/unresolving.",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or 'owner/repo#123' or full GitHub URL)"),
        },
        async execute(args) {
          const parsePRIdentifier = (
            pr: string
          ): { owner?: string; repo?: string; number: string } | null => {
            const urlMatch = pr.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
            if (urlMatch) {
              return { owner: urlMatch[1], repo: urlMatch[2], number: urlMatch[3] }
            }
            const refMatch = pr.match(/^([^\/]+)\/([^#]+)#(\d+)$/)
            if (refMatch) {
              return { owner: refMatch[1], repo: refMatch[2], number: refMatch[3] }
            }
            if (/^\d+$/.test(pr)) {
              return { number: pr }
            }
            return null
          }

          const prIdentifier = parsePRIdentifier(args.pr)
          let owner = prIdentifier?.owner
          let repo = prIdentifier?.repo
          const prNumber = prIdentifier?.number

          if (!owner || !repo) {
            const repoResult = await $`gh repo view --json owner,name`.nothrow().quiet()
            if (repoResult.exitCode === 0) {
              const repoInfo = repoResult.json()
              owner = repoInfo.owner.login
              repo = repoInfo.name
            }
          }

          if (!owner || !repo || !prNumber) {
            return toolError({ error: "Could not determine repository or PR number" })
          }

          const query = `
            query {
              repository(owner: "${owner}", name: "${repo}") {
                pullRequest(number: ${prNumber}) {
                  reviewThreads(first: 100) {
                    nodes {
                      id
                      isResolved
                      isOutdated
                      path
                      line
                      startLine
                      diffSide
                      viewerCanResolve
                      viewerCanUnresolve
                      comments(first: 50) {
                        nodes {
                          id
                          databaseId
                          body
                          author {
                            login
                          }
                          createdAt
                          path
                          position
                          diffHunk
                        }
                      }
                    }
                  }
                }
              }
            }
          `

          const result = await $`gh api graphql -f query=${query}`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: result.stderr.toString() || result.text(),
            })
          }

          try {
            const response = JSON.parse(result.text())
            if (response.errors) {
              return toolError({ error: response.errors })
            }

            const threads = response.data?.repository?.pullRequest?.reviewThreads?.nodes || []
            const formattedThreads = threads.map((thread: any) => ({
              threadId: thread.id,
              isResolved: thread.isResolved,
              isOutdated: thread.isOutdated,
              path: thread.path,
              line: thread.line,
              startLine: thread.startLine,
              diffSide: thread.diffSide,
              canResolve: thread.viewerCanResolve,
              canUnresolve: thread.viewerCanUnresolve,
              comments: thread.comments?.nodes?.map((c: any) => ({
                id: c.id,
                databaseId: c.databaseId,
                body: c.body,
                author: c.author?.login,
                createdAt: c.createdAt,
              })),
            }))

            return JSON.stringify(
              {
                pr: `${owner}/${repo}#${prNumber}`,
                totalThreads: formattedThreads.length,
                resolvedCount: formattedThreads.filter((t: any) => t.isResolved).length,
                unresolvedCount: formattedThreads.filter((t: any) => !t.isResolved).length,
                threads: formattedThreads,
              },
              null,
              2
            )
          } catch {
            return toolError({ error: "Failed to parse response", raw: result.text() })
          }
        },
      }),
    },
  }
}

export default plugin
