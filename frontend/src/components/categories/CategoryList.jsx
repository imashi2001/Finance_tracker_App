import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import EmptyState from '../common/EmptyState'

export default function CategoryList({ categories, onDelete, onEdit, type }) {
  const filteredCategories = categories.filter((category) => category.type === type)

  if (!filteredCategories.length) {
    return <EmptyState message={`Add ${type} categories to organize transactions.`} title={`No ${type} categories`} />
  }

  const getCategoryEmoji = (name) => {
    const emojis = {
      'Food & Dining': '🍽️',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills & Utilities': '💡',
      'Entertainment': '🎬',
      'Health & Fitness': '💪',
      'Education': '🎓',
      'Salary': '💰',
      'Freelance': '💻',
      'Investment': '📈',
      'Gift': '🎁',
      'Other': '📌',
    }
    return emojis[name] || '📂'
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {filteredCategories.map((category) => (
        <div
          className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition flex items-center justify-between gap-3"
          key={category._id}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{getCategoryEmoji(category.name)}</div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-950 truncate">{category.name}</p>
              <p className="text-xs capitalize text-slate-500">
                {category.type === 'income' ? '💵 Income' : '💸 Expense'}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(category)}
              className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition"
              title="Edit"
            >
              <FiEdit2 className="text-lg" />
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="rounded-lg bg-rose-100 p-2 text-rose-700 hover:bg-rose-200 transition"
              title="Delete"
            >
              <FiTrash2 className="text-lg" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
