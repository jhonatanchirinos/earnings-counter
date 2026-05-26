<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSalaryStore } from '@/stores/salary'
import { useCurrencyStore, CURRENCIES } from '@/stores/currency'

const salaryStore = useSalaryStore()

const currencyStore = useCurrencyStore()
const { selectedCurrency } = storeToRefs(currencyStore)

const currencyDropdownRef = ref<HTMLDivElement | null>(null)
const isCurrencyDropdownOpen = ref(false)

function toggleCurrencyDropdown(): void {
  isCurrencyDropdownOpen.value = !isCurrencyDropdownOpen.value
}

function selectCurrency(code: string): void {
  currencyStore.setCurrency(code)
  isCurrencyDropdownOpen.value = false
}

function handleClickOutside(mouseEvent: MouseEvent): void {
  if (currencyDropdownRef.value && !currencyDropdownRef.value.contains(mouseEvent.target as Node)) {
    isCurrencyDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const isEditing = ref(false)
const error = ref('')

const hasSalary = computed(
  () => salaryStore.monthlySalary !== null && salaryStore.monthlySalary > 0,
)

const showForm = computed(() => !hasSalary.value || isEditing.value)

async function startEdit(): Promise<void> {
  inputValue.value = salaryStore.monthlySalary?.toString() ?? ''
  isEditing.value = true
  error.value = ''

  await nextTick()

  inputRef.value?.focus()
}

function handleSubmit(): void {
  const value = parseFloat(inputValue.value)
  if (isNaN(value) || value <= 0) {
    error.value = 'Enter a valid amount greater than zero'
    return
  }

  salaryStore.setSalary(value)

  isEditing.value = false
  error.value = ''
  inputValue.value = ''
}

function handleKeydown(keyboardEvent: KeyboardEvent): void {
  if (keyboardEvent.key === 'Enter') handleSubmit()

  if (keyboardEvent.key === 'Escape' && isEditing.value) isEditing.value = false
}

const formattedSalary = computed(() => {
  if (!salaryStore.monthlySalary) return ''

  const formattedAmount = salaryStore.monthlySalary.toLocaleString(selectedCurrency.value.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formattedAmount
})
</script>

<template>
  <div class="border-t border-border pt-6 sm:pt-10">
    <div v-if="showForm" class="mx-auto max-w-[460px]">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-[0.58rem] tracking-[0.32em] text-cream-muted">MONTHLY SALARY</span>
        <div class="flex items-center gap-3">
          <div ref="currencyDropdownRef" class="relative">
            <button
              class="flex cursor-pointer items-center gap-1 font-mono text-[0.58rem] tracking-[0.2em] text-cream-muted transition-colors hover:text-cream focus:outline-none"
              @click="toggleCurrencyDropdown"
            >
              {{ selectedCurrency.code }}
              <span class="text-[0.45rem] opacity-50">▼</span>
            </button>
            <div
              v-if="isCurrencyDropdownOpen"
              class="absolute right-0 bottom-full mb-1.5 border border-border bg-bg-surface"
            >
              <button
                v-for="currency in CURRENCIES"
                :key="currency.code"
                class="block w-full px-3 py-1.5 text-left font-mono text-[0.58rem] tracking-[0.2em] transition-colors"
                :class="
                  currency.code === selectedCurrency.code
                    ? 'bg-gold text-bg'
                    : 'text-cream-muted hover:bg-gold hover:text-bg'
                "
                @click="selectCurrency(currency.code)"
              >
                {{ currency.code }}
              </button>
            </div>
          </div>
          <button
            v-if="isEditing"
            class="text-[0.58rem] tracking-[0.2em] text-cream-muted transition-colors hover:text-cream"
            @click="isEditing = false"
          >
            CANCEL
          </button>
        </div>
      </div>

      <div
        class="flex items-stretch border border-border bg-bg-surface transition-colors focus-within:border-gold-dim"
      >
        <span
          class="flex select-none items-center border-r border-border px-3 py-3.5 font-mono text-[0.9rem] text-gold-dim sm:px-4"
        >
          {{ selectedCurrency.symbol }}
        </span>
        <input
          ref="inputRef"
          v-model="inputValue"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="min-w-0 flex-1 px-3 py-3.5 font-mono text-base tabular-nums text-cream placeholder:text-cream-muted placeholder:opacity-40 sm:px-4 sm:text-xl"
          @keydown="handleKeydown"
        />
        <button
          class="shrink-0 whitespace-nowrap bg-gold px-3 py-3.5 font-medium font-mono text-[0.6rem] tracking-[0.15em] text-bg transition-colors hover:bg-gold-light sm:px-4 sm:tracking-[0.28em]"
          @click="handleSubmit"
        >
          {{ isEditing ? 'UPDATE' : 'START' }}
        </button>
      </div>

      <p v-if="error" class="mt-2.5 text-[0.7rem] tracking-[0.06em] text-error">
        {{ error }}
      </p>
    </div>

    <div
      v-else
      class="mx-auto flex max-w-[460px] flex-wrap items-center gap-x-5 gap-y-2 sm:flex-nowrap"
    >
      <span class="w-full shrink-0 text-[0.58rem] tracking-[0.32em] text-cream-muted sm:w-auto"
        >MONTHLY SALARY</span
      >
      <span class="flex-1 font-mono text-base tabular-nums text-cream"
        >{{ selectedCurrency.symbol }}{{ formattedSalary }}</span
      >
      <button
        class="shrink-0 border border-border px-3 py-1.5 font-mono text-[0.58rem] tracking-[0.22em] text-cream-muted transition-colors hover:border-gold-dim hover:text-gold"
        @click="startEdit"
      >
        EDIT
      </button>
    </div>
  </div>
</template>
