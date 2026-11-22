export class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.error?.message || 'Không thể kết nối tới máy chủ.')
    this.name = 'ApiError'
    this.status = status
    this.code = payload?.error?.code || 'REQUEST_FAILED'
    this.fields = payload?.error?.fields || null
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'same-origin',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) throw new ApiError(response.status, payload)
  return payload
}
