import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  getDaysInCurrentMonth,
  getElapsedSecondsThisMonth,
  calculateEarnings,
  getSalaryPerSecond,
} from '@/utils/earnings'

afterEach(() => {
  vi.useRealTimers()
})

describe('getDaysInCurrentMonth', () => {
  it('returns a number between 28 and 31', () => {
    const days = getDaysInCurrentMonth()

    expect(days).toBeGreaterThanOrEqual(28)
    expect(days).toBeLessThanOrEqual(31)
  })

  it('returns 28 for February in a non-leap year', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 1, 15))

    expect(getDaysInCurrentMonth()).toBe(28)
  })

  it('returns 29 for February in a leap year', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 1, 15))

    expect(getDaysInCurrentMonth()).toBe(29)
  })

  it('returns 31 for January', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 10))

    expect(getDaysInCurrentMonth()).toBe(31)
  })

  it('returns 30 for April', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 3, 5))

    expect(getDaysInCurrentMonth()).toBe(30)
  })
})

describe('getElapsedSecondsThisMonth', () => {
  it('returns 0 at the very start of the month', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0, 0, 0))

    expect(getElapsedSecondsThisMonth()).toBe(0)
  })

  it('returns 3600 exactly one hour into the 1st', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 1, 0, 0, 0))

    expect(getElapsedSecondsThisMonth()).toBe(3600)
  })

  it('returns correct seconds at mid-month', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 15, 12, 0, 0, 0))

    // 14 full days + 12 hours
    expect(getElapsedSecondsThisMonth()).toBe(14 * 86400 + 12 * 3600)
  })
})

describe('calculateEarnings', () => {
  it('returns 0 for zero salary', () => {
    expect(calculateEarnings({ monthlySalary: 0, elapsedSeconds: 1000, daysInMonth: 30 })).toBe(0)
  })

  it('returns 0 for negative salary', () => {
    expect(calculateEarnings({ monthlySalary: -500, elapsedSeconds: 1000, daysInMonth: 30 })).toBe(
      0,
    )
  })

  it('returns 0 for zero days', () => {
    expect(calculateEarnings({ monthlySalary: 3000, elapsedSeconds: 1000, daysInMonth: 0 })).toBe(0)
  })

  it('returns full salary at end of month', () => {
    const days = 30
    const totalSeconds = days * 86400

    expect(
      calculateEarnings({ monthlySalary: 3000, elapsedSeconds: totalSeconds, daysInMonth: days }),
    ).toBeCloseTo(3000)
  })

  it('returns half salary at mid-month', () => {
    const days = 30
    const halfSeconds = (days * 86400) / 2

    expect(
      calculateEarnings({ monthlySalary: 3000, elapsedSeconds: halfSeconds, daysInMonth: days }),
    ).toBeCloseTo(1500)
  })

  it('returns proportional daily amount', () => {
    const salary = 3000
    const days = 30

    expect(
      calculateEarnings({ monthlySalary: salary, elapsedSeconds: 86400, daysInMonth: days }),
    ).toBeCloseTo(salary / days)
  })
})

describe('getSalaryPerSecond', () => {
  it('returns 0 for zero salary', () => {
    expect(getSalaryPerSecond({ monthlySalary: 0, daysInMonth: 30 })).toBe(0)
  })

  it('returns 0 for zero days', () => {
    expect(getSalaryPerSecond({ monthlySalary: 3000, daysInMonth: 0 })).toBe(0)
  })

  it('returns 0 for negative salary', () => {
    expect(getSalaryPerSecond({ monthlySalary: -100, daysInMonth: 30 })).toBe(0)
  })

  it('calculates correctly for 30-day month', () => {
    const expected = 3000 / (30 * 86400)

    expect(getSalaryPerSecond({ monthlySalary: 3000, daysInMonth: 30 })).toBeCloseTo(expected)
  })

  it('salaryPerSecond * totalSeconds equals monthlySalary', () => {
    const days = 31
    const salary = 5000
    const perSecond = getSalaryPerSecond({ monthlySalary: salary, daysInMonth: days })

    expect(perSecond * days * 86400).toBeCloseTo(salary)
  })
})
