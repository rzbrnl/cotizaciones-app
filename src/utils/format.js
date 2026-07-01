export function formatCurrency(num) {
  return '$' + Number(num || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return dateStr.toUpperCase()
}

export function generateId() {
  return Date.now() + Math.random().toString(36).slice(2, 7)
}
