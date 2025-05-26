<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const geminiApiKey = ref("");
const showPassword = ref(false);
const validationMessage = ref("");

onMounted(() => {
  loadApiKey();
});

const loadApiKey = () => {
  const savedKey = localStorage.getItem("gemini-api-key");
  if (savedKey) {
    geminiApiKey.value = savedKey;
  }
};

const saveSettings = () => {
  if (!geminiApiKey.value.trim()) {
    validationMessage.value = "API key is required";
    return;
  }

  localStorage.setItem("gemini-api-key", geminiApiKey.value.trim());
  validationMessage.value = "";
  emit("close");
};

const clearApiKey = () => {
  geminiApiKey.value = "";
  localStorage.removeItem("gemini-api-key");
  validationMessage.value = "";
};

const closeModal = () => {
  validationMessage.value = "";
  emit("close");
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};
</script>

<template>
  <div v-if="isOpen" class="settings-modal">
    <div class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Settings</h3>
          <button class="close-btn" @click="closeModal">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
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
              />
              <button
                type="button"
                class="toggle-visibility-btn"
                @click="togglePasswordVisibility"
              >
                <svg v-if="showPassword" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
                <svg v-else viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p class="help-text">
              Get your API key from the
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google AI Studio
              </a>
            </p>
            <div v-if="validationMessage" class="validation-message">
              {{ validationMessage }}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="clear-btn" @click="clearApiKey">
            Clear
          </button>
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="save-btn" @click="saveSettings">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
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
  padding: 0.25rem;
  color: #6b7280;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.close-btn svg {
  width: 20px;
  height: 20px;
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
  background: white;
}

.api-key-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
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
}

.toggle-visibility-btn:hover {
  color: #374151;
}

.toggle-visibility-btn svg {
  width: 20px;
  height: 20px;
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

.validation-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #dc2626;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1.5rem;
}

.button-group {
  display: flex;
  gap: 0.75rem;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-btn:hover {
  background: #4b5563;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.save-btn:hover {
  background: #2563eb;
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .button-group {
    width: 100%;
  }

  .cancel-btn,
  .save-btn {
    flex: 1;
  }
}
</style>