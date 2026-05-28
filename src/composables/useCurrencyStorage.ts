const STORAGE_KEY = 'earnings-counter:currency'

export function useCurrencyStorage() {
  function saveCurrency(code: string): void {
    localStorage.setItem(STORAGE_KEY, code)
  }

  function loadCurrency(): string | null {
    const storedCurrencyCode = localStorage.getItem(STORAGE_KEY)
    if (!storedCurrencyCode) return null

    return storedCurrencyCode
  }

  return { saveCurrency, loadCurrency }
}
