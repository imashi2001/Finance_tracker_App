import { useEffect, useMemo, useState } from 'react'
import { FiActivity, FiArrowDownCircle, FiArrowUpCircle, FiDollarSign } from 'react-icons/fi'
import api from '../api/axios'
import BudgetProgressChart from '../charts/BudgetProgressChart'
import ExpensePieChart from '../charts/ExpensePieChart'
import IncomeExpenseBarChart from '../charts/IncomeExpenseBarChart'
import Card from '../components/common/Card'
import PageHeader from '../components/common/PageHeader'
import BudgetWarnings from '../components/dashboard/BudgetWarnings'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import SummaryCard from '../components/dashboard/SummaryCard'
import { currentMonthKey, formatCurrency, monthKeyFromDate } from '../utils/formatters'

export default function Dashboard() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const [transactionResponse, budgetResponse, categoryResponse] = await Promise.all([
          api.get('/transactions'),
          api.get('/budgets'),
          api.get('/categories'),
        ])
        setTransactions(transactionResponse.data)
        setBudgets(budgetResponse.data)
        setCategories(categoryResponse.data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    const activeMonth = currentMonthKey()
    const activeBudgets = budgets.filter((budget) => budget.month === activeMonth)
    const budgetTotal = activeBudgets.reduce((sum, budget) => sum + Number(budget.amount), 0)
    const monthSpend = transactions
      .filter(
        (transaction) =>
          transaction.type === 'expense' && monthKeyFromDate(transaction.date) === activeMonth
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    return {
      balance: income - expenses,
      budgetUsage: budgetTotal ? Math.round((monthSpend / budgetTotal) * 100) : 0,
      expenses,
      income,
    }
  }, [budgets, transactions])

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        subtitle="Track income, expenses, budgets, categories, and spending warnings from one place."
        title="Dashboard"
      />

      {error && <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <Card>Loading dashboard...</Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={FiArrowUpCircle} label="Total income" value={formatCurrency(summary.income)} />
            <SummaryCard
              icon={FiArrowDownCircle}
              label="Total expenses"
              tone="rose"
              value={formatCurrency(summary.expenses)}
            />
            <SummaryCard icon={FiDollarSign} label="Current balance" tone="blue" value={formatCurrency(summary.balance)} />
            <SummaryCard icon={FiActivity} label="Budget usage" tone="slate" value={`${summary.budgetUsage}%`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950">Monthly income vs expense</h2>
                <p className="text-sm text-slate-500">Compare cash flow by month.</p>
              </div>
              <IncomeExpenseBarChart transactions={transactions} />
            </Card>
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950">Expense distribution</h2>
                <p className="text-sm text-slate-500">Spending grouped by category.</p>
              </div>
              <ExpensePieChart transactions={transactions} />
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950">Budget progress</h2>
                <p className="text-sm text-slate-500">Current month budget against real expenses.</p>
              </div>
              <BudgetProgressChart budgets={budgets} transactions={transactions} />
            </Card>
            <Card>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-950">Recent transactions</h2>
                <p className="text-sm text-slate-500">{categories.length} custom categories available.</p>
              </div>
              <RecentTransactions transactions={transactions} />
            </Card>
          </div>

          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-950">Budget warnings</h2>
              <p className="text-sm text-slate-500">Automatic alerts when current-month spending crosses limits.</p>
            </div>
            <BudgetWarnings budgets={budgets} transactions={transactions} />
          </Card>
        </div>
      )}
    </div>
  )
}
