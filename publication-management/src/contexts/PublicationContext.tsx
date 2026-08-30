import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { publications as initialPublications } from '../data/publications'
import type { Publication } from '../data/publications'

interface Toast {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

interface PublicationContextState {
  publications: Publication[]
  darkMode: boolean
  toast: Toast | null
  toggleDark: () => void
  showToast: (message: string, type?: Toast['type']) => void
  addPublication: (p: Omit<Publication, 'id'>) => void
  updatePublication: (id: string, p: Partial<Publication>) => void
  deletePublication: (id: string) => void
}

const PublicationContext = createContext<PublicationContextState | null>(null)

export const usePublications = () => {
  const ctx = useContext(PublicationContext)
  if (!ctx) throw new Error('usePublications must be used within PublicationProvider')
  return ctx
}

export const PublicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>(initialPublications)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('pubmgmt-dark') === 'true'
    } catch {
      return false
    }
  })
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('pubmgmt-dark', String(darkMode))
    } catch {}
  }, [darkMode])

  const toggleDark = useCallback(() => setDarkMode((d) => !d), [])

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const genId = () => Math.random().toString(36).slice(2, 10)

  const addPublication = useCallback(
    (p: Omit<Publication, 'id'>) => {
      setPublications((prev) => [...prev, { ...p, id: genId() }])
      showToast('Publication added successfully!', 'success')
    },
    [showToast],
  )

  const updatePublication = useCallback(
    (id: string, p: Partial<Publication>) => {
      setPublications((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)))
      showToast('Publication updated!', 'success')
    },
    [showToast],
  )

  const deletePublication = useCallback(
    (id: string) => {
      setPublications((prev) => prev.filter((x) => x.id !== id))
      showToast('Publication removed.', 'warning')
    },
    [showToast],
  )

  return (
    <PublicationContext.Provider
      value={{
        publications,
        darkMode,
        toast,
        toggleDark,
        showToast,
        addPublication,
        updatePublication,
        deletePublication,
      }}
    >
      {children}
    </PublicationContext.Provider>
  )
}

export default PublicationContext
