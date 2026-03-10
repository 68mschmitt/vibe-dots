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
      gh_pr_comment_add: tool({
        description:
          "Add a comment to an existing PR. Use this for general PR discussion comments (not inline code review comments).",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or full GitHub URL)"),
          body: tool.schema
            .string()
            .describe("Comment body (markdown supported)"),
        },
        async execute(args) {
          const result = await $`gh pr comment ${args.pr} --body ${args.body}`
            .nothrow()
            .quiet()

          if (result.exitCode !== 0) {
            return toolError({
              success: false,
              error: result.stderr.toString() || result.text(),
            })
          }

          return JSON.stringify({
            success: true,
            message: "Comment added successfully",
          })
        },
      }),

      gh_pr_edit: tool({
        description:
          "Edit PR title, body, or add reviewers/labels. Use to update PR description after implementation changes.",
        args: {
          pr: tool.schema
            .string()
            .describe("PR number or URL (e.g., '123' or full GitHub URL)"),
          title: tool.schema.string().optional().describe("New PR title"),
          body: tool.schema
            .string()
            .optional()
            .describe("New PR body (markdown). Replaces the entire body."),
          add_reviewers: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Usernames to add as reviewers"),
          add_labels: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Labels to add"),
          remove_labels: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Labels to remove"),
        },
        async execute(args) {
          const flags: string[] = []

          if (args.title) {
            flags.push("--title", args.title)
          }
          if (args.body) {
            flags.push("--body", args.body)
          }
          if (args.add_reviewers?.length) {
            flags.push("--add-reviewer", args.add_reviewers.join(","))
          }
          if (args.add_labels?.length) {
            flags.push("--add-label", args.add_labels.join(","))
          }
          if (args.remove_labels?.length) {
            flags.push("--remove-label", args.remove_labels.join(","))
          }

          if (flags.length === 0) {
            return toolError({ error: "No changes specified" })
          }

          const result = await $`gh pr edit ${args.pr} ${flags}`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              success: false,
              error: result.stderr.toString() || result.text(),
            })
          }

          const viewResult = await $`gh pr view ${args.pr} --json number,url,title,body,labels,reviewRequests`
            .nothrow()
            .quiet()

          if (viewResult.exitCode === 0) {
            const prInfo = viewResult.json()
            return JSON.stringify(
              {
                success: true,
                pr: {
                  number: prInfo.number,
                  url: prInfo.url,
                  title: prInfo.title,
                  labels: prInfo.labels?.map((l: any) => l.name),
                  reviewers: prInfo.reviewRequests?.map((r: any) => r.login),
                },
              },
              null,
              2
            )
          }

          return JSON.stringify({ success: true })
        },
      }),
    },
  }
}

export default plugin
