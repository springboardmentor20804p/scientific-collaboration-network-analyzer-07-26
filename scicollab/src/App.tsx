import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/Toast'
import CollaborationManagement from './pages/CollaborationManagement'

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" fill="white"/>
                <circle cx="2.5" cy="4" r="1.5" fill="white" opacity="0.7"/>
                <circle cx="13.5" cy="4" r="1.5" fill="white" opacity="0.7"/>
                <circle cx="2.5" cy="12" r="1.5" fill="white" opacity="0.7"/>
                <circle cx="13.5" cy="12" r="1.5" fill="white" opacity="0.7"/>
                <line x1="8" y1="8" x2="2.5" y2="4" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="8" y1="8" x2="13.5" y2="4" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="8" y1="8" x2="2.5" y2="12" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="8" y1="8" x2="13.5" y2="12" stroke="white" strokeWidth="1" opacity="0.5"/>
              </svg>
            </div>
            <div>
              <p className="font-display text-sm text-[#0F172A] leading-none">SciCollab</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] leading-none mt-0.5">Collaboration Management Module</p>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]">
              <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                SC
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#0F172A]">Dr. Sarah Chen</p>
                <p className="text-[10px] text-[#64748B]">Lead Researcher & Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="overflow-auto">
          <CollaborationManagement role="admin" />
        </main>

        <ToastContainer />
      </div>
    </ToastProvider>
  )
}
