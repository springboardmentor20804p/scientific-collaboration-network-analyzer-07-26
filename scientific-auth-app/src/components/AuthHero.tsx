import React from 'react'
import { ChevronRight } from 'lucide-react'

const features = [
  'Manage Publications',
  'Track Citations',
  'Collaborate Globally',
  'Analyze Impact',
]

export const AuthHero: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-[45%] auth-gradient flex-col justify-between p-12 relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-1/3 left-[-40px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/10 shadow-sm">
            <svg viewBox="0 0 34 34" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="17" cy="17" r="4" fill="white" />
              <ellipse cx="17" cy="17" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
              <ellipse cx="17" cy="17" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" transform="rotate(60 17 17)" />
              <ellipse cx="17" cy="17" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" transform="rotate(120 17 17)" />
              <circle cx="33" cy="17" r="2.5" fill="white" />
              <circle cx="9" cy="5.5" r="2.5" fill="white" opacity="0.8" />
              <circle cx="9" cy="28.5" r="2.5" fill="white" opacity="0.6" />
            </svg>
            <span className="text-white font-bold text-xl tracking-tight">Scientific</span>
          </div>
        </div>

        <h1 className="text-white text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Academic Research<br />Management Platform
        </h1>
        <p className="text-white/80 text-lg mb-12 max-w-md font-normal leading-relaxed">
          Empowering researchers worldwide to discover, share, and collaborate on groundbreaking science.
        </p>

        <ul className="space-y-4">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3.5 text-white/95 group">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <ChevronRight size={14} className="text-white" />
              </div>
              <span className="text-base font-medium">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics footer */}
      <div className="relative z-10 pt-8 border-t border-white/10">
        <div className="flex flex-wrap gap-4 text-white/80 text-sm font-medium tracking-wide">
          <span>50,000+ Researchers</span>
          <span>·</span>
          <span>120+ Countries</span>
          <span>·</span>
          <span>2M+ Publications</span>
        </div>
      </div>
    </div>
  )
}

export default AuthHero
