import { useEffect, useMemo, useState } from 'react'
import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi'
import api from '../api/axios'
import BudgetProgressChart from '../charts/BudgetProgressChart'
import ExpensePieChart from '../charts/ExpensePieChart'
import IncomeExpenseBarChart from '../charts/IncomeExpenseBarChart'
import { useAuth } from '../context/AuthContext'
import BudgetWarnings from '../components/dashboard/BudgetWarnings'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import Card from '../components/common/Card'
import { currentMonthKey, formatCurrency, monthKeyFromDate } from '../utils/formatters'

export default function Dashboard() {
  const { user } = useAuth()
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div>
        <p className="text-sm font-medium text-slate-600">{getGreeting()},</p>
        <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">
          {user?.name || 'User'} 👋
        </h1>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <Card>Loading dashboard...</Card>
      ) : (
        <div className="space-y-6">
          {/* Main Balance Card */}
          <div className="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-8 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">Total Balance</p>
            <h2 className="text-4xl font-bold md:text-5xl">
              {formatCurrency(summary.balance)}
            </h2>
            <p className="mt-2 text-sm opacity-75">
              {summary.balance >= 0 ? 'Positive' : 'Negative'} balance
            </p>
          </div>

          {/* Income & Expense Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white px-4 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Income</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {formatCurrency(summary.income)}
                  </p>
                </div>
                <div className="rounded-full bg-income/10 p-3">
                  <FiArrowUpCircle className="text-xl text-income" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white px-4 py-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600">Expenses</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">
                    {formatCurrency(summary.expenses)}
                  </p>
                </div>
                <div className="rounded-full bg-expense/10 p-3">
                  <FiArrowDownCircle className="text-xl text-expense" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-4">
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-950">Expense Overview</h3>
                <p className="text-sm text-slate-500">Spending grouped by category.</p>
              </div>
              <ExpensePieChart transactions={transactions} />
            </Card>

            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-950">Income vs Expense</h3>
                <p className="text-sm text-slate-500">Monthly cash flow comparison.</p>
              </div>
              <IncomeExpenseBarChart transactions={transactions} />
            </Card>

            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-950">Budget Progress</h3>
                <p className="text-sm text-slate-500">Current month budget tracking.</p>
              </div>
              <BudgetProgressChart budgets={budgets} transactions={transactions} />
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Recent Transactions</h3>
                <p className="text-sm text-slate-500">Your latest activity.</p>
              </div>
            </div>
            <RecentTransactions transactions={transactions} />
          </Card>

          {/* Budget Warnings */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-950">Budget Warnings</h3>
              <p className="text-sm text-slate-500">Categories exceeding limits.</p>
            </div>
            <BudgetWarnings budgets={budgets} transactions={transactions} />
          </Card>
        </div>
      )}
    </div>
  )
}
