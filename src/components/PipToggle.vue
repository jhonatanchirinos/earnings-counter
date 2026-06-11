<script setup lang="ts">
import { usePictureInPicture } from '@/composables/usePictureInPicture'

const { isPipSupported, isPipActive, togglePip } = usePictureInPicture()
</script>

<template>
  <button
    v-if="isPipSupported"
    class="font-mono text-[0.58rem] tracking-[0.2em] transition-colors cursor-pointer"
    :class="isPipActive ? 'text-gold hover:text-gold-light' : 'text-cream-muted hover:text-cream'"
    @click="togglePip"
  >
    PiP
  </button>
</template>
