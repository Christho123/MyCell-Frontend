import { TOKEN_KEYS } from '../config/constants'

export function saveSession({ access, refresh, email, userId }) {
  localStorage.setItem(TOKEN_KEYS.access, access)
  localStorage.setItem(TOKEN_KEYS.refresh, refresh)
  localStorage.setItem(TOKEN_KEYS.email, email)
  localStorage.setItem(TOKEN_KEYS.userId, String(userId))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEYS.access)
  localStorage.removeItem(TOKEN_KEYS.refresh)
  localStorage.removeItem(TOKEN_KEYS.email)
  localStorage.removeItem(TOKEN_KEYS.userId)
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEYS.access)
}

export function getRefreshToken() {
  return localStorage.getItem(TOKEN_KEYS.refresh)
}

export function getSessionUser() {
  const email = localStorage.getItem(TOKEN_KEYS.email)
  const userId = localStorage.getItem(TOKEN_KEYS.userId)

  if (!email || !userId) {
    return null
  }

  return {
    email,
    userId: Number(userId),
  }
}

export function isSessionActive() {
  return Boolean(getAccessToken() && getRefreshToken())
}
