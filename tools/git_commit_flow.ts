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
      git_commit_flow: tool({
        description:
          "Execute git commit workflow: stage, commit, optionally push. Supports branch creation, exclude patterns, and safety checks. Use for atomic commit operations.",
        args: {
          action: tool.schema
            .enum(["stage", "commit", "push", "commit_push", "branch_commit_push"])
            .describe("Workflow action to perform"),
          message: tool.schema
            .string()
            .optional()
            .describe("Commit message (required for commit actions)"),
          branch: tool.schema
            .string()
            .optional()
            .describe("New branch name (for branch_commit_push action)"),
          exclude: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Paths to exclude from staging (e.g., ['.sisyphus/', 'node_modules/'])"),
          push_force: tool.schema
            .boolean()
            .default(false)
            .describe("Use --force-with-lease for push (dangerous, use carefully)"),
          amend: tool.schema
            .boolean()
            .default(false)
            .describe("Amend previous commit instead of creating new"),
        },
        async execute(args) {
          const results: Record<string, any> = { action: args.action }

          if (args.action === "branch_commit_push" && args.branch) {
            const branchResult = await $`git checkout -b ${args.branch}`.nothrow().quiet()
            if (branchResult.exitCode !== 0) {
              return toolError({
                error: "Branch creation failed",
                details: branchResult.text(),
              })
            }
            results.branchCreated = args.branch
          }

          if (
            ["stage", "commit", "commit_push", "branch_commit_push"].includes(args.action)
          ) {
            await $`git add -A`.nothrow().quiet()

            if (args.exclude?.length) {
              for (const pattern of args.exclude) {
                await $`git reset HEAD -- ${pattern}`.nothrow().quiet()
              }
              results.excluded = args.exclude
            }
          }

          if (["commit", "commit_push", "branch_commit_push"].includes(args.action)) {
            if (!args.message && !args.amend) {
              return toolError({ error: "Commit message required" })
            }

            let commitResult
            if (args.amend) {
              if (args.message) {
                commitResult = await $`git commit --amend -m ${args.message}`.nothrow().quiet()
              } else {
                commitResult = await $`git commit --amend --no-edit`.nothrow().quiet()
              }
            } else {
              commitResult = await $`git commit -m ${args.message!}`.nothrow().quiet()
            }

            if (commitResult.exitCode !== 0) {
              return toolError({
                error: "Commit failed",
                details: commitResult.text(),
              })
            }
            results.committed = true
          }

          if (["push", "commit_push", "branch_commit_push"].includes(args.action)) {
            let lintCommand: string | null = null

            const detectPackageManager = async () => {
              const [bunLock, pnpmLock, yarnLock] = await Promise.all([
                $`test -f bun.lock || test -f bun.lockb`.nothrow().quiet(),
                $`test -f pnpm-lock.yaml`.nothrow().quiet(),
                $`test -f yarn.lock`.nothrow().quiet(),
              ])
              if (bunLock.exitCode === 0) return "bun"
              if (pnpmLock.exitCode === 0) return "pnpm"
              if (yarnLock.exitCode === 0) return "yarn"
              return "npm"
            }

            const pkgResult = await $`cat package.json`.nothrow().quiet()
            if (pkgResult.exitCode === 0) {
              try {
                const pkg = JSON.parse(pkgResult.text())
                const scripts = pkg.scripts || {}
                const scriptName = scripts["lint"]
                  ? "lint"
                  : scripts["lint:check"]
                    ? "lint:check"
                    : null
                if (scriptName) {
                  const pm = await detectPackageManager()
                  lintCommand = `${pm} run ${scriptName}`
                }
              } catch {
              }
            }

            if (!lintCommand) {
              const [eslintConfig, biomeConfig] = await Promise.all([
                $`test -f .eslintrc.js || test -f .eslintrc.json || test -f .eslintrc.yml || test -f eslint.config.js || test -f eslint.config.mjs || test -f eslint.config.ts`.nothrow().quiet(),
                $`test -f biome.json || test -f biome.jsonc`.nothrow().quiet(),
              ])
              if (eslintConfig.exitCode === 0) {
                lintCommand = "npx eslint ."
              } else if (biomeConfig.exitCode === 0) {
                lintCommand = "npx @biomejs/biome check ."
              }
            }

            if (lintCommand) {
              results.lintCommand = lintCommand
              const lintResult = await $`sh -c ${lintCommand}`.nothrow().quiet()
              if (lintResult.exitCode !== 0) {
                return toolError({
                  error: "Lint check failed — push blocked",
                  lintCommand,
                  lintOutput: lintResult.text(),
                  hint: "Fix the lint/formatting issues above, then retry the push.",
                })
              }
              results.lintPassed = true
            } else {
              results.lintSkipped = "No lint script or config detected"
            }

            let pushResult
            if (args.push_force) {
              pushResult = await $`git push --force-with-lease -u origin HEAD`.nothrow().quiet()
            } else {
              pushResult = await $`git push -u origin HEAD`.nothrow().quiet()
            }

            if (pushResult.exitCode !== 0) {
              return toolError({
                error: "Push failed",
                details: pushResult.text(),
              })
            }
            results.pushed = true
          }

          const [logResult, statusResult] = await Promise.all([
            $`git log -1 --oneline`.nothrow().quiet(),
            $`git status --porcelain`.nothrow().quiet(),
          ])

          results.lastCommit = logResult.text().trim()
          results.isClean = statusResult.text().trim() === ""

          return JSON.stringify(results, null, 2)
        },
      }),

      git_reset_undo: tool({
        description:
          "Undo commits or unstage files. Supports soft reset for re-committing with changes, and selective unstaging. Use to fix commit mistakes.",
        args: {
          action: tool.schema
            .enum(["soft_reset", "unstage", "soft_reset_unstage_recommit_push"])
            .describe("Reset action type"),
          commits: tool.schema
            .number()
            .default(1)
            .describe("Number of commits to reset (for soft_reset)"),
          paths: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe("Paths to unstage (for unstage action or to exclude after reset)"),
          recommit_message: tool.schema
            .string()
            .optional()
            .describe("If provided, recommit after reset with this message"),
          force_push: tool.schema
            .boolean()
            .default(false)
            .describe("Force push after operation (required for already-pushed commits)"),
        },
        async execute(args) {
          const results: Record<string, any> = { action: args.action }

          if (
            args.action === "soft_reset" ||
            args.action === "soft_reset_unstage_recommit_push"
          ) {
            const resetResult = await $`git reset --soft HEAD~${args.commits}`
              .nothrow()
              .quiet()
            if (resetResult.exitCode !== 0) {
              return toolError({
                error: "Reset failed",
                details: resetResult.text(),
              })
            }
            results.resetCommits = args.commits
          }

          if (
            args.action === "unstage" ||
            args.action === "soft_reset_unstage_recommit_push"
          ) {
            if (args.paths?.length) {
              for (const path of args.paths) {
                await $`git reset HEAD -- ${path}`.nothrow().quiet()
              }
              results.unstaged = args.paths
            }
          }

          if (args.recommit_message) {
            const commitResult = await $`git commit -m ${args.recommit_message}`
              .nothrow()
              .quiet()
            if (commitResult.exitCode !== 0) {
              return toolError({
                error: "Recommit failed",
                details: commitResult.text(),
              })
            }
            results.recommitted = true
          }

          if (args.force_push) {
            const pushResult = await $`git push --force-with-lease`.nothrow().quiet()
            results.pushed = pushResult.exitCode === 0
            if (!results.pushed) {
              results.pushError = pushResult.text()
              results._failureInstruction =
                "PARTIAL FAILURE: The force push operation failed. When responding to the user, you MUST mention this push failure and include the error details. Continue performing any other tasks you were asked to do."
            }
          }

          const statusResult = await $`git status --porcelain`.nothrow().quiet()
          results.remainingChanges = statusResult
            .text()
            .split("\n")
            .filter(Boolean).length

          const logResult = await $`git log -1 --oneline`.nothrow().quiet()
          results.currentHead = logResult.text().trim()

          return JSON.stringify(results, null, 2)
        },
      }),
    },
  }
}

export default plugin
