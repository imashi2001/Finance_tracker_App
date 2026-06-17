import { createContext, useContext, useState } from 'react'
import api, { STORAGE_KEY } from '../api/axios'

const AuthContext = createContext(null)

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const persistUser = (nextUser) => {
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    persistUser(data)
    return data
  }

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    persistUser(data)
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    isAuthenticated: Boolean(user?.token),
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
