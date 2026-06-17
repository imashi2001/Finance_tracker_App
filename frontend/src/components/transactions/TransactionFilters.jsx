import Button from '../common/Button'
import FormField from '../common/FormField'

export default function TransactionFilters({ categories, filters, onChange, onReset }) {
  const updateField = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <FormField
        as="select"
        label="Type"
        name="type"
        onChange={updateField}
        options={[
          { label: 'All types', value: '' },
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
        ]}
        value={filters.type}
      />
      <FormField
        as="select"
        label="Category"
        name="category"
        onChange={updateField}
        options={[
          { label: 'All categories', value: '' },
          ...categories.map((category) => ({ label: category.name, value: category.name })),
        ]}
        value={filters.category}
      />
      <FormField label="Start date" name="startDate" onChange={updateField} type="date" value={filters.startDate} />
      <FormField label="End date" name="endDate" onChange={updateField} type="date" value={filters.endDate} />
      <div className="flex items-end">
        <Button className="w-full" onClick={onReset} variant="secondary">
          Reset filters
        </Button>
      </div>
    </div>
  )
}
