const STORAGE_KEY = 'earnings-counter:salary'

export function useSalaryStorage() {
  function saveSalary(value: number): void {
    localStorage.setItem(STORAGE_KEY, String(value))
  }

  function loadSalary(): number | null {
    const storedSalaryString = localStorage.getItem(STORAGE_KEY)
    if (!storedSalaryString) return null

    const parsedSalaryValue = parseFloat(storedSalaryString)
    const validatedSalary =
      isNaN(parsedSalaryValue) || parsedSalaryValue <= 0 ? null : parsedSalaryValue

    return validatedSalary
  }

  return { saveSalary, loadSalary }
}
