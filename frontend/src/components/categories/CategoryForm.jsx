import { useEffect, useState } from 'react'
import Button from '../common/Button'
import FormField from '../common/FormField'

const emptyForm = { name: '', type: 'expense' }

export default function CategoryForm({ editingCategory, loading, onCancel, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setForm(editingCategory ? { name: editingCategory.name, type: editingCategory.type } : emptyForm)
  }, [editingCategory])

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitForm = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="grid gap-4 md:grid-cols-[1fr_220px_auto]" onSubmit={submitForm}>
      <FormField label="Category name" name="name" onChange={updateField} required value={form.name} />
      <FormField
        as="select"
        label="Type"
        name="type"
        onChange={updateField}
        options={[
          { label: 'Expense', value: 'expense' },
          { label: 'Income', value: 'income' },
        ]}
        value={form.type}
      />
      <div className="flex items-end gap-3">
        <Button disabled={loading} type="submit">
          {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
        </Button>
        {editingCategory && (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
