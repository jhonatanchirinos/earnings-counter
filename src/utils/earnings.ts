export function getDaysInCurrentMonth(): number {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  return daysInMonth
}

export function getElapsedSecondsThisMonth(): number {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  const elapsedSeconds = Math.floor((now.getTime() - startOfMonth.getTime()) / 1000)

  return elapsedSeconds
}

export function calculateEarnings({
  monthlySalary,
  elapsedSeconds,
  daysInMonth,
}: {
  monthlySalary: number
  elapsedSeconds: number
  daysInMonth: number
}): number {
  if (monthlySalary <= 0 || daysInMonth <= 0) return 0

  const totalSecondsInMonth = daysInMonth * 24 * 60 * 60
  const earnings = (monthlySalary / totalSecondsInMonth) * elapsedSeconds

  return earnings
}

export function getSalaryPerSecond({
  monthlySalary,
  daysInMonth,
}: {
  monthlySalary: number
  daysInMonth: number
}): number {
  if (monthlySalary <= 0 || daysInMonth <= 0) return 0

  const salaryPerSecond = monthlySalary / (daysInMonth * 24 * 60 * 60)

  return salaryPerSecond
}
