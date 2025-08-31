const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 2,
})

export function formatCurrencyLKR(value) {
  const numeric = Number(value || 0)
  return lkrFormatter.format(numeric)
}


