import { FiLogOut, FiMenu } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick }) {
  const { logout, user } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 backdrop-blur md:h-20 md:px-8">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <FiMenu className="text-xl" />
        </button>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 hidden sm:block">Welcome back</p>
          <h2 className="text-sm md:text-lg font-bold text-slate-950 truncate">
            {user?.name || 'FinanceFlow User'}
          </h2>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-2.5 md:px-4 py-1.5 md:py-2 text-white font-medium text-sm hover:bg-primary-600 transition flex-shrink-0"
      >
        <FiLogOut className="text-lg" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  )
}
