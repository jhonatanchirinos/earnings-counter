import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WorkSchedule } from '@/types'
import { useScheduleStorage, DEFAULT_SCHEDULE } from '@/composables/useScheduleStorage'

export const useScheduleStore = defineStore('schedule', () => {
  const { saveSchedule, loadSchedule } = useScheduleStorage()
  const schedule = ref<WorkSchedule>(DEFAULT_SCHEDULE)

  function setSchedule(newSchedule: WorkSchedule): void {
    schedule.value = { ...newSchedule }

    saveSchedule(schedule.value)
  }

  function loadFromStorage(): void {
    schedule.value = loadSchedule()
  }

  return { schedule, setSchedule, loadFromStorage }
})
