import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiCreditCard, FiGrid, FiPieChart, FiTag } from 'react-icons/fi'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: FiGrid },
  { label: 'Transactions', path: '/transactions', icon: FiCreditCard },
  { label: 'Budgets', path: '/budgets', icon: FiPieChart },
  { label: 'Categories', path: '/categories', icon: FiTag },
]

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white">
          <FiBarChart2 className="text-xl" />
        </div>
        <div>
          <p className="text-lg font-bold text-slate-950">FinanceFlow</p>
          <p className="text-xs text-slate-500">Budget tracker</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
              key={item.path}
              onClick={onNavigate}
              to={item.path}
            >
              <Icon className="text-lg" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Assignment MVP</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Track income, expenses, monthly budgets, and financial habits in one dashboard.
        </p>
      </div>
    </aside>
  )
}
