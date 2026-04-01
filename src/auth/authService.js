import apiClient from '../api/client'
import { API_ENDPOINTS } from '../config/constants'
import { clearSession, saveSession } from './tokenStorage'

export async function loginRequest(payload) {
  const { data } = await apiClient.post(API_ENDPOINTS.login, payload)

  saveSession({
    access: data.access,
    refresh: data.refresh,
    email: data.email,
    userId: data.user_id,
  })

  return data
}

export async function registerRequest(payload) {
  const { data } = await apiClient.post(API_ENDPOINTS.register, payload)
  return data
}

export async function logoutRequest(refreshToken) {
  const { data } = await apiClient.post(API_ENDPOINTS.logout, {
    refresh: refreshToken,
  })
  clearSession()
  return data
}
