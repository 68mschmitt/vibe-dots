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
      git_status: tool({
        description:
          "Get comprehensive git status: staged/unstaged changes, current branch, ahead/behind counts, and recent commit style for context. Use this before committing to understand the current state.",
        args: {
          recent_commits: tool.schema
            .number()
            .default(15)
            .describe("Number of recent commits to show for style detection"),
          include_diff_stat: tool.schema
            .boolean()
            .default(true)
            .describe("Include --stat output for changed files"),
        },
        async execute(args) {
          const [status, staged, stagedDiff, lastLog, diffStat] = await Promise.all([
            $`git status --porcelain=v2 --branch`.nothrow().quiet(),
            $`git diff --cached --stat`.nothrow().quiet(),
            $`git diff --cached`.nothrow().quiet(),
            $`git log -${args.recent_commits} --pretty=format:%s`.nothrow().quiet(),
            args.include_diff_stat
              ? $`git diff --stat`.nothrow().quiet()
              : Promise.resolve({ text: () => "", exitCode: 0 }),
          ])

          if (status.exitCode !== 0) {
            return toolError({
              error: "Failed to get git status",
              details: status.text(),
              hint: "Ensure you are in a git repository",
            })
          }

          const parseStatus = (output: string) => {
            const lines = output.split("\n")
            const branch =
              lines
                .find((l) => l.startsWith("# branch.head"))
                ?.split(" ")[2] || "unknown"
            const upstream = lines
              .find((l) => l.startsWith("# branch.upstream"))
              ?.split(" ")[2]
            const abLine = lines.find((l) => l.startsWith("# branch.ab"))
            const ahead = parseInt(abLine?.match(/\+(\d+)/)?.[1] || "0")
            const behind = parseInt(abLine?.match(/-(\d+)/)?.[1] || "0")

            const stagedFiles: string[] = []
            const unstagedFiles: string[] = []
            const untrackedFiles: string[] = []

            for (const line of lines) {
              if (line.startsWith("1 ") || line.startsWith("2 ")) {
                const parts = line.split(" ")
                const xy = parts[1]
                const file = parts[parts.length - 1]
                if (xy[0] !== ".") stagedFiles.push(file)
                if (xy[1] !== ".") unstagedFiles.push(file)
              } else if (line.startsWith("? ")) {
                untrackedFiles.push(line.slice(2))
              }
            }
            return { branch, upstream, ahead, behind, stagedFiles, unstagedFiles, untrackedFiles }
          }

          const statusInfo = parseStatus(status.text())

          return JSON.stringify(
            {
              branch: statusInfo.branch,
              upstream: statusInfo.upstream,
              ahead: statusInfo.ahead,
              behind: statusInfo.behind,
              stagedFiles: statusInfo.stagedFiles,
              unstagedFiles: statusInfo.unstagedFiles,
              untrackedFiles: statusInfo.untrackedFiles,
              stagedDiffStat: staged.text(),
              stagedDiff: stagedDiff.text(),
              unstagedDiffStat: diffStat?.text?.() || "",
              recentCommitMessages: lastLog
                .text()
                .split("\n")
                .filter(Boolean),
              isClean:
                statusInfo.stagedFiles.length === 0 &&
                statusInfo.unstagedFiles.length === 0 &&
                statusInfo.untrackedFiles.length === 0,
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
