import { useState } from 'react'
import type { Role } from '../../permissions/config'
import { authApi } from '../../services/auth'
import { useToast } from '../../context/ToastContext'

interface RegisterProps {
  onRegisterSuccess: (role: Role, user: any) => void
  onGoLogin: () => void
}

const ROLES: { id: Role; label: string; desc: string }[] = [
  { id: 'researcher', label: 'Researcher', desc: 'Conduct research, publish papers, link citations' },
  { id: 'institution', label: 'Institution Admin', desc: 'Manage departmental metrics, faculty accounts' },
  { id: 'reviewer', label: 'Reviewer', desc: 'Review manuscript submissions & peer reviews' },
  { id: 'admin', label: 'System Admin', desc: 'Full system management, audit logs, security' },
]

export default function Register({ onRegisterSuccess, onGoLogin }: RegisterProps) {
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role>('researcher')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await authApi.register({
        name,
        email,
        password,
        role: selectedRole,
      })
      localStorage.setItem('scicollab_token', res.access_token)
      localStorage.setItem('scicollab_user', JSON.stringify(res.user))

      showToast(`Account created as ${selectedRole}!`, 'success')
      onRegisterSuccess(selectedRole, res.user)
    } catch (err: any) {
      // No demo fallback: every session requires a valid backend token.
      const detail = err?.response?.data?.detail
      showToast(typeof detail === 'string' ? detail : 'Unable to create account. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="auth-panel-left auth-panel-left--narrow">
        {/* Dot-grid texture */}
        <div className="auth-dot-grid" />

        {/* Decorative shapes — all contained within left panel */}
        {/* Dashed rotating ring */}
        <div className="auth-shape-ring">
          <svg className="auth-ring-svg" viewBox="0 0 240 240" fill="none">
            <circle cx="120" cy="120" r="110" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.45" />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0052FF" />
                <stop offset="1" stopColor="#4D7CFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Filled accent circle */}
        <div className="auth-shape-circle" />

        {/* Rounded rectangle accent block */}
        <div className="auth-shape-rect" />

        {/* Small filled square */}
        <div className="auth-shape-square" />

        {/* Large soft glow blob */}
        <div className="auth-shape-blob" />

        <div className="auth-content">
          <div className="auth-logo auth-logo--tight">
            <div className="auth-logo-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="6" r="3" fill="white" />
                <circle cx="4.5" cy="17" r="3" fill="white" />
                <circle cx="19.5" cy="17" r="3" fill="white" />
                <line x1="12" y1="9" x2="4.5" y2="14" stroke="white" strokeWidth="1.8" />
                <line x1="12" y1="9" x2="19.5" y2="14" stroke="white" strokeWidth="1.8" />
                <line x1="7.5" y1="17" x2="16.5" y2="17" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="auth-logo-text">
              <span className="auth-logo-dot">·</span> SciCollab
            </span>
          </div>

          <h1 className="auth-heading auth-heading--sm">
            Shape<br />
            <span className="gradient-text">Your Future.</span>
          </h1>

          <p className="auth-subtitle auth-subtitle--tighter">
            Join thousands of researchers and institutions working together across the global scientific network.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="auth-panel-right auth-panel-right--tight">
        <div className="auth-card-wrap auth-card-wrap--wide">
          <div className="auth-card">
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-subtitle auth-card-subtitle--tight">Select your role and create your account</p>

            <form onSubmit={handleSubmit} className="auth-form auth-form--tight">
              {/* Role Selector */}
              <div>
                <label className="auth-field-label auth-field-label--sm">
                  Select Account Role
                </label>
                <div className="auth-role-grid">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`auth-role-btn ${selectedRole === r.id ? 'auth-role-btn--active' : ''}`}
                    >
                      <p className={`auth-role-label ${selectedRole === r.id ? 'auth-role-label--active' : ''}`}>
                        {r.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="auth-field-label auth-field-label--sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Dr. Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input auth-input--sm"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="auth-field-label auth-field-label--sm">Email address</label>
                <input
                  type="email"
                  placeholder="s.chen@mit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input auth-input--sm"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="auth-field-label auth-field-label--sm">Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input auth-input--sm"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="auth-submit auth-submit--sm">
                {loading ? 'Creating Account...' : `Register & Enter as ${ROLES.find(r => r.id === selectedRole)?.label}`}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 5l4 3-4 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <p className="auth-footer auth-footer--tight">
              Already have an account?{' '}
              <button onClick={onGoLogin} className="auth-link auth-link--lg">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
