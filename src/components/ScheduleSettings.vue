<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'

const scheduleStore = useScheduleStore()
const { schedule } = storeToRefs(scheduleStore)

const DAYS = [
  { value: 1, label: 'MON' },
  { value: 2, label: 'TUE' },
  { value: 3, label: 'WED' },
  { value: 4, label: 'THU' },
  { value: 5, label: 'FRI' },
  { value: 6, label: 'SAT' },
  { value: 0, label: 'SUN' },
]

function toggleActive(): void {
  scheduleStore.setSchedule({ ...schedule.value, isActive: !schedule.value.isActive })
}

function toggleDay(dayValue: number): void {
  const days = new Set(schedule.value.daysOfWeek)
  if (days.has(dayValue)) days.delete(dayValue)
  else days.add(dayValue)

  scheduleStore.setSchedule({ ...schedule.value, daysOfWeek: Array.from(days).sort() })
}

function updateTime(field: 'startTime' | 'endTime', event: Event): void {
  const value = (event.target as HTMLInputElement).value
  if (value) scheduleStore.setSchedule({ ...schedule.value, [field]: value })
}
</script>

<template>
  <div class="mx-auto w-full max-w-[460px] border-t border-border pt-4 sm:pt-6 mt-4 sm:mt-6">
    <div class="flex items-center justify-between">
      <span class="text-[0.58rem] tracking-[0.32em] text-cream-muted">WORK SCHEDULE</span>
      <button
        class="flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.2em] transition-colors cursor-pointer"
        :class="schedule.isActive ? 'text-gold hover:text-gold-light' : 'text-cream-muted hover:text-cream'"
        @click="toggleActive"
      >
        {{ schedule.isActive ? 'ON' : 'OFF' }}
        <span class="text-[0.45rem] opacity-70" :class="schedule.isActive ? 'text-gold' : 'text-cream-muted'">
          {{ schedule.isActive ? '▼' : '▶' }}
        </span>
      </button>
    </div>

    <div v-if="schedule.isActive" class="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-5 animate-slide-down origin-top">
      <div class="flex flex-col gap-2">
         <span class="text-[0.5rem] tracking-[0.2em] text-cream-muted opacity-70">ACTIVE DAYS</span>
         <div class="flex w-full justify-between gap-1 sm:gap-1.5">
           <button
             v-for="day in DAYS"
             :key="day.value"
             class="flex-1 border py-1.5 font-mono text-[0.55rem] transition-all duration-200 sm:py-2 sm:text-[0.6rem] cursor-pointer"
             :class="schedule.daysOfWeek.includes(day.value) ? 'bg-gold border-gold text-bg font-medium' : 'bg-bg-surface border-border text-cream-muted hover:border-gold-dim hover:text-cream'"
             @click="toggleDay(day.value)"
           >
             {{ day.label }}
           </button>
         </div>
      </div>

      <div class="flex gap-3 sm:gap-4">
        <div class="flex flex-1 flex-col gap-2">
          <span class="text-[0.5rem] tracking-[0.2em] text-cream-muted opacity-70">START TIME</span>
          <div class="relative cursor-pointer border border-border bg-bg-surface transition-colors focus-within:border-gold-dim hover:border-gold-dim/50">
            <input
              type="time"
              :value="schedule.startTime"
              required
              class="w-full bg-transparent px-2 py-2 font-mono text-sm text-cream cursor-pointer text-center outline-none sm:py-2.5 sm:text-base [color-scheme:dark]"
              @change="updateTime('startTime', $event)"
            />
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-2">
          <span class="text-[0.5rem] tracking-[0.2em] text-cream-muted opacity-70">END TIME</span>
          <div class="relative cursor-pointer border border-border bg-bg-surface transition-colors focus-within:border-gold-dim hover:border-gold-dim/50">
            <input
              type="time"
              :value="schedule.endTime"
              required
              class="w-full bg-transparent px-2 py-2 font-mono text-sm text-cream cursor-pointer text-center outline-none sm:py-2.5 sm:text-base [color-scheme:dark]"
              @change="updateTime('endTime', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
