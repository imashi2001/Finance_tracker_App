import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import EmptyState from '../components/common/EmptyState'
import { formatCurrency } from '../utils/formatters'

const colors = ['#059669', '#2563eb', '#f97316', '#7c3aed', '#e11d48', '#0891b2']

export default function ExpensePieChart({ transactions }) {
  const data = Object.values(
    transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((groups, transaction) => {
        const key = transaction.category || 'Other'
        groups[key] = groups[key] || { name: key, value: 0 }
        groups[key].value += Number(transaction.amount)
        return groups
      }, {})
  )

  if (!data.length) {
    return <EmptyState message="Add expense transactions to see category distribution." title="No expense data" />
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} key={entry.name} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
