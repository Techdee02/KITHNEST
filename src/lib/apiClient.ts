// Relative by default so it works over the Vite dev proxy regardless of
// where the frontend itself is being accessed from (localhost, a Codespace
// forwarded URL, a deployed origin, etc.) — see vite.config.ts's `server.proxy`.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string | null
  isFormData?: boolean
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, isFormData, headers, ...rest } = options

  const finalHeaders = new Headers(headers)
  if (token) finalHeaders.set('Authorization', `Bearer ${token}`)
  if (body !== undefined && !isFormData) finalHeaders.set('Content-Type', 'application/json')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      if (typeof data.detail === 'string') message = data.detail
      else if (Array.isArray(data.detail) && data.detail[0]?.msg) message = data.detail[0].msg
    } catch {
      // response body wasn't JSON — fall back to the generic message above
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

/** Resolves a backend-relative URL (e.g. an uploaded logo path) to an absolute one. */
export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const origin = API_BASE_URL.replace(/\/api\/?$/, '')
  return `${origin}${path}`
}
