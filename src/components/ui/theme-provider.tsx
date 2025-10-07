import * as React from "react"

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
  enableSystem?: boolean
}

// Minimal theme provider that simply renders children.
// This replaces the dependency on next-themes to avoid runtime context issues.
export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}