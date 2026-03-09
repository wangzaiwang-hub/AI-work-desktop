'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'sandbox_security_enabled'
const SANDBOX_PATH_KEY = 'sandbox_path'

interface SandboxSecurityContextValue {
  /** Whether sandbox-only mode is enabled (default: true) */
  enabled: boolean
  /** Toggle sandbox security on/off */
  setEnabled: (v: boolean) => void
  /** The configured sandbox path */
  sandboxPath: string
  /** Update the sandbox path (also persists to localStorage) */
  setSandboxPath: (path: string) => void
  /** Whether sandbox is properly configured */
  isConfigured: boolean
}

const SandboxSecurityContext = createContext<SandboxSecurityContextValue>({
  enabled: true,
  setEnabled: () => {},
  sandboxPath: '',
  setSandboxPath: () => {},
  isConfigured: false,
})

export function SandboxSecurityProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(true)
  const [sandboxPath, setSandboxPath] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    // Default to true if not set
    setEnabledState(saved === null ? true : saved === 'true')

    const path = localStorage.getItem(SANDBOX_PATH_KEY)
    if (path && !path.startsWith('['))
      setSandboxPath(path)

    // Listen for sandbox path changes from other components
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SANDBOX_PATH_KEY && e.newValue && !e.newValue.startsWith('['))
        setSandboxPath(e.newValue)
      if (e.key === STORAGE_KEY)
        setEnabledState(e.newValue === null ? true : e.newValue === 'true')
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v)
    localStorage.setItem(STORAGE_KEY, String(v))
  }, [])

  const updateSandboxPath = useCallback((path: string) => {
    setSandboxPath(path)
    localStorage.setItem(SANDBOX_PATH_KEY, path)
  }, [])

  const value = useMemo<SandboxSecurityContextValue>(() => ({
    enabled,
    setEnabled,
    sandboxPath,
    setSandboxPath: updateSandboxPath,
    isConfigured: !!sandboxPath,
  }), [enabled, setEnabled, sandboxPath, updateSandboxPath])

  return (
    <SandboxSecurityContext.Provider value={value}>
      {children}
    </SandboxSecurityContext.Provider>
  )
}

export const useSandboxSecurity = () => useContext(SandboxSecurityContext)
