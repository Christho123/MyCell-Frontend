export const API_BASE_URL = 'http://127.0.0.1:8000/api/'

export const API_ENDPOINTS = {
  login: 'architect/auth/login/',
  register: 'profiles/auth/register/',
  logout: 'architect/auth/logout/',
  getProfile: 'profiles/users/profile/',
  updateProfile: 'profiles/profiles/me/',
  profilePhoto: 'profiles/users/me/photo/',
  documentTypes: 'types/document_type/all/',
  countries: 'locations/countries/',
}

export const TOKEN_KEYS = {
  access: 'mycell_access_token',
  refresh: 'mycell_refresh_token',
  email: 'mycell_user_email',
  userId: 'mycell_user_id',
  theme: 'mycell_theme_mode',
}
