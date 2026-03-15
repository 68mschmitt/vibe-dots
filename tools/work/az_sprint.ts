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

export const az_sprint = tool({
  description:
    "Get comprehensive current sprint data including work items, progress metrics, and team capacity. Returns sprint details, all work items with status breakdown, and burndown metrics. Requires Azure DevOps CLI configured (az devops configure -d organization=URL project=NAME).",
  args: {
    team: tool.schema
      .string()
      .default("Compliance Platform Team")
      .describe("Team name. Defaults to 'Compliance Platform Team'."),
    iteration: tool.schema
      .string()
      .optional()
      .describe("Specific iteration path (uses current iteration if not specified)"),
  },
  async execute(args) {
    const $ = Bun.$

    let iterationPath = args.iteration
    let iterationInfo = null

    const findCurrentIteration = async (teamName: string | undefined) => {
      const listCmd = teamName
        ? await $`az boards iteration team list --team ${teamName} -o json`.nothrow().quiet()
        : await $`az boards iteration team list -o json`.nothrow().quiet()
      
      if (listCmd.exitCode !== 0) {
        return { error: listCmd.stderr || listCmd.text() }
      }
      
      try {
        const iterations = listCmd.json()
        const current = iterations.find((i: any) => i.attributes?.timeFrame === "current")
        if (current) {
          return { iteration: current }
        }
        return { error: "No current iteration found", iterations }
      } catch (e) {
        return { error: "Failed to parse iterations" }
      }
    }

    if (!iterationPath) {
      const iterCmd = args.team 
        ? await $`az boards iteration team show-default-iteration --team ${args.team} -o json`.nothrow().quiet()
        : await $`az boards iteration team show-default-iteration -o json`.nothrow().quiet()
      
      if (iterCmd.exitCode !== 0) {
        const errorText = iterCmd.stderr || iterCmd.text()
        
        if (errorText.includes("--team")) {
          const teamsResult = await $`az devops team list -o json`.nothrow().quiet()
          let teamList = ""
          if (teamsResult.exitCode === 0) {
            try {
              const teams = teamsResult.json()
              teamList = teams.map((t: any) => t.name).join(", ")
            } catch {}
          }
          
          return toolError({
            error: "Team name required",
            message: "No default team configured. Please specify a team name.",
            availableTeams: teamList || "Unable to fetch teams. Run 'az devops team list' to see available teams.",
            hint: "Call az_sprint with team parameter, e.g., az_sprint({ team: 'MyTeam' })"
          })
        }
        
        const fallback = await findCurrentIteration(args.team)
        if (fallback.error && !fallback.iteration) {
          return toolError({
            error: "Failed to get current iteration",
            details: errorText,
            fallbackError: fallback.error,
            hint: "Ensure you're logged in (az login) and have configured defaults (az devops configure -d organization=URL project=NAME)"
          })
        }
        
        iterationInfo = fallback.iteration
        iterationPath = fallback.iteration.path
      } else {
        const iterData = iterCmd.json()
        
        if (!iterData.path || iterData.path === "undefined") {
          const fallback = await findCurrentIteration(args.team)
          if (fallback.error && !fallback.iteration) {
            return toolError({
              error: "No default iteration configured and no current iteration found",
              details: "The team has no default iteration set, and no iteration with timeFrame='current' exists.",
              hint: "Set a default iteration in Azure DevOps or ensure a sprint is marked as current."
            })
          }
          iterationInfo = fallback.iteration
          iterationPath = fallback.iteration.path
        } else {
          iterationPath = iterData.path
          iterationInfo = iterData
        }
      }
    } else {
      const iterResult = await $`az boards iteration project show --path ${iterationPath} -o json`.nothrow().quiet()
      if (iterResult.exitCode === 0) {
        iterationInfo = iterResult.json()
      }
    }

    const wiql = `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo], [Microsoft.VSTS.Common.Priority], [Microsoft.VSTS.Scheduling.RemainingWork], [Microsoft.VSTS.Scheduling.OriginalEstimate], [Microsoft.VSTS.Scheduling.CompletedWork], [System.Tags] FROM WorkItems WHERE [System.IterationPath] = '${iterationPath}' ORDER BY [System.WorkItemType], [Microsoft.VSTS.Common.Priority], [System.State]`

    const workItemsResult = await $`az boards query --wiql ${wiql} -o json`.nothrow().quiet()

    if (workItemsResult.exitCode !== 0) {
      return toolError({
        error: "Failed to query work items",
        details: workItemsResult.stderr || workItemsResult.text(),
        iteration: iterationPath
      })
    }

    const workItems = workItemsResult.json() || []

    const metrics: Record<string, any> = {
      total: workItems.length,
      byType: {} as Record<string, number>,
      byState: {} as Record<string, number>,
      byAssignee: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      effort: {
        originalEstimate: 0,
        remainingWork: 0,
        completedWork: 0,
        percentComplete: 0,
      },
      unassigned: 0,
      blocked: 0,
    }

    for (const item of workItems) {
      const fields = item.fields || item
      const type = fields["System.WorkItemType"] || "Unknown"
      const state = fields["System.State"] || "Unknown"
      const assignee = fields["System.AssignedTo"]?.displayName || fields["System.AssignedTo"] || "Unassigned"
      const priority = fields["Microsoft.VSTS.Common.Priority"] || "None"
      const tags = fields["System.Tags"] || ""
      const remaining = parseFloat(fields["Microsoft.VSTS.Scheduling.RemainingWork"]) || 0
      const original = parseFloat(fields["Microsoft.VSTS.Scheduling.OriginalEstimate"]) || 0
      const completed = parseFloat(fields["Microsoft.VSTS.Scheduling.CompletedWork"]) || 0

      metrics.byType[type] = (metrics.byType[type] || 0) + 1
      metrics.byState[state] = (metrics.byState[state] || 0) + 1
      metrics.byAssignee[assignee] = (metrics.byAssignee[assignee] || 0) + 1
      metrics.byPriority["P" + priority] = (metrics.byPriority["P" + priority] || 0) + 1

      metrics.effort.originalEstimate += original
      metrics.effort.remainingWork += remaining
      metrics.effort.completedWork += completed

      if (assignee === "Unassigned") {
        metrics.unassigned++
      }

      if (tags.toLowerCase().includes("blocked")) {
        metrics.blocked++
      }
    }

    const totalEffort = metrics.effort.originalEstimate || (metrics.effort.completedWork + metrics.effort.remainingWork)
    if (totalEffort > 0) {
      metrics.effort.percentComplete = Math.round((metrics.effort.completedWork / totalEffort) * 100)
    }

    const groupedItems: Record<string, any[]> = {}
    for (const item of workItems) {
      const fields = item.fields || item
      const type = fields["System.WorkItemType"] || "Unknown"
      if (!groupedItems[type]) {
        groupedItems[type] = []
      }
      groupedItems[type].push({
        id: item.id || fields["System.Id"],
        title: fields["System.Title"],
        state: fields["System.State"],
        assignedTo: fields["System.AssignedTo"]?.displayName || fields["System.AssignedTo"] || "Unassigned",
        priority: fields["Microsoft.VSTS.Common.Priority"],
        remainingWork: fields["Microsoft.VSTS.Scheduling.RemainingWork"],
        tags: fields["System.Tags"],
      })
    }

    let sprintProgress = null
    if (iterationInfo?.attributes) {
      const startDate = iterationInfo.attributes.startDate ? new Date(iterationInfo.attributes.startDate) : null
      const endDate = iterationInfo.attributes.finishDate ? new Date(iterationInfo.attributes.finishDate) : null
      const today = new Date()

      if (startDate && endDate) {
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
        
        sprintProgress = {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          totalDays,
          daysElapsed: Math.min(daysElapsed, totalDays),
          daysRemaining,
          percentTimeElapsed: Math.min(100, Math.round((daysElapsed / totalDays) * 100)),
        }
      }
    }

    return JSON.stringify({
      sprint: {
        name: iterationInfo?.name || iterationPath?.split("\\").pop(),
        path: iterationPath,
        ...sprintProgress,
      },
      summary: {
        totalItems: metrics.total,
        byState: metrics.byState,
        byType: metrics.byType,
        unassigned: metrics.unassigned,
        blocked: metrics.blocked,
      },
      effort: metrics.effort,
      byAssignee: metrics.byAssignee,
      byPriority: metrics.byPriority,
      workItems: groupedItems,
      healthIndicators: {
        hasUnassignedWork: metrics.unassigned > 0,
        hasBlockedItems: metrics.blocked > 0,
        behindSchedule: sprintProgress 
          ? (sprintProgress.percentTimeElapsed > metrics.effort.percentComplete + 20)
          : false,
        noEstimates: metrics.effort.originalEstimate === 0 && metrics.total > 0,
      },
    }, null, 2)
  },
})
