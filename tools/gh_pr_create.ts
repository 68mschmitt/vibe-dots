import { tool } from "@opencode-ai/plugin"

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

export const gh_pr_create = tool({
  description: "Create a PR with title, body, and optional reviewers/labels",
  args: {
    title: tool.schema.string().describe("PR title. MUST follow Conventional Commits format: '<type>: <description>'. Valid types: feat (new feature), fix (bug fix), docs (documentation), style (formatting, no logic changes), refactor (code change, no bug fix or feature), perf (performance improvement), test (adding/correcting tests), build (build system/dependency changes), ci (CI config changes), chore (other non-src/test changes), revert (reverts a previous commit). Example: 'feat: add user authentication flow'. Ref: https://swe.docsinternal.aderant.com/engineering/devProcess/#commits"),
    body: tool.schema.string().describe("PR description (markdown)"),
    reviewers: tool.schema.array(tool.schema.string()).optional().describe("Reviewer usernames"),
    labels: tool.schema.array(tool.schema.string()).optional().describe("Labels to add"),
    draft: tool.schema.boolean().default(false).describe("Create as draft"),
    base: tool.schema.string().optional().describe("Base branch (defaults to repo default)"),
  },
  async execute(args) {
    const $ = Bun.$

    const flags: string[] = [
      "--title", args.title,
      "--body", args.body,
    ]

    if (args.reviewers?.length) {
      flags.push("--reviewer", args.reviewers.join(","))
    }
    if (args.labels?.length) {
      flags.push("--label", args.labels.join(","))
    }
    if (args.draft) {
      flags.push("--draft")
    }
    if (args.base) {
      flags.push("--base", args.base)
    }

    const result = await $`gh pr create ${flags}`.nothrow().quiet()

    if (result.exitCode !== 0) {
      return toolError({ error: result.stderr.toString() || result.text() })
    }

    const prUrl = result.text().trim()
    const prNumber = prUrl.split("/").pop()

    const viewResult = await $`gh pr view ${prNumber} --json number,url,title,headRefName,baseRefName,isDraft,state`.nothrow().quiet()
    const prInfo = viewResult.exitCode === 0 ? viewResult.json() : {}

    return JSON.stringify({
      url: prUrl,
      ...prInfo,
    }, null, 2)
  },
})
