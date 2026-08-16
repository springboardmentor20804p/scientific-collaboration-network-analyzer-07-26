import { Moon, Sun } from 'lucide-react'
import { PublicationProvider, usePublications } from './contexts/PublicationContext'
import PublicationsPage from './pages/PublicationsPage'
import Toast from './components/Toast'

function DarkModeToggle() {
  const { darkMode, toggleDark } = usePublications()
  return (
    <button
      id="dark-mode-toggle"
      onClick={toggleDark}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all hover:scale-105"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

function AppContent() {
  const { darkMode } = usePublications()
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <PublicationsPage />
        <DarkModeToggle />
        <Toast />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <PublicationProvider>
      <AppContent />
    </PublicationProvider>
  )
}
