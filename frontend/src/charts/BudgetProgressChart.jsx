import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../components/common/EmptyState'
import { currentMonthKey, formatCurrency, monthKeyFromDate } from '../utils/formatters'

export default function BudgetProgressChart({ budgets, transactions }) {
  const activeMonth = currentMonthKey()
  const data = budgets
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

      return {
        category: budget.category,
        budget: Number(budget.amount),
        spent,
      }
    })

  if (!data.length) {
    return <EmptyState message="Create budgets for the current month to monitor spending progress." title="No budgets yet" />
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis tickFormatter={(value) => `$${value}`} type="number" />
          <YAxis dataKey="category" tickLine={false} type="category" width={90} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="budget" fill="#bfdbfe" radius={[0, 8, 8, 0]} />
          <Bar dataKey="spent" fill="#059669" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
