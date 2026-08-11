import React from 'react'
import { BookOpen, Building2, ShieldCheck, Crown } from 'lucide-react'

export type RoleKey = 'researcher' | 'institution admin' | 'reviewer' | 'system admin'

export interface RoleConfig {
  key: RoleKey
  label: string
  description: string
  icon: React.ElementType
  color: string
  iconBg: string
  userCount: string
  email: string
}

export const ROLES: RoleConfig[] = [
  {
    key: 'researcher',
    label: 'Researcher',
    description: 'Manage publications & collaborate',
    icon: BookOpen,
    color: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    userCount: '2,450 users',
    email: 'sarah.chen@mit.edu',
  },
  {
    key: 'institution admin',
    label: 'Institution Admin',
    description: 'Oversee your institution',
    icon: Building2,
    color: 'text-purple-700 dark:text-purple-300',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    userCount: '380 users',
    email: 'j.wilson@stanford.edu',
  },
  {
    key: 'reviewer',
    label: 'Reviewer',
    description: 'Review submitted papers',
    icon: ShieldCheck,
    color: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    userCount: '1,120 users',
    email: 'm.rodriguez@ethz.ch',
  },
  {
    key: 'system admin',
    label: 'System Admin',
    description: 'Platform administration',
    icon: Crown,
    color: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    userCount: '12 users',
    email: 'a.thompson@scientific.app',
  },
]

interface RoleSelectorProps {
  onSelectRole: (role: RoleConfig) => void
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Scientific</h2>
        <p className="text-muted-foreground text-sm">Select your role to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => onSelectRole(role)}
              className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon size={20} className={role.color} />
              </div>
              <p className="font-semibold text-foreground text-sm mb-0.5">{role.label}</p>
              <p className="text-muted-foreground text-xs mb-2 leading-snug">{role.description}</p>
              <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${role.iconBg} ${role.color}`}>
                {role.userCount}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default RoleSelector
