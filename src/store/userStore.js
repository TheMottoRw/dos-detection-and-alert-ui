// Lightweight global user store without external deps
// Usage: import { useUserStore } from './store/userStore'
// It exposes reactive user state and actions to set/clear from JWT.

import { reactive, readonly } from 'vue'

function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    // handle unicode
    const decoded = decodeURIComponent(
      Array.prototype.map
        .call(json, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

const state = reactive({
  token: '',
  name: '',
  email: '',
})

function setToken(token) {
  state.token = token || ''
  if (!token) {
    state.name = ''
    state.email = ''
    return
  }
  const payload = decodeJwtPayload(token)
  if (payload) {
    // Support both nested payload.user and top-level fields with fallbacks
    const userObj = payload.user || {}
    const _id = userObj._id || ''
    const name = userObj.name
    const email = userObj.email || ''
    state._id = _id
    state.name = name
    state.email = email
  } else {
    state.name = ''
    state.email = ''
  }
}

function clear() {
  setToken('')
}

export function useUserStore() {
  return {
    state: readonly(state),
    setToken,
    clear,
  }
}
