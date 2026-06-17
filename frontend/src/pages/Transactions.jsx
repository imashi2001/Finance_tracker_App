import { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import Card from '../components/common/Card'
import PageHeader from '../components/common/PageHeader'
import TransactionFilters from '../components/transactions/TransactionFilters'
import TransactionForm from '../components/transactions/TransactionForm'
import TransactionTable from '../components/transactions/TransactionTable'

const emptyFilters = {
  category: '',
  type: '',
  startDate: '',
  endDate: '',
}

export default function Transactions() {
  const [categories, setCategories] = useState([])
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [transactions, setTransactions] = useState([])

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
      const { data } = await api.get('/transactions', { params })
      setTransactions(data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await api.get('/categories')
      setCategories(data)
    }

    loadCategories().catch(() => setCategories([]))
  }, [])

  const saveTransaction = async (payload) => {
    setSaving(true)
    setError('')

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, payload)
      } else {
        await api.post('/transactions', payload)
      }

      setEditingTransaction(null)
      await loadTransactions()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to save transaction.')
    } finally {
      setSaving(false)
    }
  }

  const deleteTransaction = async (id) => {
    if (!window.confirm('Delete this transaction?')) return

    try {
      await api.delete(`/transactions/${id}`)
      await loadTransactions()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to delete transaction.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Money movement"
        subtitle="Add, edit, delete, and filter income or expense records."
        title="Transactions"
      />

      {error && <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950">
            {editingTransaction ? 'Edit transaction' : 'Add transaction'}
          </h2>
          <TransactionForm
            categories={categories}
            editingTransaction={editingTransaction}
            loading={saving}
            onCancel={() => setEditingTransaction(null)}
            onSubmit={saveTransaction}
          />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950">Filters</h2>
          <TransactionFilters
            categories={categories}
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(emptyFilters)}
          />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Transaction list</h2>
            {loading && <p className="text-sm text-slate-500">Loading...</p>}
          </div>
          <TransactionTable
            onDelete={deleteTransaction}
            onEdit={setEditingTransaction}
            transactions={transactions}
          />
        </Card>
      </div>
    </div>
  )
}
