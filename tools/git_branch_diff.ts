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
      git_branch_diff: tool({
        description:
          "Compare current branch to base branch. Get commits, diff stats, and optionally full diff for PR preparation or code review. Useful for understanding what will be in a PR.",
        args: {
          base: tool.schema
            .string()
            .default("main")
            .describe("Base branch to compare against (main, master, develop)"),
          full_diff: tool.schema
            .boolean()
            .default(false)
            .describe("Include full diff output (can be large)"),
          stat_only: tool.schema
            .boolean()
            .default(false)
            .describe("Only show file change statistics"),
        },
        async execute(args) {
          const range = `${args.base}..HEAD`

          const calls: Promise<any>[] = [
            $`git log ${range} --oneline`.nothrow().quiet(),
            $`git diff ${range} --stat`.nothrow().quiet(),
          ]

          if (args.full_diff && !args.stat_only) {
            calls.push($`git diff ${range}`.nothrow().quiet())
          }

          const results = await Promise.all(calls)
          const [logResult, statResult] = results

          if (logResult.exitCode !== 0 || statResult.exitCode !== 0) {
            return toolError({
              error: "Failed to compare branches",
              details: logResult.exitCode !== 0 ? logResult.text() : statResult.text(),
              hint: `Ensure base branch '${args.base}' exists and you are in a git repository`,
            })
          }

          const diffResult = args.full_diff && !args.stat_only ? results[2] : null

          const commits = logResult
            .text()
            .split("\n")
            .filter(Boolean)
            .map((line: string) => {
              const spaceIndex = line.indexOf(" ")
              const hash = line.slice(0, spaceIndex)
              const message = line.slice(spaceIndex + 1)
              return { hash, message }
            })

          const response: Record<string, any> = {
            base: args.base,
            commits,
            commitCount: commits.length,
            diffStat: statResult.text(),
          }

          if (args.full_diff && !args.stat_only && diffResult) {
            response.diff = diffResult.text()
          }

          return JSON.stringify(response, null, 2)
        },
      }),
    },
  }
}

export default plugin
