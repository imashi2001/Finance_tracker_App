import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../components/common/EmptyState'
import { formatCurrency, monthKeyFromDate } from '../utils/formatters'

export default function IncomeExpenseBarChart({ transactions }) {
  const monthlyData = Object.values(
    transactions.reduce((groups, transaction) => {
      const month = monthKeyFromDate(transaction.date)
      groups[month] = groups[month] || { month, income: 0, expense: 0 }
      groups[month][transaction.type] += Number(transaction.amount)
      return groups
    }, {})
  ).sort((a, b) => a.month.localeCompare(b.month))

  if (!monthlyData.length) {
    return <EmptyState message="Add income and expense transactions to compare monthly totals." title="No chart data" />
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} />
          <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="income" fill="#059669" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
