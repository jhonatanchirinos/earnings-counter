import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'
import {
  getDaysInCurrentMonth,
  getElapsedSecondsThisMonth,
  getTotalSecondsInMonth,
  calculateEarnings,
  getSalaryPerSecond,
} from '@/utils/earnings'

export function useEarningsCounter(monthlySalary: Ref<number | null>) {
  const scheduleStore = useScheduleStore()
  const { schedule } = storeToRefs(scheduleStore)

  const earnings = ref(0)
  const elapsedSeconds = ref(0)
  const daysInMonth = ref(getDaysInCurrentMonth())
  const totalSecondsInMonth = ref(getTotalSecondsInMonth(schedule.value))

  const salaryPerSecond = computed(() => {
    if (!monthlySalary.value) return 0

    const salaryPerSecond = getSalaryPerSecond({
      monthlySalary: monthlySalary.value,
      totalSecondsInMonth: totalSecondsInMonth.value,
    })

    return salaryPerSecond
  })

  let intervalId: ReturnType<typeof setInterval> | null = null

  function updateEarningsState(): void {
    daysInMonth.value = getDaysInCurrentMonth()
    totalSecondsInMonth.value = getTotalSecondsInMonth(schedule.value)
    elapsedSeconds.value = getElapsedSecondsThisMonth(schedule.value)

    if (monthlySalary.value) {
      earnings.value = calculateEarnings({
        monthlySalary: monthlySalary.value,
        elapsedSeconds: elapsedSeconds.value,
        totalSecondsInMonth: totalSecondsInMonth.value,
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
  watch([monthlySalary, schedule], updateEarningsState, { deep: true })

  return { earnings, salaryPerSecond, daysInMonth, elapsedSeconds }
}
