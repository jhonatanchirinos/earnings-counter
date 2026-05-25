import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import {
  getDaysInCurrentMonth,
  getElapsedSecondsThisMonth,
  calculateEarnings,
  getSalaryPerSecond,
} from '@/utils/earnings'

export function useEarningsCounter(monthlySalary: Ref<number | null>) {
  const earnings = ref(0)
  const elapsedSeconds = ref(0)
  const daysInMonth = ref(getDaysInCurrentMonth())

  const salaryPerSecond = computed(() => {
    if (!monthlySalary.value) return 0

    const salaryPerSecond = getSalaryPerSecond({
      monthlySalary: monthlySalary.value,
      daysInMonth: daysInMonth.value,
    })

    return salaryPerSecond
  })

  let intervalId: ReturnType<typeof setInterval> | null = null

  function updateEarningsState(): void {
    daysInMonth.value = getDaysInCurrentMonth()
    elapsedSeconds.value = getElapsedSecondsThisMonth()

    if (monthlySalary.value) {
      earnings.value = calculateEarnings({
        monthlySalary: monthlySalary.value,
        elapsedSeconds: elapsedSeconds.value,
        daysInMonth: daysInMonth.value,
      })
    }
  }

  function startCounter(): void {
    updateEarningsState()

    intervalId = setInterval(updateEarningsState, 1000)
  }

  function stopCounter(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)

      intervalId = null
    }
  }

  onMounted(startCounter)
  onUnmounted(stopCounter)
  watch(monthlySalary, updateEarningsState)

  return { earnings, salaryPerSecond, daysInMonth, elapsedSeconds }
}
