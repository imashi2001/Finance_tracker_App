import { useEffect, useState } from 'react'
import api from '../api/axios'
import Card from '../components/common/Card'
import PageHeader from '../components/common/PageHeader'
import CategoryForm from '../components/categories/CategoryForm'
import CategoryList from '../components/categories/CategoryList'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/categories')
      setCategories(data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const saveCategory = async (payload) => {
    setSaving(true)
    setError('')

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload)
      } else {
        await api.post('/categories', payload)
      }

      setEditingCategory(null)
      await loadCategories()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Existing transactions keep their category text.')) return

    try {
      await api.delete(`/categories/${id}`)
      await loadCategories()
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to delete category.')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Organization"
        subtitle="Create separate income and expense categories for cleaner reporting."
        title="Categories"
      />

      {error && <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-slate-950">
            {editingCategory ? 'Edit category' : 'Add category'}
          </h2>
          <CategoryForm
            editingCategory={editingCategory}
            loading={saving}
            onCancel={() => setEditingCategory(null)}
            onSubmit={saveCategory}
          />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">Expense categories</h2>
              {loading && <p className="text-sm text-slate-500">Loading...</p>}
            </div>
            <CategoryList
              categories={categories}
              onDelete={deleteCategory}
              onEdit={setEditingCategory}
              type="expense"
            />
          </Card>
          <Card>
            <h2 className="mb-4 text-lg font-bold text-slate-950">Income categories</h2>
            <CategoryList
              categories={categories}
              onDelete={deleteCategory}
              onEdit={setEditingCategory}
              type="income"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
