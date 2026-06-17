import { useCallback, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import Card from '../components/common/Card'
import FormField from '../components/common/FormField'
import PageHeader from '../components/common/PageHeader'
import BudgetForm from '../components/budgets/BudgetForm'
import BudgetList from '../components/budgets/BudgetList'
import { currentMonthKey, monthKeyFromDate } from '../utils/formatters'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [editingBudget, setEditingBudget] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [month, setMonth] = useState(currentMonthKey())
  const [saving, setSaving] = useState(false)
  const [transactions, setTransactions] = useState([])

  const loadBudgets = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [budgetResponse, categoryResponse, transactionResponse] = await Promise.all([
        api.get('/budgets', { params: month ? { month } : {} }),
        api.get('/categories'),
        api.get('/transactions'),
      ])
      setBudgets(budgetResponse.data)
      setCategories(categoryResponse.data)
      setTransactions(transactionResponse.data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to load budgets.')
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  const spendingByBudget = useMemo(
    () =>
      budgets.reduce((groups, budget) => {
        groups[budget._id] = transactions
          .filter(
            (transaction) =>
              transaction.type === 'expense' &&
              transaction.category === budget.category &&
              monthKeyFromDate(transaction.date) === budget.month
          )
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

        return groups
      }, {}),
    [budgets, transactions]
  )

  const saveBudget = async (payload) => {
    setSaving(true)
    setError('')

    try {
      if (editingBudget) {
        await api.put(`/budgets/${editingBudget._id}`, payload)
      } else {
        await api.post('/budgets', payload)
      }

      setEditingBudget(null)
      await loadBudgets()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to save budget.')
    } finally {
      setSaving(false)
    }
  }

  const deleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return

    try {
      await api.delete(`/budgets/${id}`)
      await loadBudgets()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to delete budget.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Planning"
        subtitle="Create monthly category budgets and monitor actual spending progress."
        title="Budgets"
      />

      {error && <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950">{editingBudget ? 'Edit budget' : 'Add budget'}</h2>
          <BudgetForm
            categories={categories}
            editingBudget={editingBudget}
            loading={saving}
            onCancel={() => setEditingBudget(null)}
            onSubmit={saveBudget}
          />
        </Card>

        <Card>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Monthly budgets</h2>
              <p className="text-sm text-slate-500">Use the month filter to review different budget periods.</p>
            </div>
            <div className="w-full sm:w-56">
              <FormField label="Filter month" name="month" onChange={(event) => setMonth(event.target.value)} type="month" value={month} />
            </div>
          </div>
          {loading && <p className="mb-3 text-sm text-slate-500">Loading...</p>}
          <BudgetList
            budgets={budgets}
            onDelete={deleteBudget}
            onEdit={setEditingBudget}
            spendingByBudget={spendingByBudget}
          />
        </Card>
      </div>
    </div>
  )
}
