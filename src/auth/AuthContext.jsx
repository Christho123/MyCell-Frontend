import { useMemo, useState } from 'react'
import { loginRequest, logoutRequest, registerRequest } from './authService'
import {
  clearSession,
  getRefreshToken,
  getSessionUser,
  isSessionActive,
} from './tokenStorage'
import AuthContext from './authContextInstance'

function AuthProvider({ children }) {
  const [user, setUser] = useState(getSessionUser())
  const [isAuthenticated, setIsAuthenticated] = useState(isSessionActive())
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    setLoading(true)
    try {
      const data = await loginRequest(credentials)
      setUser({
        email: data.email,
        userId: data.user_id,
      })
      setIsAuthenticated(true)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (registerData) => {
    setLoading(true)
    try {
      return await registerRequest(registerData)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await logoutRequest(refreshToken)
      } else {
        clearSession()
      }
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, loading, isAuthenticated],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
