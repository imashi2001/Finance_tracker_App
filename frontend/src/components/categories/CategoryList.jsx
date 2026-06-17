import Button from '../common/Button'
import EmptyState from '../common/EmptyState'

export default function CategoryList({ categories, onDelete, onEdit, type }) {
  const filteredCategories = categories.filter((category) => category.type === type)

  if (!filteredCategories.length) {
    return <EmptyState message={`Add ${type} categories to organize transactions.`} title={`No ${type} categories`} />
  }

  return (
    <div className="space-y-3">
      {filteredCategories.map((category) => (
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3" key={category._id}>
          <div>
            <p className="font-semibold text-slate-900">{category.name}</p>
            <p className="text-xs capitalize text-slate-500">{category.type}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(category)} variant="secondary">
              Edit
            </Button>
            <Button onClick={() => onDelete(category._id)} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
