# Custom Tool Conventions

## Structure

Every tool is an `@opencode-ai/plugin` that exports a default `Plugin`. The plugin receives `$` (shell executor) and returns a `{ tool: { ... } }` map.

```ts
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
      my_tool_name: tool({
        description: "What the tool does — one sentence, specific.",
        args: {
          name: tool.schema.string().describe("What this arg is and where to get it"),
          count: tool.schema.number().default(10).describe("Meaningful default with explanation"),
          tags: tool.schema.array(tool.schema.string()).optional().describe("Optional list of X"),
        },
        async execute(args) {
          // implementation
        },
      }),
    },
  }
}

export default plugin
```

## Error Handling

**Every tool MUST define `toolError()` immediately after the plugin function opens.** This ensures the calling AI agent reports failures to the user instead of silently swallowing them.

### Full Failure — tool cannot complete its purpose

Return early with `toolError()`. Include `error` (what failed), `details` (stderr/output), and optionally `hint` (how to fix).

```ts
const result = await $`some command ${flags}`.nothrow().quiet()

if (result.exitCode !== 0) {
  return toolError({
    error: "Failed to do X",
    details: result.stderr.toString() || result.text(),
    hint: "Ensure Y is configured",
  })
}
```

### Partial Failure — batch operation where some items fail

Don't return early. Collect results, then conditionally inject `_failureInstruction` into the response:

```ts
const response: Record<string, any> = {
  summary: { total: items.length, success: successCount, failed: failCount },
  results,
}

if (failCount > 0) {
  response._failureInstruction =
    "PARTIAL FAILURE: Some operations failed. When responding to the user, you MUST mention which items failed and include the relevant error details. Continue performing any other tasks you were asked to do."
}

return JSON.stringify(response, null, 2)
```

### Degraded Data — multi-source tool where some sources fail

Track which sources failed, inject into the response only when failures occur:

```ts
const FAILURE_INSTRUCTION =
  "TOOL FAILURE: This tool call did not fully succeed. When responding to the user, you MUST mention the failures noted above and include the relevant error details. Continue performing any other tasks you were asked to do."

// after collecting results:
const failures: string[] = []
if (fooResult.exitCode !== 0) failures.push("foo")
if (barResult.exitCode !== 0) failures.push("bar")

return JSON.stringify({
  ...(failures.length > 0 && {
    _failedSources: failures,
    _failureInstruction: FAILURE_INSTRUCTION,
  }),
  // ... normal response fields
}, null, 2)
```

## Shell Commands

- Always `.nothrow().quiet()` — never let commands throw or print to stdout.
- Always check `exitCode !== 0` before using the result.
- Use template literals: `` $`command ${variable}` `` — the plugin shell handles escaping.
- For flags arrays: `` $`command ${flags}` `` spreads correctly.

## Arg Descriptions

Arg descriptions are the AI's only guide for what to pass. Be specific:

- Bad: `"The ID"` — which ID? From where?
- Good: `"The numeric databaseId of the review comment (from gh_pr_get_threads). Must be the databaseId, NOT the GraphQL node ID."`

Include: what format, where to get it, what NOT to pass if ambiguous.

## Response Format

- Success: `JSON.stringify({ ...data }, null, 2)`
- Failure: `toolError({ error: "...", details: "...", hint: "..." })`
- Always return serialized JSON strings (never raw objects).

## File Naming

One file per logical group of related tools. Name matches the tool prefix:
- `gh_pr_comment.ts` → `gh_pr_reply_comment`, `gh_pr_resolve_thread`, `gh_pr_get_threads`
- `git_commit_flow.ts` → `git_commit_flow`, `git_reset_undo`
