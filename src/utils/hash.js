// Safe hashing utility for browser environments
// Usage: const hex = await sha256('text')

export async function sha256(message) {
  const enc = new TextEncoder()
  const data = enc.encode(message)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(digest)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}
