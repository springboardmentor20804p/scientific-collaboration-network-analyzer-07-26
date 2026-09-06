import React, { useState } from 'react';
import { Eye, EyeOff, FlaskConical } from 'lucide-react';
import type { Role } from '../context/RoleContext';

interface LoginProps {
  onLogin: (role: Role) => void;
  onRegister: () => void;
}

interface RoleConfig {
  label: Role;
  description: string;
  color: string;
  email: string;
}

const ROLES: RoleConfig[] = [
  {
    label: 'Researcher',
    description: 'Individual researcher access',
    color: '#2B6CB0',
    email: 'schen@mit.edu',
  },
  {
    label: 'Institution Admin',
    description: 'Manage your institution',
    color: '#1F7A6C',
    email: 'admin@mit.edu',
  },
  {
    label: 'System Admin',
    description: 'Full platform control',
    color: '#C0392B',
    email: 'sysadmin@scna.edu',
  },
  {
    label: 'Reviewer',
    description: 'Review submissions',
    color: '#6B46C1',
    email: 'reviewer@scna.edu',
  },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('Researcher');
  const [email, setEmail] = useState<string>(ROLES[0].email);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleRoleSelect = (role: RoleConfig) => {
    setSelectedRole(role.label);
    setEmail(role.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };


  return (
    <div className="login-page">
      {/* Dot overlay */}
      <div className="dot-overlay" aria-hidden="true" />

      {/* Logo Block */}
      <div className="logo-block">
        <div className="logo-badge">
          <FlaskConical size={26} color="#ffffff" strokeWidth={2} />
        </div>
        <span className="logo-appname">SciCollab</span>
        <span className="logo-tagline">Scientific Collaboration Network Analyzer</span>
      </div>

      {/* Card */}
      <div className="card login-card">
        {/* Heading */}
        <div className="login-heading-block">
          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subtext">Sign in to your research account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Role Selector */}
          <div className="role-section">
            <p className="field-label role-section-label">SIGN IN AS</p>
            <div className="role-grid">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.label;
                return (
                  <button
                    key={role.label}
                    type="button"
                    className={`role-card${isSelected ? ' role-card--selected' : ''}`}
                    style={
                      isSelected
                        ? {
                            borderColor: role.color,
                            backgroundColor: hexToRgba(role.color, 0.08),
                          }
                        : {}
                    }
                    onClick={() => handleRoleSelect(role)}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="role-dot"
                      style={{
                        backgroundColor: isSelected ? role.color : '#CBD5E0',
                      }}
                    />
                    <span className="role-info">
                      <span
                        className="role-label"
                        style={isSelected ? { color: role.color, fontWeight: 700 } : {}}
                      >
                        {role.label}
                      </span>
                      <span className="role-desc">{role.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Field */}
          <div className="field-group">
            <label htmlFor="login-email" className="field-label">
              EMAIL ADDRESS
            </label>
            <input
              id="login-email"
              type="email"
              className="field-input"
              placeholder="you@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="field-group">
            <label htmlFor="login-password" className="field-label">
              PASSWORD
            </label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={17} strokeWidth={1.8} />
                ) : (
                  <Eye size={17} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot-row">
            <button type="button" className="forgot-link">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary login-submit">
            Log In as {selectedRole}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          {/* Footer */}
          <p className="login-footer">
            Don't have an account?{' '}
            <button type="button" className="register-link" onClick={onRegister}>
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
