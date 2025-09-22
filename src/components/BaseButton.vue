<script setup>
const props = defineProps({
  type: { type: String, default: 'button' }
})
</script>

<template>
  <button
    :type="type"
    class="mt-1 w-full rounded-lg bg-gradient-to-b from-primary to-primary-600 px-4 py-3 font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(108,124,255,0.35)] ring-1 ring-inset ring-primary/30 transition-all hover:brightness-105 hover:shadow-[0_10px_24px_rgba(108,124,255,0.45)] active:translate-y-px"
  >
    <slot />
  </button>
</template>

<!-- Tailwind utility classes used -->
