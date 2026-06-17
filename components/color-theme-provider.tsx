"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type ColorTheme = "default" | "noir" | "rose" | "lavande"

type ColorThemeContextType = {
  theme: ColorTheme
  setTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = createContext<ColorThemeContextType | null>(null)

const STORAGE_KEY = "tave-color-theme"

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>("default")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorTheme | null
    if (stored && ["default", "noir", "rose", "lavande"].includes(stored)) {
      applyTheme(stored)
      setThemeState(stored)
    }
  }, [])

  function applyTheme(t: ColorTheme) {
    document.documentElement.setAttribute("data-theme", t)
  }

  function setTheme(t: ColorTheme) {
    setThemeState(t)
    applyTheme(t)
    localStorage.setItem(STORAGE_KEY, t)
  }

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext)
  if (!ctx) throw new Error("useColorTheme must be used within a ColorThemeProvider")
  return ctx
}
