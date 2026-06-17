import { FiAlertTriangle } from 'react-icons/fi'
import { currentMonthKey, formatCurrency, monthKeyFromDate } from '../../utils/formatters'

export default function BudgetWarnings({ budgets, transactions }) {
  const activeMonth = currentMonthKey()
  const warnings = budgets
    .filter((budget) => budget.month === activeMonth)
    .map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === 'expense' &&
            transaction.category === budget.category &&
            monthKeyFromDate(transaction.date) === budget.month
        )
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

      return { ...budget, spent }
    })
    .filter((budget) => budget.spent > Number(budget.amount))

  if (!warnings.length) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
        All current-month budgets are within limit.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {warnings.map((budget) => (
        <div className="flex gap-3 rounded-2xl bg-rose-50 p-4 text-rose-700" key={budget._id}>
          <FiAlertTriangle className="mt-0.5 shrink-0" />
          <p className="text-sm">
            <span className="font-semibold">{budget.category}</span> is over budget by{' '}
            {formatCurrency(budget.spent - Number(budget.amount))}.
          </p>
        </div>
      ))}
    </div>
  )
}
