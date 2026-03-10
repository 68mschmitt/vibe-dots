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
      gh_pr_list: tool({
        description:
          "List open pull requests for the current repository. Returns PR number, title, author, branch, labels, and review status.",
        args: {
          limit: tool.schema
            .number()
            .default(30)
            .describe("Maximum number of PRs to return (default 30)"),
          author: tool.schema
            .string()
            .optional()
            .describe("Filter by author username (e.g., '@me' for your own PRs)"),
          base: tool.schema
            .string()
            .optional()
            .describe("Filter by base branch (e.g., 'main')"),
          label: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Filter by labels (e.g., ['bug', 'enhancement'])"),
          search: tool.schema
            .string()
            .optional()
            .describe("Search query to filter PRs by title or body text"),
        },
        async execute(args) {
          const flags: string[] = [
            "--state",
            "open",
            "--limit",
            String(args.limit),
            "--json",
            "number,title,author,headRefName,baseRefName,labels,reviewDecision,isDraft,createdAt,url,additions,deletions,changedFiles",
          ]

          if (args.author) {
            flags.push("--author", args.author)
          }
          if (args.base) {
            flags.push("--base", args.base)
          }
          if (args.label?.length) {
            for (const l of args.label) {
              flags.push("--label", l)
            }
          }
          if (args.search) {
            flags.push("--search", args.search)
          }

          const result = await $`gh pr list ${flags}`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: "Failed to list PRs",
              details: result.stderr.toString() || result.text(),
              hint: "Ensure you are in a git repository with a GitHub remote and gh is authenticated",
            })
          }

          const prs = result.json()

          return JSON.stringify(
            {
              total: prs.length,
              prs: prs.map((pr: any) => ({
                number: pr.number,
                title: pr.title,
                author: pr.author?.login,
                head: pr.headRefName,
                base: pr.baseRefName,
                labels: pr.labels?.map((l: any) => l.name),
                reviewDecision: pr.reviewDecision,
                isDraft: pr.isDraft,
                createdAt: pr.createdAt,
                url: pr.url,
                additions: pr.additions,
                deletions: pr.deletions,
                changedFiles: pr.changedFiles,
              })),
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
