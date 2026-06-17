import { useEffect, useMemo, useState } from 'react'
import Button from '../common/Button'
import FormField from '../common/FormField'
import { currentMonthKey } from '../../utils/formatters'

const emptyForm = {
  category: '',
  amount: '',
  month: currentMonthKey(),
}

export default function BudgetForm({ categories, editingBudget, loading, onCancel, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories]
  )

  useEffect(() => {
    setForm(
      editingBudget
        ? {
            category: editingBudget.category,
            amount: editingBudget.amount,
            month: editingBudget.month,
          }
        : emptyForm
    )
  }, [editingBudget])

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const submitForm = (event) => {
    event.preventDefault()
    onSubmit({ ...form, amount: Number(form.amount) })
  }

  return (
    <form className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto]" onSubmit={submitForm}>
      {expenseCategories.length ? (
        <FormField
          as="select"
          label="Category"
          name="category"
          onChange={updateField}
          options={[
            { label: 'Select category', value: '' },
            ...expenseCategories.map((category) => ({ label: category.name, value: category.name })),
          ]}
          required
          value={form.category}
        />
      ) : (
        <FormField
          label="Category"
          name="category"
          onChange={updateField}
          placeholder="Example: Rent"
          required
          value={form.category}
        />
      )}
      <FormField
        label="Amount"
        min="0.01"
        name="amount"
        onChange={updateField}
        required
        step="0.01"
        type="number"
        value={form.amount}
      />
      <FormField label="Month" name="month" onChange={updateField} required type="month" value={form.month} />
      <div className="flex items-end gap-3">
        <Button disabled={loading} type="submit">
          {loading ? 'Saving...' : editingBudget ? 'Update' : 'Add'}
        </Button>
        {editingBudget && (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
