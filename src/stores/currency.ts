import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Currency } from '@/types'
import { useCurrencyStorage } from '@/composables/useCurrencyStorage'

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
  { code: 'PEN', symbol: 'S/', locale: 'es-PE' },
  { code: 'MXN', symbol: '$', locale: 'es-MX' },
  { code: 'COP', symbol: '$', locale: 'es-CO' },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR' },
  { code: 'ARS', symbol: '$', locale: 'es-AR' },
  { code: 'CAD', symbol: '$', locale: 'en-CA' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
  { code: 'AUD', symbol: '$', locale: 'en-AU' },
]

export const useCurrencyStore = defineStore('currency', () => {
  const { saveCurrency, loadCurrency } = useCurrencyStorage()
  const selectedCurrency = ref<Currency>(CURRENCIES[0])

  function setCurrency(code: string): void {
    const matchedCurrency = CURRENCIES.find((currency) => currency.code === code)
    if (!matchedCurrency) return

    selectedCurrency.value = matchedCurrency

    saveCurrency(code)
  }

  function loadFromStorage(): void {
    const storedCurrencyCode = loadCurrency()
    if (storedCurrencyCode) setCurrency(storedCurrencyCode)
  }

  return { selectedCurrency, setCurrency, loadFromStorage }
})
