<template>
  <div class="form-check form-switch d-flex align-items-center gap-2" style="min-height: 38px;">
    <input
      class="form-check-input"
      type="checkbox"
      :id="`status-${id}`"
      :checked="modelValue === trueValue"
      :true-value="trueValue"
      :false-value="falseValue"
      :style="{ backgroundColor: modelValue === trueValue ? '#433e5f' : '' }"
      @change="onChange"
      style="margin-top: 0 !important;"
    >
    <label
      class="form-check-label mb-0"
      :for="`status-${id}`"
      :class="modelValue === trueValue ? 'text-success' : 'text-muted'"
      :style="modelValue === trueValue ? { backgroundColor: '#d4edda', border: '1px solid #c3e6cb', padding: '2px 6px', borderRadius: '4px' } :  { backgroundColor: '#f0f0f0', border: '1px solid #360000', padding: '2px 6px', borderRadius: '4px' } "
    >
      {{ modelValue === trueValue ? activeText : inactiveText }}
    </label>
  </div>
</template>

<script setup>
defineProps({
  id: [String, Number],
  modelValue: [Number, Boolean],
  trueValue: { type: [Number, Boolean], default: 1 },
  falseValue: { type: [Number, Boolean], default: 0 },
  activeText: { type: String, default: 'Hoạt động' },
  inactiveText: { type: String, default: 'Không hoạt động' },
});
const emit = defineEmits(['update:modelValue', 'change']);
function onChange(e) {
  const value = e.target.checked ? 1 : 0;
  emit('update:modelValue', value);
  emit('change', value);
}
</script>
