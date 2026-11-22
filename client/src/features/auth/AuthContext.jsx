import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiRequest } from './api.js'

const AuthContext = createContext(null)

export const roleLabels = Object.freeze({
  parent: 'Phụ huynh',
  tutor: 'Gia sư',
  admin: 'Quản trị viên',
})

export function dashboardPathForRole(role) {
  if (role === 'parent') return '/parent/dashboard'
  if (role === 'tutor') return '/tutor/dashboard'
  if (role === 'admin') return '/admin'
  return '/'
}

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null, error: null })
  const csrfTokenRef = useRef(null)

  const refresh = useCallback(async () => {
    try {
      const payload = await apiRequest('/api/auth/me')
      setState({ status: 'authenticated', user: payload.user, error: null })
      return payload.user
    } catch (error) {
      if (error.status === 401) {
        setState({ status: 'guest', user: null, error: null })
        return null
      }
      setState({ status: 'error', user: null, error })
      return null
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getCsrfToken = useCallback(async ({ force = false } = {}) => {
    if (!force && csrfTokenRef.current) return csrfTokenRef.current
    const payload = await apiRequest('/api/auth/csrf')
    csrfTokenRef.current = payload.csrfToken
    return payload.csrfToken
  }, [])

  const mutate = useCallback(async (path, body, method = 'POST') => {
    const csrfToken = await getCsrfToken()
    return apiRequest(path, {
      method,
      headers: { 'x-csrf-token': csrfToken },
      body,
    })
  }, [getCsrfToken])

  const register = useCallback(async (input) => {
    return mutate('/api/auth/register', input)
  }, [mutate])

  const login = useCallback(async (input) => {
    const payload = await mutate('/api/auth/login', input)
    csrfTokenRef.current = null
    setState({ status: 'authenticated', user: payload.user, error: null })
    return payload.user
  }, [mutate])

  const logout = useCallback(async () => {
    await getCsrfToken({ force: true })
    await mutate('/api/auth/logout', undefined)
    csrfTokenRef.current = null
    setState({ status: 'guest', user: null, error: null })
  }, [getCsrfToken, mutate])

  const updateProfile = useCallback(async (patch) => {
    const payload = await mutate('/api/me/profile', patch, 'PATCH')
    setState({ status: 'authenticated', user: payload.user, error: null })
    return payload.user
  }, [mutate])

  const value = useMemo(() => ({
    ...state,
    register,
    login,
    logout,
    refresh,
    updateProfile,
  }), [state, register, login, logout, refresh, updateProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider.')
  return context
}
