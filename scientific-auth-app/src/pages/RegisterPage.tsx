import React, { useState } from 'react'
import { User, Mail, Building2, Lock, Eye, EyeOff } from 'lucide-react'
import { RoleConfig } from '../components/RoleSelector'

interface RegisterPageProps {
  selectedRole: RoleConfig
  email: string
  setEmail: (email: string) => void
  onRegister: (e: React.FormEvent) => void
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  selectedRole,
  email,
  setEmail,
  onRegister,
}) => {
  const [name, setName] = useState('')
  const [institution, setInstitution] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const RoleIcon = selectedRole.icon

  const inputClass =
    'w-full py-2.5 bg-card border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors'

  return (
    <form onSubmit={onRegister} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-4`}
            placeholder="Dr. Jane Smith"
          />
        </div>
      </div>

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
        <label className="block text-sm font-medium text-foreground mb-1.5">Institution</label>
        <div className="relative">
          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-4`}
            placeholder="MIT, Stanford, ETH Zurich, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
        <div className="flex items-center gap-2 px-3 py-2.5 bg-card border border-border rounded-xl">
          <RoleIcon size={16} className={selectedRole.color} />
          <span className="text-sm font-medium text-foreground">{selectedRole.label}</span>
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
            placeholder="Create a password"
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

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-10`}
            placeholder="Repeat password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
            tabIndex={-1}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm mt-2 cursor-pointer"
      >
        Create Account
      </button>
    </form>
  )
}

export default RegisterPage
