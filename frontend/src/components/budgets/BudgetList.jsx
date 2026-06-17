import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatters'

export default function BudgetList({ budgets, onDelete, onEdit, spendingByBudget }) {
  if (!budgets.length) {
    return <EmptyState message="Create a monthly budget to track category spending." title="No budgets found" />
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const spent = spendingByBudget[budget._id] || 0
        const amount = Number(budget.amount)
        const percent = amount ? Math.min(Math.round((spent / amount) * 100), 999) : 0
        const exceeded = spent > amount

        return (
          <div className="rounded-2xl bg-slate-50 p-4" key={budget._id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-950">{budget.category}</p>
                <p className="text-sm text-slate-500">
                  {budget.month} - {formatCurrency(spent)} spent of {formatCurrency(amount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onEdit(budget)} variant="secondary">
                  Edit
                </Button>
                <Button onClick={() => onDelete(budget._id)} variant="danger">
                  Delete
                </Button>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full ${exceeded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
            <p className={`mt-2 text-sm font-semibold ${exceeded ? 'text-rose-600' : 'text-emerald-700'}`}>
              {percent}% used {exceeded ? '- budget exceeded' : ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}
