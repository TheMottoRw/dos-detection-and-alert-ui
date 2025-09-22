<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  label: String,
  id: String
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="inline-flex items-center gap-2 text-sm text-slate-300" :for="id">
    <input class="h-4 w-4 accent-primary" :id="id" type="checkbox" :checked="modelValue" @change="emit('update:modelValue', $event.target.checked)" />
    <span>{{ label }}</span>
  </label>
</template>

<!-- Tailwind utility classes used -->
