import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AuthContext } from './AuthContext'
import settingsService from '../services/settingsService'

export const ThemeContext = createContext(null)

const STORAGE_KEY = 'cc_theme'

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  return storedTheme === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const { token } = useContext(AuthContext)

  const [theme, setThemeState] = useState(getStoredTheme)
  const [hasLoadedRemoteTheme, setHasLoadedRemoteTheme] = useState(false)

  // Keep DOM synced with theme
  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Load saved theme from backend once
  useEffect(() => {
    if (!token) {
      setHasLoadedRemoteTheme(false)
      setThemeState(getStoredTheme())
      return
    }

    if (hasLoadedRemoteTheme) return

    let isMounted = true

    const loadRemoteTheme = async () => {
      try {
        const settings = await settingsService.getSettings()

        if (!isMounted) return

        const remoteTheme = settings?.darkMode ? 'dark' : 'light'

        setThemeState(remoteTheme)
      } catch (err) {
        console.error('Unable to load theme', err)
      } finally {
        if (isMounted) {
          setHasLoadedRemoteTheme(true)
        }
      }
    }

    loadRemoteTheme()

    return () => {
      isMounted = false
    }
  }, [token, hasLoadedRemoteTheme])

  const applyTheme = async (nextTheme) => {
    const previousTheme = theme

    // Update UI immediately
    setThemeState(nextTheme)

    // Update DOM immediately
    const root = document.documentElement

    if (nextTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(STORAGE_KEY, nextTheme)

    if (!token) return

    try {
      await settingsService.updateSettings({
        darkMode: nextTheme === 'dark',
      })
    } catch (err) {
      console.error(err)

      setThemeState(previousTheme)

      if (previousTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      localStorage.setItem(STORAGE_KEY, previousTheme)

      toast.error('Unable to update theme')
    }
  }

  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (value) => {
    applyTheme(value === 'dark' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)