import { useEffect, useState } from 'react'
import { TOKEN_KEYS } from '../config/constants'

const DEFAULT_THEME = 'light'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(TOKEN_KEYS.theme) || DEFAULT_THEME
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(TOKEN_KEYS.theme, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return {
    theme,
    toggleTheme,
  }
}
