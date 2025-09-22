import axios from 'axios'

// Create a reusable axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  // withCredentials can be toggled if backend uses cookies
  // withCredentials: true,
})

// Helper to get token from a potential store or localStorage
function getToken() {
  try {
    // Lazy import store if exists
    // We don't want to create circular deps; wrap in try/catch
    // and fall back to localStorage
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) return token
    }
  } catch (_) {}
  try {
    // Attempt to read from user store if available
    // Optional: dynamically import to avoid hard dependency
    // and catch if the file does not exist
    // Note: This block is best-effort and safe to ignore if not present
    // eslint-disable-next-line no-useless-catch
  } catch (e) {
    // ignore
  }
  return null
}

// Request interceptor to attach Authorization header
api.interceptors.request.use((config) => {
  const token = getToken()
  // Optionally skip adding token for login endpoint
  const isAuthLogin = /\/auth\/login\b/.test(config.url || '')
  if (token && !isAuthLogin) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor with global 401 handling: redirect to login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      try {
        // Clear any stored token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      } catch (_) {}
      // Avoid infinite redirect loop if the current route already is login
      try {
        // Dynamic import to avoid circular deps
        import('../router').then(({ default: router }) => {
          const currentPath = router.currentRoute.value?.path || ''
          const isAlreadyOnLogin = currentPath === '/' || currentPath === '/login'
          if (!isAlreadyOnLogin) {
            router.replace({ path: '/', query: { redirect: currentPath || undefined } })
          }
        }).catch(() => {
          // Fallback: hard redirect
          if (typeof window !== 'undefined') {
            if (!/^(\/|\/login)$/.test(window.location.pathname)) {
              window.location.href = '/'
            }
          }
        })
      } catch (_) {
        if (typeof window !== 'undefined') {
          if (!/^(\/|\/login)$/.test(window.location.pathname)) {
            window.location.href = '/'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
