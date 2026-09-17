import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiCreditCard, FiGrid, FiPieChart, FiUser } from 'react-icons/fi'

const navItems = [
  { label: 'Home', path: '/dashboard', icon: FiGrid },
  { label: 'Transactions', path: '/transactions', icon: FiCreditCard },
  { label: 'Analytics', path: '/budgets', icon: FiBarChart2 },
  { label: 'Budget', path: '/budgets', icon: FiPieChart },
  { label: 'Profile', path: '/categories', icon: FiUser },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-20 border-t border-slate-200 bg-white md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 transition ${
                isActive ? 'text-primary-600' : 'text-slate-600 hover:text-slate-900'
              }`
            }
            key={item.path}
            to={item.path}
          >
            <Icon className="text-2xl" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
