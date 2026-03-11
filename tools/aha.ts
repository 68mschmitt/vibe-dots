import { tool } from "@opencode-ai/plugin"

const AHA_DOMAIN = process.env.AHA_DOMAIN
const AHA_API_KEY = process.env.AHA_API_KEY

async function ahaFetch(endpoint: string, fields?: string): Promise<string> {
  if (!AHA_DOMAIN) {
    throw new Error("AHA_DOMAIN environment variable is not set")
  }
  if (!AHA_API_KEY) {
    throw new Error("AHA_API_KEY environment variable is not set")
  }

  // Handle both full domain (company.aha.io) and subdomain-only (company)
  const domain = AHA_DOMAIN.includes('.') ? AHA_DOMAIN : `${AHA_DOMAIN}.aha.io`
  const url = new URL(`https://${domain}/api/v1${endpoint}`)
  if (fields) {
    url.searchParams.set("fields", fields)
  }

  const result = await Bun.$`curl -s -H "Authorization: Bearer ${AHA_API_KEY}" -H "User-Agent: OpenCode Aha Integration" "${url.toString()}"`.text()
  return result.trim()
}

/**
 * Get a specific feature by reference number (e.g., APP-123)
 */
export const get_feature = tool({
  description: "Get details of a specific Aha! feature by its reference number (e.g., PROJ-123)",
  args: {
    reference: tool.schema.string().describe("The feature reference number (e.g., APP-123, PROJ-456)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include (e.g., 'name,description,workflow_status'). Use '*' for all fields."),
  },
  async execute(args) {
    return await ahaFetch(`/features/${args.reference}`, args.fields)
  },
})

/**
 * Get a specific epic by reference number
 */
export const get_epic = tool({
  description: "Get details of a specific Aha! epic by its reference number (e.g., PROJ-E-1)",
  args: {
    reference: tool.schema.string().describe("The epic reference number (e.g., APP-E-1)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    return await ahaFetch(`/epics/${args.reference}`, args.fields)
  },
})

/**
 * Get a specific initiative by reference number
 */
export const get_initiative = tool({
  description: "Get details of a specific Aha! initiative by its reference number",
  args: {
    reference: tool.schema.string().describe("The initiative reference number"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    return await ahaFetch(`/initiatives/${args.reference}`, args.fields)
  },
})

/**
 * Get a specific requirement by reference number
 */
export const get_requirement = tool({
  description: "Get details of a specific Aha! requirement by its reference number (e.g., PROJ-123-1)",
  args: {
    reference: tool.schema.string().describe("The requirement reference number (e.g., APP-123-1)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    return await ahaFetch(`/requirements/${args.reference}`, args.fields)
  },
})

/**
 * Get a specific release by reference number
 */
export const get_release = tool({
  description: "Get details of a specific Aha! release by its reference number (e.g., PROJ-R-1)",
  args: {
    reference: tool.schema.string().describe("The release reference number (e.g., APP-R-1)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    return await ahaFetch(`/releases/${args.reference}`, args.fields)
  },
})

/**
 * Get a specific idea by ID
 */
export const get_idea = tool({
  description: "Get details of a specific Aha! idea by its ID or reference number",
  args: {
    id: tool.schema.string().describe("The idea ID or reference number"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    return await ahaFetch(`/ideas/${args.id}`, args.fields)
  },
})

/**
 * List features in a release
 */
export const list_release_features = tool({
  description: "List all features in a specific Aha! release",
  args: {
    release_reference: tool.schema.string().describe("The release reference number (e.g., APP-R-1)"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/releases/${args.release_reference}/features`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List features in a product
 */
export const list_product_features = tool({
  description: "List all features in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/features`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List epics in a product
 */
export const list_product_epics = tool({
  description: "List all epics in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/epics`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List initiatives in a product
 */
export const list_product_initiatives = tool({
  description: "List all initiatives in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/initiatives`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List releases in a product
 */
export const list_product_releases = tool({
  description: "List all releases in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/releases`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List ideas in a product
 */
export const list_product_ideas = tool({
  description: "List all ideas in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/ideas`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List goals in a product
 */
export const list_product_goals = tool({
  description: "List all goals in a specific Aha! product",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products/${args.product_id}/goals`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * List all products in the account
 */
export const list_products = tool({
  description: "List all products (workspaces) in the Aha! account",
  args: {
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/products`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * Get the current user profile
 */
export const get_me = tool({
  description: "Get the current authenticated Aha! user's profile",
  args: {},
  async execute() {
    return await ahaFetch(`/me`)
  },
})

/**
 * Search features by workflow status
 */
export const list_features_by_status = tool({
  description: "List features filtered by workflow status",
  args: {
    product_id: tool.schema.string().describe("The product ID or reference prefix (e.g., 'APP')"),
    workflow_status: tool.schema.string().describe("The workflow status to filter by (e.g., 'In development', 'Ready to ship')"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    const params = new URLSearchParams()
    params.set("workflow_status", args.workflow_status)
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    return await ahaFetch(`/products/${args.product_id}/features?${params.toString()}`)
  },
})

/**
 * Get requirements for a feature
 */
export const list_feature_requirements = tool({
  description: "List all requirements for a specific Aha! feature",
  args: {
    feature_reference: tool.schema.string().describe("The feature reference number (e.g., APP-123)"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include"),
  },
  async execute(args) {
    let endpoint = `/features/${args.feature_reference}/requirements`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    if (args.fields) params.set("fields", args.fields)
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * Get comments on a feature
 */
export const list_feature_comments = tool({
  description: "List all comments on a specific Aha! feature",
  args: {
    feature_reference: tool.schema.string().describe("The feature reference number (e.g., APP-123)"),
    page: tool.schema.number().optional().describe("Page number for pagination (default: 1)"),
    per_page: tool.schema.number().optional().describe("Number of results per page (default: 30, max: 200)"),
  },
  async execute(args) {
    let endpoint = `/features/${args.feature_reference}/comments`
    const params = new URLSearchParams()
    if (args.page) params.set("page", args.page.toString())
    if (args.per_page) params.set("per_page", args.per_page.toString())
    
    const queryString = params.toString()
    if (queryString) endpoint += `?${queryString}`
    
    return await ahaFetch(endpoint)
  },
})

/**
 * Generic Aha! API call for advanced users
 */
export const api_call = tool({
  description: "Make a generic GET request to any Aha! API endpoint. Use this for endpoints not covered by other tools.",
  args: {
    endpoint: tool.schema.string().describe("The API endpoint path (e.g., '/features/APP-123' or '/products/APP/features')"),
    fields: tool.schema.string().optional().describe("Comma-separated list of fields to include in the response"),
  },
  async execute(args) {
    return await ahaFetch(args.endpoint, args.fields)
  },
})
