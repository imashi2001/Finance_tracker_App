import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import EmptyState from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatters'

export default function BudgetList({ budgets, onDelete, onEdit, spendingByBudget }) {
  if (!budgets.length) {
    return <EmptyState message="Create a monthly budget to track category spending." title="No budgets found" />
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills & Utilities': '💡',
      'Entertainment': '🎬',
      'Health & Fitness': '💪',
      'Education': '🎓',
      'Salary': '💰',
    }
    return icons[category] || '📂'
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = spendingByBudget[budget._id] || 0
        const amount = Number(budget.amount)
        const percent = amount ? Math.min(Math.round((spent / amount) * 100), 999) : 0
        const exceeded = spent > amount

        return (
          <div
            className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition"
            key={budget._id}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1 text-2xl">{getCategoryIcon(budget.category)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-950 truncate">{budget.category}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{budget.month}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(budget)}
                  className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => onDelete(budget._id)}
                  className="rounded-lg bg-rose-100 p-2 text-rose-700 hover:bg-rose-200 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">{formatCurrency(spent)}</span> of{' '}
                  {formatCurrency(amount)}
                </span>
                <span className={`font-bold ${exceeded ? 'text-rose-600' : 'text-primary-600'}`}>
                  {percent}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    exceeded ? 'bg-expense' : 'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>

              {exceeded && (
                <p className="text-xs font-medium text-rose-600">
                  ⚠️ Budget exceeded by {formatCurrency(spent - amount)}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
