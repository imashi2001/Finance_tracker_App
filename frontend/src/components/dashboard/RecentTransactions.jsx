import EmptyState from '../common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function RecentTransactions({ transactions }) {
  const recent = transactions.slice(0, 5)

  if (!recent.length) {
    return <EmptyState message="Your latest transactions will appear here." title="No transactions yet" />
  }

  return (
    <div className="space-y-3">
      {recent.map((transaction) => (
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3" key={transaction._id}>
          <div>
            <p className="font-semibold text-slate-900">{transaction.title}</p>
            <p className="text-xs text-slate-500">
              {transaction.category} - {formatDate(transaction.date)}
            </p>
          </div>
          <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      ))}
    </div>
  )
}
