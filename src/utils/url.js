import { API_BASE_URL } from '../config/constants'

const API_ORIGIN = window.location.origin

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