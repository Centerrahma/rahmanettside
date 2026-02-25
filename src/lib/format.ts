export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyWithSymbol(amount: number): string {
  return `${formatCurrency(amount)} kr`;
}
