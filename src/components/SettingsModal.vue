<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "settings-saved": [];
}>();

const geminiApiKey = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const STORAGE_KEY = "gemini_api_key";

const hasApiKey = computed(() => !!geminiApiKey.value.trim());

const loadStoredApiKey = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      geminiApiKey.value = stored;
    }
  } catch (error) {
    console.error("Failed to load API key from localStorage:", error);
  }
};

const saveApiKey = async () => {
  if (!hasApiKey.value) {
    errorMessage.value = "API key is required";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    localStorage.setItem(STORAGE_KEY, geminiApiKey.value.trim());
    successMessage.value = "API key saved successfully";
    emit("settings-saved");
    
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (error) {
    errorMessage.value = "Failed to save API key";
    console.error("Failed to save API key:", error);
  } finally {
    isLoading.value = false;
  }
};

const clearApiKey = () => {
  geminiApiKey.value = "";
  localStorage.removeItem(STORAGE_KEY);
  successMessage.value = "API key cleared";
  errorMessage.value = "";
};

const closeModal = () => {
  emit("update:isOpen", false);
  setTimeout(() => {
    errorMessage.value = "";
    successMessage.value = "";
  }, 300);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeModal();
  } else if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    saveApiKey();
  }
};

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      loadStoredApiKey();
    }
  }
);

onMounted(() => {
  loadStoredApiKey();
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Settings</h3>
          <button @click="closeModal" class="close-btn" aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="gemini-api-key">Gemini API Key</label>
            <div class="input-group">
              <input
                id="gemini-api-key"
                v-model="geminiApiKey"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your Gemini API key"
                class="api-key-input"
                :class="{ error: errorMessage }"
                :disabled="isLoading"
              />
              <button
                @click="togglePasswordVisibility"
                class="toggle-visibility-btn"
                type="button"
                :aria-label="showPassword ? 'Hide API key' : 'Show API key'"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  />
                </svg>
              </button>
            </div>
            <p class="help-text">
              Get your API key from 
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener">
                Google AI Studio
              </a>
            </p>
          </div>

          <div v-if="errorMessage" class="message error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="message success-message">
            {{ successMessage }}
          </div>
        </div>

        <div class="modal-footer">
          <button @click="clearApiKey" class="btn btn-secondary" :disabled="isLoading">
            Clear
          </button>
          <button @click="closeModal" class="btn btn-secondary" :disabled="isLoading">
            Cancel
          </button>
          <button
            @click="saveApiKey"
            class="btn btn-primary"
            :disabled="!hasApiKey || isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? "Saving..." : "Save" }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.input-group {
  position: relative;
  display: flex;
}

.api-key-input {
  flex: 1;
  padding: 0.75rem 3rem 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.api-key-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.api-key-input.error {
  border-color: #dc3545;
}

.api-key-input:disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.toggle-visibility-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.toggle-visibility-btn:hover {
  color: #374151;
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.help-text a {
  color: #3b82f6;
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

.message {
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.error-message {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.success-message {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
  background: #f8f9fa;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #f3f4f6;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    max-width: none;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>