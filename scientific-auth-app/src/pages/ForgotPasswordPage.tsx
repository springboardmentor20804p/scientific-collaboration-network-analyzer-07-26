import React, { useState } from 'react'
import { Mail } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    setForgotSent(true)
  }

  const inputClass =
    'w-full py-2.5 bg-card border border-border rounded-xl text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors'

  if (forgotSent) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Check your inbox</h3>
        <p className="text-muted-foreground text-sm">
          A reset link has been sent to <strong>{forgotEmail}</strong>.
        </p>
        <button
          onClick={() => {
            setForgotSent(false)
            setForgotEmail('')
          }}
          className="mt-4 text-sm text-primary hover:underline font-medium cursor-pointer"
        >
          Try a different email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleForgot} className="space-y-4">
      <p className="text-muted-foreground text-sm mb-2">
        Enter your email address and we will send you a link to reset your password.
      </p>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            className={`${inputClass} pl-9 pr-4`}
            placeholder="your@email.com"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-2.5 bg-primary hover:bg-primary/90 active:scale-[0.99] text-primary-foreground rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm cursor-pointer"
      >
        Send Reset Link
      </button>
    </form>
  )
}

export default ForgotPasswordPage
