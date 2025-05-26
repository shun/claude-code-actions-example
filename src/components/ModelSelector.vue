<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const models = [
  { value: 'openai', label: 'OpenAI GPT', description: 'GPT-4 and GPT-3.5' },
  { value: 'claude', label: 'Anthropic Claude', description: 'Claude 3 family' },
  { value: 'gemini', label: 'Google Gemini', description: 'Gemini Pro' }
]

const isOpen = ref(false)

const selectedModel = computed(() => {
  return models.find(model => model.value === props.modelValue) || models[0]
})

const selectModel = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="model-selector" @blur="closeDropdown" tabindex="0">
    <button 
      class="selector-button"
      @click="toggleDropdown"
      :class="{ active: isOpen }"
    >
      <span class="selected-model">
        {{ selectedModel.label }}
      </span>
      <svg class="chevron" :class="{ rotated: isOpen }" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <div v-if="isOpen" class="dropdown">
      <div
        v-for="model in models"
        :key="model.value"
        class="dropdown-item"
        :class="{ selected: model.value === props.modelValue }"
        @click="selectModel(model.value)"
      >
        <div class="model-info">
          <div class="model-name">{{ model.label }}</div>
          <div class="model-description">{{ model.description }}</div>
        </div>
        <div v-if="model.value === props.modelValue" class="check-icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.model-selector {
  position: relative;
  display: inline-block;
  min-width: 200px;
}

.selector-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.selector-button:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.selector-button.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.selected-model {
  font-weight: 500;
  color: #374151;
}

.chevron {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 2px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.selected {
  background: #eff6ff;
}

.dropdown-item:first-child {
  border-radius: 6px 6px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 6px 6px;
}

.model-info {
  flex: 1;
}

.model-name {
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.model-description {
  font-size: 0.75rem;
  color: #6b7280;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
  margin-left: 0.5rem;
}

.check-icon svg {
  width: 100%;
  height: 100%;
}
</style>