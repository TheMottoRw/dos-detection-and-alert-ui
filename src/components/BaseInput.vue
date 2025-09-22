<script setup>
const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  name: String,
  placeholder: String,
  autocomplete: String,
  required: Boolean,
  label: String,
  id: String
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="grid gap-2">
    <span v-if="label" class="text-xs text-slate-300">{{ label }}</span>
    <input
      class="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/35"
      :id="id"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<!-- Tailwind utility classes used -->
