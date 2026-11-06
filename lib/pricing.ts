export function formatPrice(amount?: number, text?: string, currency = 'EUR') {
  if (text?.trim()) return text.trim();
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return 'Na upit';
  const supportedCurrency = ['EUR', 'USD', 'GBP', 'CHF'].includes(currency) ? currency : 'EUR';
  return new Intl.NumberFormat('hr-HR', { style: 'currency', currency: supportedCurrency, minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
}
