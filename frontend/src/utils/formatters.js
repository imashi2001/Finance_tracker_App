export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

export const currentMonthKey = () => new Date().toISOString().slice(0, 7)

export const monthKeyFromDate = (date) => new Date(date).toISOString().slice(0, 7)

export const toDateInputValue = (date) => {
  if (!date) return new Date().toISOString().slice(0, 10)
  return new Date(date).toISOString().slice(0, 10)
}
