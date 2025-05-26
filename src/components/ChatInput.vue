<script setup lang="ts">
import { ref, nextTick } from "vue";

const emit = defineEmits<{
  "send-message": [content: string];
}>();

const message = ref("");
const textarea = ref<HTMLTextAreaElement>();
const isComposing = ref(false);

const sendMessage = () => {
  if (message.value.trim() && !isComposing.value) {
    emit("send-message", message.value.trim());
    message.value = "";
    resetTextareaHeight();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const handleInput = async () => {
  await nextTick();
  adjustTextareaHeight();
};

const adjustTextareaHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = "auto";
    textarea.value.style.height =
      Math.min(textarea.value.scrollHeight, 120) + "px";
  }
};

const resetTextareaHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = "auto";
  }
};

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
};
</script>

<template>
  <div class="chat-input">
    <div class="input-container">
      <textarea
        ref="textarea"
        v-model="message"
        class="message-input"
        placeholder="Type a message..."
        rows="1"
        @keydown="handleKeydown"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      ></textarea>

      <button
        class="send-button"
        :disabled="!message.trim()"
        @click="sendMessage"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 1rem;
  border-top: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 0 0 8px 8px;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  max-width: 100%;
}

.message-input {
  flex: 1;
  min-height: 20px;
  max-height: 120px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.message-input::placeholder {
  color: #9ca3af;
}

.send-button {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.send-button svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .chat-input {
    padding: 0.75rem;
  }

  .message-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style>
