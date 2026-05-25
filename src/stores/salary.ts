import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSalaryStorage } from '@/composables/useSalaryStorage'

export const useSalaryStore = defineStore('salary', () => {
  const { saveSalary, loadSalary } = useSalaryStorage()
  const monthlySalary = ref<number | null>(null)

  function setSalary(value: number): void {
    monthlySalary.value = value

    saveSalary(value)
  }

  function loadFromStorage(): void {
    monthlySalary.value = loadSalary()
  }

  return { monthlySalary, setSalary, loadFromStorage }
})
