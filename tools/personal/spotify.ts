import { tool } from "@opencode-ai/plugin"
import { readFileSync, writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { createServer, type Server } from "http"

// ---------------------------------------------------------------------------
// Token persistence
// ---------------------------------------------------------------------------

const TOKEN_DIR = join(
  process.env.HOME ?? process.env.USERPROFILE ?? "/tmp",
  ".config",
  "opencode",
)
const TOKEN_FILE = join(TOKEN_DIR, ".spotify-tokens.json")

interface StoredTokens {
  access_token: string
  refresh_token?: string
  expires_at: number // epoch ms
  scopes?: string
}

function loadStoredTokens(): StoredTokens | null {
  try {
    const raw = readFileSync(TOKEN_FILE, "utf-8")
    return JSON.parse(raw) as StoredTokens
  } catch {
    return null
  }
}

function saveStoredTokens(tokens: StoredTokens): void {
  try {
    mkdirSync(TOKEN_DIR, { recursive: true })
    writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 })
  } catch {
    // non-fatal — tokens still work in-memory for this session
  }
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

interface TokenCache {
  token: string
  expiresAt: number
}

let cachedToken: TokenCache | null = null

const DEFAULT_SCOPES = [
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-top-read",
].join(" ")

const REDIRECT_PORT = 8888
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`

function getClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error(
      "SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are required.\n" +
        "Create an app at https://developer.spotify.com/dashboard\n" +
        "and set these environment variables.",
    )
  }
  return { clientId, clientSecret }
}

/**
 * Exchange an authorization code for tokens.
 */
async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
): Promise<StoredTokens> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }).toString(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token exchange failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as {
    access_token: string
    refresh_token: string
    expires_in: number
    scope: string
  }

  const tokens: StoredTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scopes: data.scope,
  }

  saveStoredTokens(tokens)

  // Also update in-memory cache
  cachedToken = { token: tokens.access_token, expiresAt: tokens.expires_at }

  return tokens
}

/**
 * Refresh an expired user token using a refresh_token.
 */
async function refreshAccessToken(refreshToken: string): Promise<StoredTokens> {
  const { clientId, clientSecret } = getClientCredentials()

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Token refresh failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
    scope: string
  }

  const tokens: StoredTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? refreshToken, // keep old if not rotated
    expires_at: Date.now() + data.expires_in * 1000,
    scopes: data.scope,
  }

  saveStoredTokens(tokens)
  cachedToken = { token: tokens.access_token, expiresAt: tokens.expires_at }

  return tokens
}

/**
 * Get an access token. Resolution order:
 *
 * 1. In-memory cache (fastest, already validated)
 * 2. Stored user token from ~/.config/opencode/.spotify-tokens.json
 *    (auto-refreshes if expired and refresh_token is available)
 * 3. SPOTIFY_ACCESS_TOKEN env var (fallback, cannot be refreshed)
 * 4. Client Credentials flow (SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET)
 *    — only supports public/non-user endpoints
 *
 * If nothing works, throws with instructions to run the authenticate tool.
 */
async function getAccessToken(): Promise<string> {
  // 1. In-memory cache (from a previous call this session)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  // 2. Stored user token (from previous authenticate call)
  //    This is preferred because it has a refresh_token for auto-renewal.
  const stored = loadStoredTokens()
  if (stored) {
    // Still valid? (60s buffer)
    if (Date.now() < stored.expires_at - 60_000) {
      cachedToken = { token: stored.access_token, expiresAt: stored.expires_at }
      return stored.access_token
    }
    // Expired but we have a refresh token — auto-refresh
    if (stored.refresh_token) {
      try {
        const refreshed = await refreshAccessToken(stored.refresh_token)
        return refreshed.access_token
      } catch {
        // refresh failed — fall through to env var / Client Credentials
      }
    }
  }

  // 3. SPOTIFY_ACCESS_TOKEN env var (cannot be refreshed, so only used as fallback)
  const envToken = process.env.SPOTIFY_ACCESS_TOKEN
  if (envToken) return envToken

  // 4. Client Credentials flow
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      "No Spotify credentials found. Either:\n" +
        "  1. Run the spotify_authenticate tool to log in via OAuth, or\n" +
        "  2. Set SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET env vars, or\n" +
        "  3. Set SPOTIFY_ACCESS_TOKEN env var\n\n" +
        "Create an app at https://developer.spotify.com/dashboard",
    )
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Spotify Client Credentials auth failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const API = "https://api.spotify.com/v1"

async function spotifyGet(path: string, params?: Record<string, string>): Promise<any> {
  const token = await getAccessToken()
  const url = new URL(`${API}${path}`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v)
    }
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Spotify API ${res.status}: ${body}`)
  }
  return res.json()
}

async function spotifyPost(path: string, body?: any): Promise<any> {
  const token = await getAccessToken()
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify API ${res.status}: ${text}`)
  }
  // Some endpoints return 201 with body, some return 200/204 with no body
  const text = await res.text()
  return text ? JSON.parse(text) : { success: true }
}

async function spotifyPut(path: string, body?: any): Promise<any> {
  const token = await getAccessToken()
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify API ${res.status}: ${text}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : { success: true }
}

async function spotifyDelete(path: string, body?: any): Promise<any> {
  const token = await getAccessToken()
  const res = await fetch(`${API}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Spotify API ${res.status}: ${text}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : { success: true }
}

// ---------------------------------------------------------------------------
// Formatters — keep LLM responses concise
// Reflects Feb 2026 API changes (removed: popularity, followers, etc.)
// ---------------------------------------------------------------------------

function fmtArtist(a: any) {
  return {
    name: a.name,
    id: a.id,
    genres: a.genres,
    url: a.external_urls?.spotify,
  }
}

function fmtAlbum(a: any) {
  return {
    name: a.name,
    id: a.id,
    artists: a.artists?.map((x: any) => x.name),
    release_date: a.release_date,
    total_tracks: a.total_tracks,
    type: a.album_type,
    url: a.external_urls?.spotify,
  }
}

function fmtTrack(t: any) {
  return {
    name: t.name,
    id: t.id,
    artists: t.artists?.map((x: any) => x.name),
    album: t.album?.name,
    duration_ms: t.duration_ms,
    preview_url: t.preview_url,
    url: t.external_urls?.spotify,
    uri: t.uri,
  }
}

function fmtPlaylist(p: any) {
  // Feb 2026: "tracks" field renamed to "items"; items may be absent for
  // playlists you don't own/collaborate on.
  const itemCount = p.items?.total ?? p.tracks?.total
  return {
    name: p.name,
    id: p.id,
    description: p.description,
    owner: p.owner?.display_name,
    public: p.public,
    items_total: itemCount,
    url: p.external_urls?.spotify,
  }
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

/**
 * AUTHENTICATE — run the full OAuth Authorization Code flow.
 * Starts a local HTTP server on 127.0.0.1, opens the browser, waits for
 * the callback, exchanges the code for tokens, and persists them to disk.
 */
export const authenticate = tool({
  description:
    "Authenticate with Spotify using the OAuth Authorization Code flow. " +
    "This opens a browser window for the user to log in, then exchanges the " +
    "authorization code for access and refresh tokens. Tokens are saved to " +
    "disk and automatically refreshed when they expire. " +
    "Requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables. " +
    "The Spotify app must have http://127.0.0.1:8888/callback as a redirect URI.",
  args: {
    scopes: tool.schema
      .string()
      .optional()
      .describe(
        "Space-separated OAuth scopes. Defaults to a broad set covering " +
          "playlists, library, profile, and top items.",
      ),
  },
  async execute(args) {
    const { clientId } = getClientCredentials()
    const scopes = args.scopes ?? DEFAULT_SCOPES

    // Build the authorization URL
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI)
    authUrl.searchParams.set("scope", scopes)
    authUrl.searchParams.set("show_dialog", "true")

    // Start a temporary local HTTP server to catch the callback
    const { code, error } = await new Promise<{ code?: string; error?: string }>(
      (resolve, reject) => {
        let server: Server

        const timeout = setTimeout(() => {
          server?.close()
          reject(new Error("Authentication timed out after 120 seconds. Please try again."))
        }, 120_000)

        server = createServer((req, res) => {
          const url = new URL(req.url ?? "/", `http://127.0.0.1:${REDIRECT_PORT}`)

          if (url.pathname === "/callback") {
            const code = url.searchParams.get("code") ?? undefined
            const error = url.searchParams.get("error") ?? undefined

            res.writeHead(200, { "Content-Type": "text/html" })
            res.end(
              code
                ? "<html><body><h2>Spotify authentication successful!</h2><p>You can close this window and return to OpenCode.</p></body></html>"
                : `<html><body><h2>Authentication failed</h2><p>${error ?? "Unknown error"}</p></body></html>`,
            )

            clearTimeout(timeout)
            server.close()
            resolve({ code, error })
          } else {
            res.writeHead(404)
            res.end()
          }
        })

        server.listen(REDIRECT_PORT, "127.0.0.1", () => {
          // Open the browser — try common openers
          const url = authUrl.toString()
          const { exec } = require("child_process")
          const cmd =
            process.platform === "darwin"
              ? `open "${url}"`
              : process.platform === "win32"
                ? `start "" "${url}"`
                : `xdg-open "${url}" 2>/dev/null || sensible-browser "${url}" 2>/dev/null || echo "MANUAL_OPEN"`

          exec(cmd, (err: any, stdout: string) => {
            // If we couldn't open a browser, the user will see the URL in the response
            if (err || stdout?.includes("MANUAL_OPEN")) {
              // Not fatal — the URL is returned in the tool output
            }
          })
        })

        server.on("error", (err: any) => {
          clearTimeout(timeout)
          reject(
            new Error(
              `Could not start local server on port ${REDIRECT_PORT}: ${err.message}\n` +
                "Make sure nothing else is using that port.",
            ),
          )
        })
      },
    )

    if (error) {
      throw new Error(`Spotify authorization denied: ${error}`)
    }

    if (!code) {
      throw new Error("No authorization code received.")
    }

    // Exchange the code for tokens
    const { clientId: cid, clientSecret } = getClientCredentials()
    const tokens = await exchangeCodeForTokens(code, cid, clientSecret)

    return JSON.stringify(
      {
        success: true,
        message: "Spotify authentication successful! Tokens saved.",
        expires_at: new Date(tokens.expires_at).toISOString(),
        scopes: tokens.scopes,
        has_refresh_token: !!tokens.refresh_token,
        token_file: TOKEN_FILE,
        note: "Tokens will auto-refresh when expired. No need to re-authenticate unless you revoke access.",
      },
      null,
      2,
    )
  },
})

/**
 * REFRESH — manually refresh the stored access token.
 */
export const refresh = tool({
  description:
    "Manually refresh the Spotify access token using the stored refresh token. " +
    "This happens automatically when tokens expire, but you can call this " +
    "explicitly if you get 401 errors. Requires a previous successful authenticate call.",
  args: {},
  async execute() {
    const stored = loadStoredTokens()
    if (!stored?.refresh_token) {
      throw new Error(
        "No refresh token found. Run the spotify_authenticate tool first to log in.",
      )
    }

    const tokens = await refreshAccessToken(stored.refresh_token)

    return JSON.stringify(
      {
        success: true,
        message: "Token refreshed successfully.",
        expires_at: new Date(tokens.expires_at).toISOString(),
        scopes: tokens.scopes,
      },
      null,
      2,
    )
  },
})

/**
 * SEARCH — search for tracks, albums, artists, or playlists.
 * Works with Client Credentials.
 * Feb 2026: limit max reduced to 10.
 */
export const search = tool({
  description:
    "Search Spotify for tracks, albums, artists, or playlists. Returns the top results for the given query. " +
    "Requires SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET, or SPOTIFY_ACCESS_TOKEN.",
  args: {
    query: tool.schema.string().describe("Search query (e.g. 'Bohemian Rhapsody', 'Taylor Swift')"),
    type: tool.schema
      .enum(["track", "album", "artist", "playlist"])
      .optional()
      .describe("Type of item to search for. Defaults to 'track'."),
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Max results to return (1-10, default 5)"),
  },
  async execute(args) {
    const type = args.type ?? "track"
    const limit = String(args.limit ?? 5)
    const data = await spotifyGet("/search", { q: args.query, type, limit })

    const key = `${type}s` // tracks, albums, artists, playlists
    const items = data[key]?.items ?? []

    const formatters: Record<string, (i: any) => any> = {
      track: fmtTrack,
      album: fmtAlbum,
      artist: fmtArtist,
      playlist: fmtPlaylist,
    }

    const results = items.map(formatters[type])
    return JSON.stringify({ type, query: args.query, results }, null, 2)
  },
})

/**
 * GET INFO — get details for a specific track, album, or artist by ID.
 * Works with Client Credentials.
 */
export const get_info = tool({
  description:
    "Get detailed information about a Spotify track, album, or artist by its Spotify ID. " +
    "For albums, also returns the track listing. " +
    "Requires SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET, or SPOTIFY_ACCESS_TOKEN.",
  args: {
    type: tool.schema.enum(["track", "album", "artist"]).describe("Type of item"),
    id: tool.schema.string().describe("Spotify ID of the item (e.g. '6rqhFgbbKwnb9MLmUQDhG6')"),
  },
  async execute(args) {
    const data = await spotifyGet(`/${args.type}s/${args.id}`)

    let result: any
    if (args.type === "track") {
      result = fmtTrack(data)
    } else if (args.type === "album") {
      // Feb 2026: tracks field may be named "items" now
      const trackItems = data.tracks?.items ?? data.items?.items ?? []
      result = {
        ...fmtAlbum(data),
        tracks: trackItems.map((t: any, i: number) => ({
          number: i + 1,
          name: t.name,
          id: t.id,
          duration_ms: t.duration_ms,
          artists: t.artists?.map((a: any) => a.name),
        })),
      }
    } else {
      result = fmtArtist(data)
    }

    return JSON.stringify(result, null, 2)
  },
})

/**
 * GET USER PROFILE — requires user token.
 * Feb 2026: email, country, product, followers removed from /me response.
 */
export const get_my_profile = tool({
  description:
    "Get the current Spotify user's profile information. " +
    "Requires SPOTIFY_ACCESS_TOKEN with the 'user-read-private' scope.",
  args: {},
  async execute() {
    const data = await spotifyGet("/me")
    return JSON.stringify(
      {
        display_name: data.display_name,
        id: data.id,
        images: data.images,
        url: data.external_urls?.spotify,
      },
      null,
      2,
    )
  },
})

/**
 * GET MY PLAYLISTS — requires user token.
 */
export const get_my_playlists = tool({
  description:
    "List the current user's playlists on Spotify. " +
    "Requires SPOTIFY_ACCESS_TOKEN with the 'playlist-read-private' scope.",
  args: {
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max playlists to return (1-50, default 20)"),
  },
  async execute(args) {
    const limit = String(args.limit ?? 20)
    const data = await spotifyGet("/me/playlists", { limit })
    const playlists = (data.items ?? []).map(fmtPlaylist)
    return JSON.stringify({ total: data.total, playlists }, null, 2)
  },
})

/**
 * GET PLAYLIST ITEMS — requires user token for private playlists.
 * Feb 2026: endpoint renamed from /tracks to /items; field track -> item.
 * Only returns items for playlists you own or collaborate on.
 */
export const get_playlist_tracks = tool({
  description:
    "Get the tracks in a Spotify playlist. Public playlists work with Client Credentials; " +
    "private playlists need SPOTIFY_ACCESS_TOKEN. " +
    "Only returns items for playlists you own or collaborate on.",
  args: {
    playlist_id: tool.schema.string().describe("Spotify playlist ID"),
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max tracks to return (1-50, default 20)"),
  },
  async execute(args) {
    const limit = String(args.limit ?? 20)
    const data = await spotifyGet(`/playlists/${args.playlist_id}/items`, { limit })
    const tracks = (data.items ?? []).map((entry: any) => {
      // Feb 2026: "track" field renamed to "item"
      const t = entry.item ?? entry.track
      return {
        added_at: entry.added_at,
        added_by: entry.added_by?.id,
        ...fmtTrack(t),
      }
    })
    return JSON.stringify({ total: data.total, tracks }, null, 2)
  },
})

/**
 * CREATE PLAYLIST — requires user token with playlist-modify-public/private scope.
 * Feb 2026: POST /users/{id}/playlists replaced with POST /me/playlists.
 */
export const create_playlist = tool({
  description:
    "Create a new Spotify playlist for the current user. " +
    "Requires SPOTIFY_ACCESS_TOKEN with 'playlist-modify-public' or 'playlist-modify-private' scope.",
  args: {
    name: tool.schema.string().describe("Name of the new playlist"),
    description: tool.schema.string().optional().describe("Playlist description"),
    public: tool.schema.boolean().optional().describe("Whether the playlist is public (default true)"),
  },
  async execute(args) {
    const data = await spotifyPost("/me/playlists", {
      name: args.name,
      description: args.description ?? "",
      public: args.public ?? true,
    })
    return JSON.stringify(fmtPlaylist(data), null, 2)
  },
})

/**
 * ADD ITEMS TO PLAYLIST — requires user token.
 * Feb 2026: endpoint renamed from /tracks to /items.
 */
export const add_tracks_to_playlist = tool({
  description:
    "Add tracks to a Spotify playlist. " +
    "Requires SPOTIFY_ACCESS_TOKEN with 'playlist-modify-public' or 'playlist-modify-private' scope.",
  args: {
    playlist_id: tool.schema.string().describe("Spotify playlist ID"),
    track_uris: tool.schema
      .array(tool.schema.string())
      .describe("Array of Spotify track URIs (e.g. ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh'])"),
    position: tool.schema
      .number()
      .int()
      .min(0)
      .optional()
      .describe("Position to insert tracks (0-based). Omit to append."),
  },
  async execute(args) {
    const body: any = { uris: args.track_uris }
    if (args.position !== undefined) body.position = args.position
    const data = await spotifyPost(`/playlists/${args.playlist_id}/items`, body)
    return JSON.stringify({ success: true, snapshot_id: data.snapshot_id }, null, 2)
  },
})

/**
 * REMOVE ITEMS FROM PLAYLIST — requires user token.
 * Feb 2026: endpoint /tracks -> /items, param "tracks" -> "items".
 */
export const remove_tracks_from_playlist = tool({
  description:
    "Remove tracks from a Spotify playlist. " +
    "Requires SPOTIFY_ACCESS_TOKEN with 'playlist-modify-public' or 'playlist-modify-private' scope.",
  args: {
    playlist_id: tool.schema.string().describe("Spotify playlist ID"),
    track_uris: tool.schema
      .array(tool.schema.string())
      .describe("Array of Spotify track URIs to remove (e.g. ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh'])"),
  },
  async execute(args) {
    const body = { items: args.track_uris.map((uri) => ({ uri })) }
    const data = await spotifyDelete(`/playlists/${args.playlist_id}/items`, body)
    return JSON.stringify({ success: true, snapshot_id: data.snapshot_id }, null, 2)
  },
})

/**
 * GET SAVED TRACKS (liked songs) — requires user token.
 */
export const get_saved_tracks = tool({
  description:
    "Get the current user's saved (liked) tracks on Spotify. " +
    "Requires SPOTIFY_ACCESS_TOKEN with the 'user-library-read' scope.",
  args: {
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max tracks to return (1-50, default 20)"),
    offset: tool.schema.number().int().min(0).optional().describe("Offset for pagination (default 0)"),
  },
  async execute(args) {
    const limit = String(args.limit ?? 20)
    const offset = String(args.offset ?? 0)
    const data = await spotifyGet("/me/tracks", { limit, offset })
    const tracks = (data.items ?? []).map((item: any) => ({
      added_at: item.added_at,
      ...fmtTrack(item.track),
    }))
    return JSON.stringify({ total: data.total, offset: Number(offset), tracks }, null, 2)
  },
})

/**
 * GET TOP ITEMS — requires user token.
 */
export const get_my_top_items = tool({
  description:
    "Get the current user's top tracks or artists on Spotify (based on listening history). " +
    "Requires SPOTIFY_ACCESS_TOKEN with the 'user-top-read' scope.",
  args: {
    type: tool.schema
      .enum(["tracks", "artists"])
      .describe("Type of top items to retrieve"),
    time_range: tool.schema
      .enum(["short_term", "medium_term", "long_term"])
      .optional()
      .describe("Time range: short_term (~4 weeks), medium_term (~6 months), long_term (years). Default medium_term."),
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max items to return (1-50, default 10)"),
  },
  async execute(args) {
    const time_range = args.time_range ?? "medium_term"
    const limit = String(args.limit ?? 10)
    const data = await spotifyGet(`/me/top/${args.type}`, { time_range, limit })

    const formatter = args.type === "tracks" ? fmtTrack : fmtArtist
    const items = (data.items ?? []).map(formatter)
    return JSON.stringify({ type: args.type, time_range, items }, null, 2)
  },
})

/**
 * UPDATE PLAYLIST DETAILS — requires user token.
 */
export const update_playlist = tool({
  description:
    "Update a Spotify playlist's name, description, or public/private status. " +
    "Requires SPOTIFY_ACCESS_TOKEN with 'playlist-modify-public' or 'playlist-modify-private' scope.",
  args: {
    playlist_id: tool.schema.string().describe("Spotify playlist ID"),
    name: tool.schema.string().optional().describe("New playlist name"),
    description: tool.schema.string().optional().describe("New playlist description"),
    public: tool.schema.boolean().optional().describe("Set playlist public or private"),
  },
  async execute(args) {
    const body: any = {}
    if (args.name !== undefined) body.name = args.name
    if (args.description !== undefined) body.description = args.description
    if (args.public !== undefined) body.public = args.public
    await spotifyPut(`/playlists/${args.playlist_id}`, body)
    return JSON.stringify({ success: true, playlist_id: args.playlist_id }, null, 2)
  },
})
