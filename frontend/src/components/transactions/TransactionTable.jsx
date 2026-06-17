import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function TransactionTable({ onDelete, onEdit, transactions }) {
  if (!transactions.length) {
    return <EmptyState message="Add your first transaction or adjust filters." title="No transactions found" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead>
          <tr className="text-slate-500">
            <th className="py-3 pr-4 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{transaction.title}</p>
                {transaction.note && <p className="text-xs text-slate-500">{transaction.note}</p>}
              </td>
              <td className="px-4 py-4 text-slate-600">{transaction.category}</td>
              <td className="px-4 py-4 text-slate-600">{formatDate(transaction.date)}</td>
              <td className="px-4 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    transaction.type === 'income'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-4 py-4 text-right font-bold text-slate-950">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="py-4 pl-4">
                <div className="flex justify-end gap-2">
                  <Button onClick={() => onEdit(transaction)} variant="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => onDelete(transaction._id)} variant="danger">
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
