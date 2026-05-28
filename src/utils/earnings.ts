import type { WorkSchedule } from '@/types'

function parseTimeToSeconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const seconds = hours * 3600 + minutes * 60

  return seconds
}

export function getDaysInCurrentMonth(): number {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  return daysInMonth
}

export function getTotalSecondsInMonth(schedule?: WorkSchedule): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = getDaysInCurrentMonth()

  if (!schedule || !schedule.isActive) {
    const totalSeconds = daysInMonth * 24 * 3600
    
    return totalSeconds
  }

  let workableSeconds = 0
  const startSeconds = parseTimeToSeconds(schedule.startTime)
  const endSeconds = parseTimeToSeconds(schedule.endTime)
  const dailySeconds = Math.max(0, endSeconds - startSeconds)

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    
    if (schedule.daysOfWeek.includes(date.getDay())) {
      workableSeconds += dailySeconds
    }
  }

  return workableSeconds
}

export function getElapsedSecondsThisMonth(schedule?: WorkSchedule): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const currentDay = now.getDate()

  if (!schedule || !schedule.isActive) {
    const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0)
    const elapsedSeconds = Math.floor((now.getTime() - startOfMonth.getTime()) / 1000)

    return elapsedSeconds
  }

  let elapsed = 0
  const startSeconds = parseTimeToSeconds(schedule.startTime)
  const endSeconds = parseTimeToSeconds(schedule.endTime)
  const dailySeconds = Math.max(0, endSeconds - startSeconds)
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()

  for (let day = 1; day < currentDay; day++) {
    const date = new Date(year, month, day)

    if (schedule.daysOfWeek.includes(date.getDay())) {
      elapsed += dailySeconds
    }
  }

  if (schedule.daysOfWeek.includes(now.getDay())) {
    if (currentSeconds > startSeconds) {
      const todayElapsed = Math.min(currentSeconds, endSeconds) - startSeconds
      elapsed += todayElapsed
    }
  }

  return elapsed
}

export function calculateEarnings({
  monthlySalary,
  elapsedSeconds,
  totalSecondsInMonth,
}: {
  monthlySalary: number
  elapsedSeconds: number
  totalSecondsInMonth: number
}): number {
  if (monthlySalary <= 0 || totalSecondsInMonth <= 0) return 0

  const earnings = (monthlySalary / totalSecondsInMonth) * elapsedSeconds

  return earnings
}

export function getSalaryPerSecond({
  monthlySalary,
  totalSecondsInMonth,
}: {
  monthlySalary: number
  totalSecondsInMonth: number
}): number {
  if (monthlySalary <= 0 || totalSecondsInMonth <= 0) return 0

  const salaryPerSecond = monthlySalary / totalSecondsInMonth

  return salaryPerSecond
}
