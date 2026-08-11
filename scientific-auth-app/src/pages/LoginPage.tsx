import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { RoleConfig } from '../components/RoleSelector'

interface LoginPageProps {
  selectedRole: RoleConfig
  email: string
  setEmail: (email: string) => void
  onLogin: (e: React.FormEvent) => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  selectedRole,
  email,
  setEmail,
  onLogin,
}) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const inputClass =
    'w-full py-2.5 bg-card border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors'

  return (
    <form onSubmit={onLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-4`}
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-10`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm mt-2 cursor-pointer"
      >
        Sign In as {selectedRole.label}
      </button>
    </form>
  )
}

export default LoginPage
