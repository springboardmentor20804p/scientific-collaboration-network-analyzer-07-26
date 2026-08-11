import React, { useState } from 'react'
import { Sun, Moon, ArrowLeft, CheckCircle } from 'lucide-react'
import AuthHero from './components/AuthHero'
import RoleSelector, { RoleConfig } from './components/RoleSelector'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

type TabKey = 'login' | 'register' | 'forgot'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null)
  const [tab, setTab] = useState<TabKey>('login')
  const [email, setEmail] = useState('')
  const [signedInUser, setSignedInUser] = useState<{ role: string; email: string } | null>(null)

  const toggleDark = () => setDarkMode((v) => !v)

  const handleSelectRole = (role: RoleConfig) => {
    setSelectedRole(role)
    setEmail(role.email)
    setTab('login')
  }

  const handleBack = () => {
    setSelectedRole(null)
    setTab('login')
  }

  const handleLoginSuccess = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    setSignedInUser({ role: selectedRole.label, email })
  }

  const handleRegisterSuccess = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    setSignedInUser({ role: selectedRole.label, email })
  }

  const handleSignOut = () => {
    setSignedInUser(null)
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Left panel - Hero showcase */}
      <AuthHero />

      {/* Right panel - Auth Forms */}
      <div className="flex-1 bg-background flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex justify-end p-4 sm:p-6">
          <button
            type="button"
            onClick={toggleDark}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          {signedInUser ? (
            <div className="text-center p-8 bg-card border border-border rounded-2xl shadow-lg max-w-md w-full">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back!</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Signed in as <span className="font-semibold text-foreground">{signedInUser.email}</span>
              </p>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-6">
                Role: {signedInUser.role}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Sign Out / Return to Auth
              </button>
            </div>
          ) : !selectedRole ? (
            <RoleSelector onSelectRole={handleSelectRole} />
          ) : (
            <div className="w-full max-w-lg">
              {/* Back button */}
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors font-medium cursor-pointer"
              >
                <ArrowLeft size={15} />
                Back to role selection
              </button>

              {/* Selected Role Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-lg ${selectedRole.iconBg} flex items-center justify-center`}>
                  <selectedRole.icon size={16} className={selectedRole.color} />
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${selectedRole.iconBg} ${selectedRole.color}`}>
                  {selectedRole.label}
                </span>
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-border mb-6">
                {(['login', 'register', 'forgot'] as TabKey[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`pb-3 px-1 mr-5 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${
                      tab === t
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : t === 'register' ? 'Register' : 'Forgot Password'}
                  </button>
                ))}
              </div>

              {/* Views */}
              {tab === 'login' && (
                <LoginPage
                  selectedRole={selectedRole}
                  email={email}
                  setEmail={setEmail}
                  onLogin={handleLoginSuccess}
                />
              )}

              {tab === 'register' && (
                <RegisterPage
                  selectedRole={selectedRole}
                  email={email}
                  setEmail={setEmail}
                  onRegister={handleRegisterSuccess}
                />
              )}

              {tab === 'forgot' && <ForgotPasswordPage />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
