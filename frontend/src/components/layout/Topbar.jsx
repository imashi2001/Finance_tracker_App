import { FiLogOut, FiMenu } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

export default function Topbar({ onMenuClick }) {
  const { logout, user } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <FiMenu className="text-xl" />
        </button>
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h2 className="text-lg font-bold text-slate-950">{user?.name || 'FinanceFlow User'}</h2>
        </div>
      </div>

      <Button onClick={logout} variant="secondary">
        <FiLogOut />
        Logout
      </Button>
    </header>
  )
}
