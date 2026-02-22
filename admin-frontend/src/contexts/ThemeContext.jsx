import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('adminTheme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    localStorage.setItem('adminTheme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Component to apply the 'dark' class to the root element based on theme state and current route.
 * This ensures the login page ('/') remains in light mode even if the global theme is dark.
 */
export function ThemeWatcher() {
  const { isDark } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const root = document.documentElement
    const isLoginPage = location.pathname === '/'

    if (isDark && !isLoginPage) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark, location.pathname])

  return null
}

export const useTheme = () => useContext(ThemeContext)
