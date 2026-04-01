import { API_BASE_URL } from '../config/constants'

const API_ORIGIN = new URL(API_BASE_URL).origin

export function resolveMediaUrl(maybeRelativeUrl) {
  if (!maybeRelativeUrl) return ''
  if (typeof maybeRelativeUrl !== 'string') return ''
  if (maybeRelativeUrl.startsWith('http://') || maybeRelativeUrl.startsWith('https://')) {
    return maybeRelativeUrl
  }
  if (maybeRelativeUrl.startsWith('/')) {
    return `${API_ORIGIN}${maybeRelativeUrl}`
  }
  return `${API_ORIGIN}/${maybeRelativeUrl}`
}
