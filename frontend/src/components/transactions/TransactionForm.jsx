import { useEffect, useMemo, useState } from 'react'
import Button from '../common/Button'
import FormField from '../common/FormField'
import { toDateInputValue } from '../../utils/formatters'

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: toDateInputValue(),
  note: '',
}

export default function TransactionForm({ categories, editingTransaction, loading, onCancel, onSubmit }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: toDateInputValue(editingTransaction.date),
        note: editingTransaction.note || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [editingTransaction])

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type]
  )

  const updateField = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }))
  }

  const submitForm = (event) => {
    event.preventDefault()
    onSubmit({ ...form, amount: Number(form.amount) })
  }

  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={submitForm}>
      <FormField label="Title" name="title" onChange={updateField} required value={form.title} />
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
      {categoryOptions.length ? (
        <FormField
          as="select"
          label="Category"
          name="category"
          onChange={updateField}
          options={[
            { label: 'Select category', value: '' },
            ...categoryOptions.map((category) => ({ label: category.name, value: category.name })),
          ]}
          required
          value={form.category}
        />
      ) : (
        <FormField
          label="Category"
          name="category"
          onChange={updateField}
          placeholder="Example: Salary, Food, Rent"
          required
          value={form.category}
        />
      )}
      <FormField label="Date" name="date" onChange={updateField} required type="date" value={form.date} />
      <FormField label="Note" name="note" onChange={updateField} placeholder="Optional note" value={form.note} />

      <div className="flex flex-wrap gap-3 lg:col-span-2">
        <Button disabled={loading} type="submit">
          {loading ? 'Saving...' : editingTransaction ? 'Update transaction' : 'Add transaction'}
        </Button>
        {editingTransaction && (
          <Button onClick={onCancel} type="button" variant="secondary">
            Cancel edit
          </Button>
        )}
      </div>
    </form>
  )
}
