<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalaryStore } from '@/stores/salary'
import { useCurrencyStore } from '@/stores/currency'
import { useTimeframeStore } from '@/stores/timeframe'
import { useEarningsCounter } from '@/composables/useEarningsCounter'

const salaryStore = useSalaryStore()
const { monthlySalary } = storeToRefs(salaryStore)

const currencyStore = useCurrencyStore()
const { selectedCurrency } = storeToRefs(currencyStore)

const timeframeStore = useTimeframeStore()
const { timeframe } = storeToRefs(timeframeStore)

const { earnings } = useEarningsCounter(monthlySalary)

const hasSalary = computed(() => monthlySalary.value !== null && monthlySalary.value > 0)

const integerPart = computed(() =>
  Math.floor(earnings.value).toLocaleString(selectedCurrency.value.locale),
)

const decimalPart = computed(() => {
  const fractionalPart = earnings.value % 1

  return fractionalPart.toFixed(4).slice(1)
})

const earnedLabel = computed(() => {
  switch (timeframe.value) {
    case 'today':
      return 'EARNED TODAY'
    case 'week':
      return 'EARNED THIS WEEK'
    case 'year':
      return 'EARNED THIS YEAR'
    default:
      return 'EARNED THIS MONTH'
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-full bg-bg select-none"
    style="height: 100dvh"
  >
    <div v-if="!hasSalary" class="text-[0.65rem] tracking-[0.25em] text-cream-muted uppercase">
      Set your salary first
    </div>

    <template v-else>
      <div class="flex items-start gap-1 mb-5">
        <span class="font-display text-[1.8rem] pt-[5px] text-gold-dim leading-none">
          {{ selectedCurrency.symbol }}
        </span>
        <div class="flex items-baseline">
          <span
            class="font-display font-bold text-[6rem] leading-none tabular-nums tracking-[-0.03em] text-gold"
          >
            {{ integerPart }}
          </span>
          <span class="font-mono text-[1.5rem] tabular-nums text-gold-dim leading-none">
            {{ decimalPart }}
          </span>
        </div>
      </div>
      <p class="text-[0.8rem] tracking-[0.35em] text-cream-muted">
        {{ earnedLabel }}
      </p>
    </template>
  </div>
</template>
