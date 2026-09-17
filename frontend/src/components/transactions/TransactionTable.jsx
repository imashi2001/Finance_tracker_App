import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import EmptyState from '../common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function TransactionTable({ onDelete, onEdit, transactions }) {
  if (!transactions.length) {
    return <EmptyState message="Add your first transaction or adjust filters." title="No transactions found" />
  }

  const getCategoryColor = (type) => {
    return type === 'income' 
      ? 'bg-income/10 text-income' 
      : 'bg-expense/10 text-expense'
  }

  return (
    <div className="space-y-3">
      {/* Mobile Card View */}
      <div className="md:hidden">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-950">{transaction.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type}
                  </span>
                </div>
                {transaction.note && (
                  <p className="mt-1 text-sm text-slate-500">{transaction.note}</p>
                )}
                <div className="mt-2 flex gap-3 text-xs text-slate-500">
                  <span>{transaction.category}</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-950">
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition"
              >
                <FiEdit2 className="text-lg" />
                Edit
              </button>
              <button
                onClick={() => onDelete(transaction._id)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200 transition"
              >
                <FiTrash2 className="text-lg" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-bold text-slate-950">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-4 pl-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(transaction._id)}
                      className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
