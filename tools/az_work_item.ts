import { tool, type Plugin } from "@opencode-ai/plugin"

/**
 * Converts markdown to HTML for Azure DevOps rich text fields.
 * Handles common markdown patterns: headers, bold, italic, code, lists, links, blockquotes.
 */
function markdownToHtml(markdown: string): string {
  if (!markdown) return markdown

  let html = markdown

  // Escape HTML special chars first (but preserve intentional HTML if any)
  // We'll be lenient here - only escape < and > that aren't part of tags
  html = html.replace(/<(?![a-zA-Z\/])/g, "&lt;").replace(/(?<![a-zA-Z"'])>/g, "&gt;")

  // Code blocks (``` ... ```) - must come before other processing
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`
  })

  // Inline code (` ... `)
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Headers (must come before bold processing due to ## conflict)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>")
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>")
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>")
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>")
  html = html.replace(/_(.+?)_/g, "<em>$1</em>")

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>")

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)$/gm, "<hr>")

  // Unordered lists - collect consecutive lines
  html = html.replace(/(?:^[-*+]\s+.+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^[-*+]\s+/, "")}</li>`)
      .join("")
    return `<ul>${items}</ul>`
  })

  // Ordered lists - collect consecutive lines
  html = html.replace(/(?:^\d+\.\s+.+$\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\.\s+/, "")}</li>`)
      .join("")
    return `<ol>${items}</ol>`
  })

  // Task lists (checkboxes)
  html = html.replace(/<li>\[ \]/g, "<li>☐ ")
  html = html.replace(/<li>\[x\]/gi, "<li>☑ ")

  // Paragraphs - wrap remaining text blocks (lines not already in tags)
  // Split by double newlines for paragraphs
  html = html
    .split(/\n\n+/)
    .map((block) => {
      block = block.trim()
      if (!block) return ""
      // Don't wrap if already a block element
      if (
        /^<(h[1-6]|p|ul|ol|li|pre|blockquote|hr|div|table)/i.test(block)
      ) {
        return block
      }
      // Wrap plain text in <p> tags, converting single newlines to <br>
      return `<p>${block.replace(/\n/g, "<br>")}</p>`
    })
    .join("\n")

  return html.trim()
}

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
      az_work_item_create: tool({
        description:
          "Create Azure DevOps work items (Task, Bug, User Story, Feature). Returns created item ID. Requires Azure DevOps CLI configured.",
        args: {
          type: tool.schema
            .enum(["Task", "Bug", "User Story", "Feature", "Epic"])
            .describe("Work item type"),
          title: tool.schema.string().describe("Work item title"),
          description: tool.schema
            .string()
            .optional()
            .describe("Work item description (Markdown supported - converted to HTML)"),
          acceptance_criteria: tool.schema
            .string()
            .optional()
            .describe("Acceptance criteria (Markdown supported - converted to HTML)"),
          repro_steps: tool.schema
            .string()
            .optional()
            .describe("Repro steps for bugs (Markdown supported - converted to HTML)"),
          iteration: tool.schema
            .string()
            .optional()
            .describe("Iteration path (e.g., 'Compliance Platform\\\\26Q1\\\\26Q1-3')"),
          area: tool.schema.string().optional().describe("Area path"),
          assigned_to: tool.schema
            .string()
            .optional()
            .describe("Assignee email or display name"),
          priority: tool.schema
            .number()
            .optional()
            .describe("Priority (1-4, where 1 is highest)"),
          tags: tool.schema.string().optional().describe("Comma-separated tags"),
        },
        async execute(args) {
          const flags: string[] = ["--type", args.type, "--title", args.title]
          const fields: string[] = []

          if (args.description) flags.push("--description", markdownToHtml(args.description))
          if (args.iteration) flags.push("--iteration", args.iteration)
          if (args.area) flags.push("--area", args.area)
          if (args.assigned_to) flags.push("--assigned-to", args.assigned_to)
          if (args.priority) fields.push(`Microsoft.VSTS.Common.Priority=${args.priority}`)
          if (args.tags) fields.push(`System.Tags=${args.tags}`)
          if (args.acceptance_criteria)
            fields.push(
              `Microsoft.VSTS.Common.AcceptanceCriteria=${markdownToHtml(args.acceptance_criteria)}`
            )
          if (args.repro_steps)
            fields.push(
              `Microsoft.VSTS.TCM.ReproSteps=${markdownToHtml(args.repro_steps)}`
            )

          if (fields.length > 0) {
            flags.push("--fields", fields.join(" "))
          }

          const result = await $`az boards work-item create ${flags} -o json`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: "Failed to create work item",
              details: result.stderr.toString() || result.text(),
            })
          }

          const item = result.json()
          return JSON.stringify(
            {
              id: item.id,
              url: item.url,
              title: item.fields?.["System.Title"],
              type: item.fields?.["System.WorkItemType"],
              state: item.fields?.["System.State"],
              iteration: item.fields?.["System.IterationPath"],
            },
            null,
            2
          )
        },
      }),

      az_work_item_update: tool({
        description:
          "Update Azure DevOps work item fields (description, iteration, state, assigned to, etc.)",
        args: {
          id: tool.schema.number().describe("Work item ID to update"),
          title: tool.schema.string().optional().describe("New title"),
          description: tool.schema
            .string()
            .optional()
            .describe("New description (Markdown supported - converted to HTML)"),
          acceptance_criteria: tool.schema
            .string()
            .optional()
            .describe("Acceptance criteria (Markdown supported - converted to HTML)"),
          repro_steps: tool.schema
            .string()
            .optional()
            .describe("Repro steps for bugs (Markdown supported - converted to HTML)"),
          iteration: tool.schema.string().optional().describe("Iteration path to assign"),
          area: tool.schema.string().optional().describe("Area path"),
          state: tool.schema
            .string()
            .optional()
            .describe("New state (e.g., 'Active', 'Closed')"),
          assigned_to: tool.schema.string().optional().describe("Assignee email/name"),
          priority: tool.schema.number().optional().describe("Priority (1-4)"),
          remaining_work: tool.schema.number().optional().describe("Remaining work hours"),
          original_estimate: tool.schema
            .number()
            .optional()
            .describe("Original estimate hours"),
          completed_work: tool.schema.number().optional().describe("Completed work hours"),
          tags: tool.schema
            .string()
            .optional()
            .describe("Comma-separated tags (replaces existing)"),
        },
        async execute(args) {
          const flags: string[] = ["--id", String(args.id)]
          const fields: string[] = []

          if (args.title) flags.push("--title", args.title)
          if (args.description) flags.push("--description", markdownToHtml(args.description))
          if (args.iteration) flags.push("--iteration", args.iteration)
          if (args.area) flags.push("--area", args.area)
          if (args.state) flags.push("--state", args.state)
          if (args.assigned_to) flags.push("--assigned-to", args.assigned_to)
          if (args.priority) fields.push(`Microsoft.VSTS.Common.Priority=${args.priority}`)
          if (args.remaining_work !== undefined)
            fields.push(`Microsoft.VSTS.Scheduling.RemainingWork=${args.remaining_work}`)
          if (args.original_estimate !== undefined)
            fields.push(`Microsoft.VSTS.Scheduling.OriginalEstimate=${args.original_estimate}`)
          if (args.completed_work !== undefined)
            fields.push(`Microsoft.VSTS.Scheduling.CompletedWork=${args.completed_work}`)
          if (args.tags) fields.push(`System.Tags=${args.tags}`)
          if (args.acceptance_criteria)
            fields.push(
              `Microsoft.VSTS.Common.AcceptanceCriteria=${markdownToHtml(args.acceptance_criteria)}`
            )
          if (args.repro_steps)
            fields.push(
              `Microsoft.VSTS.TCM.ReproSteps=${markdownToHtml(args.repro_steps)}`
            )

          if (fields.length > 0) {
            flags.push("--fields", fields.join(" "))
          }

          const result = await $`az boards work-item update ${flags} -o json`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: "Failed to update work item",
              details: result.stderr.toString() || result.text(),
            })
          }

          const item = result.json()
          return JSON.stringify(
            {
              id: item.id,
              url: item.url,
              title: item.fields?.["System.Title"],
              state: item.fields?.["System.State"],
              iteration: item.fields?.["System.IterationPath"],
              assignedTo: item.fields?.["System.AssignedTo"]?.displayName,
            },
            null,
            2
          )
        },
      }),

      az_work_item_link: tool({
        description:
          "Add parent/child or other relations between work items. Supports batch linking multiple items to one target.",
        args: {
          ids: tool.schema
            .array(tool.schema.number())
            .describe("Work item IDs to link (source items)"),
          target_id: tool.schema.number().describe("Target work item ID to link to"),
          relation_type: tool.schema
            .enum([
              "Parent",
              "Child",
              "Related",
              "Predecessor",
              "Successor",
              "Duplicate",
              "Duplicate Of",
            ])
            .describe("Type of relation to create"),
        },
        async execute(args) {
          const results: { id: number; success: boolean; error?: string }[] = []

          for (const id of args.ids) {
            const result =
              await $`az boards work-item relation add --id ${id} --relation-type ${args.relation_type} --target-id ${args.target_id} -o json`
                .nothrow()
                .quiet()

            if (result.exitCode !== 0) {
              results.push({
                id,
                success: false,
                error: result.stderr.toString() || result.text(),
              })
            } else {
              results.push({ id, success: true })
            }
          }

          const successCount = results.filter((r) => r.success).length
          const failCount = results.length - successCount

          const response: Record<string, any> = {
            summary: {
              total: args.ids.length,
              success: successCount,
              failed: failCount,
              relationCreated: `${args.relation_type} -> #${args.target_id}`,
            },
            results,
          }

          if (failCount > 0) {
            response._failureInstruction =
              "PARTIAL FAILURE: Some link operations failed. When responding to the user, you MUST mention which items failed and include the relevant error details. Continue performing any other tasks you were asked to do."
          }

          return JSON.stringify(response, null, 2)
        },
      }),

      az_work_item_batch_create: tool({
        description:
          "Create multiple work items at once with optional parent linking. Efficient for creating many tasks under one story.",
        args: {
          type: tool.schema
            .enum(["Task", "Bug", "User Story", "Feature"])
            .describe("Work item type for all items"),
          items: tool.schema
            .array(
              tool.schema.object({
                title: tool.schema.string().describe("Work item title"),
                description: tool.schema
                  .string()
                  .optional()
                  .describe("Description (Markdown supported - converted to HTML)"),
              })
            )
            .describe("Array of items to create (each with title and optional description)"),
          iteration: tool.schema.string().optional().describe("Iteration path for all items"),
          parent_id: tool.schema
            .number()
            .optional()
            .describe("Parent work item ID to link all created items to"),
          assigned_to: tool.schema.string().optional().describe("Assignee for all items"),
        },
        async execute(args) {
          const created: { id: number; title: string }[] = []
          const failed: { title: string; error: string }[] = []

          for (const item of args.items) {
            const flags: string[] = ["--type", args.type, "--title", item.title]
            if (item.description) flags.push("--description", markdownToHtml(item.description))
            if (args.iteration) flags.push("--iteration", args.iteration)
            if (args.assigned_to) flags.push("--assigned-to", args.assigned_to)

            const result = await $`az boards work-item create ${flags} -o json`
              .nothrow()
              .quiet()

            if (result.exitCode !== 0) {
              failed.push({
                title: item.title,
                error: result.stderr.toString() || result.text(),
              })
            } else {
              const itemData = result.json()
              created.push({ id: itemData.id, title: item.title })
            }
          }

          let linkResults: { linked: number; failed: number } | null = null
          if (args.parent_id && created.length > 0) {
            let linked = 0
            let linkFailed = 0
            for (const item of created) {
              const linkResult =
                await $`az boards work-item relation add --id ${item.id} --relation-type Parent --target-id ${args.parent_id} -o none`
                  .nothrow()
                  .quiet()
              if (linkResult.exitCode === 0) {
                linked++
              } else {
                linkFailed++
              }
            }
            linkResults = { linked, failed: linkFailed }
          }

          const response: Record<string, any> = {
            summary: {
              requested: args.items.length,
              created: created.length,
              failed: failed.length,
              parentLinked: linkResults,
            },
            createdItems: created,
            failedItems: failed.length > 0 ? failed : undefined,
          }

          if (failed.length > 0) {
            response._failureInstruction =
              "PARTIAL FAILURE: Some work items failed to create. When responding to the user, you MUST mention which items failed and include the relevant error details. Continue performing any other tasks you were asked to do."
          }

          return JSON.stringify(response, null, 2)
        },
      }),

      az_work_item_query: tool({
        description:
          "Query Azure DevOps work items by filters (type, state, assignee, iteration, area, tags, keyword) or raw WIQL. Returns matching items with key fields. Use for listing/searching work items.",
        args: {
          wiql: tool.schema
            .string()
            .optional()
            .describe(
              "Raw WIQL query string. If provided, all other filter args are IGNORED. Example: \"SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.State] = 'Active'\""
            ),
          type: tool.schema
            .enum(["Task", "Bug", "User Story", "Feature", "Epic"])
            .optional()
            .describe("Filter by work item type"),
          state: tool.schema
            .string()
            .optional()
            .describe("Filter by state (e.g., 'New', 'Active', 'Closed', 'Resolved')"),
          assigned_to: tool.schema
            .string()
            .optional()
            .describe("Filter by assignee email or display name. Use '@me' for current user."),
          iteration: tool.schema
            .string()
            .optional()
            .describe(
              "Filter by iteration path. Use '@CurrentIteration' for current sprint, or a full path like 'Project\\\\Sprint 1'."
            ),
          area: tool.schema
            .string()
            .optional()
            .describe("Filter by area path (e.g., 'Project\\\\Team')"),
          tags: tool.schema
            .string()
            .optional()
            .describe("Filter by tag (single tag, matched with CONTAINS)"),
          title_contains: tool.schema
            .string()
            .optional()
            .describe("Search for work items whose title contains this text"),
          top: tool.schema
            .number()
            .default(50)
            .describe("Maximum number of results to return (default 50, max 200)"),
        },
        async execute(args) {
          let wiql: string

          if (args.wiql) {
            wiql = args.wiql
          } else {
            const conditions: string[] = []

            if (args.type) conditions.push(`[System.WorkItemType] = '${args.type}'`)
            if (args.state) conditions.push(`[System.State] = '${args.state}'`)
            if (args.assigned_to) {
              if (args.assigned_to === "@me") {
                conditions.push("[System.AssignedTo] = @me")
              } else {
                conditions.push(`[System.AssignedTo] = '${args.assigned_to}'`)
              }
            }
            if (args.iteration) {
              if (args.iteration === "@CurrentIteration") {
                conditions.push("[System.IterationPath] = @CurrentIteration")
              } else {
                conditions.push(`[System.IterationPath] UNDER '${args.iteration}'`)
              }
            }
            if (args.area) conditions.push(`[System.AreaPath] UNDER '${args.area}'`)
            if (args.tags) conditions.push(`[System.Tags] CONTAINS '${args.tags}'`)
            if (args.title_contains)
              conditions.push(`[System.Title] CONTAINS '${args.title_contains}'`)

            const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : ""
            const top = Math.min(args.top, 200)

            wiql = `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo], [Microsoft.VSTS.Common.Priority], [Microsoft.VSTS.Scheduling.RemainingWork], [System.IterationPath], [System.AreaPath], [System.Tags], [System.CreatedDate], [System.ChangedDate] FROM WorkItems${where} ORDER BY [System.ChangedDate] DESC`

          }

          const result = await $`az boards query --wiql ${wiql} -o json`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: "Failed to query work items",
              details: result.stderr.toString() || result.text(),
              hint: "Ensure Azure DevOps CLI is configured (az devops configure -d organization=URL project=NAME) and you are logged in (az login).",
              wiqlUsed: wiql,
            })
          }

          const rawItems = result.json() || []
          const top = Math.min(args.top, 200)
          const items = rawItems.slice(0, top)

          const formatted = items.map((item: any) => {
            const fields = item.fields || item
            return {
              id: item.id || fields["System.Id"],
              type: fields["System.WorkItemType"],
              title: fields["System.Title"],
              state: fields["System.State"],
              assignedTo:
                fields["System.AssignedTo"]?.displayName ||
                fields["System.AssignedTo"] ||
                "Unassigned",
              priority: fields["Microsoft.VSTS.Common.Priority"],
              remainingWork: fields["Microsoft.VSTS.Scheduling.RemainingWork"],
              iteration: fields["System.IterationPath"],
              area: fields["System.AreaPath"],
              tags: fields["System.Tags"],
              changedDate: fields["System.ChangedDate"],
            }
          })

          return JSON.stringify(
            {
              total: formatted.length,
              truncated: rawItems.length > top,
              wiqlUsed: wiql,
              items: formatted,
            },
            null,
            2
          )
        },
      }),

      az_work_item_show: tool({
        description:
          "Get details of a specific work item including relations, history, and all fields.",
        args: {
          id: tool.schema.number().describe("Work item ID"),
          expand: tool.schema
            .enum(["None", "Relations", "All"])
            .default("Relations")
            .describe("What to expand in the response"),
        },
        async execute(args) {
          const flags: string[] = ["--id", String(args.id)]
          if (args.expand !== "None") {
            flags.push("--expand", args.expand)
          }

          const result = await $`az boards work-item show ${flags} -o json`.nothrow().quiet()

          if (result.exitCode !== 0) {
            return toolError({
              error: "Failed to get work item",
              details: result.stderr.toString() || result.text(),
            })
          }

          const item = result.json()
          const fields = item.fields || {}

          const response: Record<string, any> = {
            id: item.id,
            url: item.url,
            type: fields["System.WorkItemType"],
            title: fields["System.Title"],
            state: fields["System.State"],
            assignedTo: fields["System.AssignedTo"]?.displayName || "Unassigned",
            iteration: fields["System.IterationPath"],
            area: fields["System.AreaPath"],
            priority: fields["Microsoft.VSTS.Common.Priority"],
            description: fields["System.Description"],
            effort: {
              originalEstimate: fields["Microsoft.VSTS.Scheduling.OriginalEstimate"],
              remainingWork: fields["Microsoft.VSTS.Scheduling.RemainingWork"],
              completedWork: fields["Microsoft.VSTS.Scheduling.CompletedWork"],
            },
            tags: fields["System.Tags"],
            createdDate: fields["System.CreatedDate"],
            changedDate: fields["System.ChangedDate"],
          }

          if (item.relations?.length) {
            response.relations = item.relations.map((r: any) => ({
              type: r.rel,
              url: r.url,
              attributes: r.attributes,
            }))
          }

          return JSON.stringify(response, null, 2)
        },
      }),
    },
  }
}

export default plugin
