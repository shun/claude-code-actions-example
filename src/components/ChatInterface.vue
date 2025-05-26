<script setup lang="ts">
import { ref, type Ref } from "vue";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ModelSelector from "./ModelSelector.vue";
import SettingsModal from "./SettingsModal.vue";
import { sendGeminiMessage } from "@/services/geminiApi";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const messages: Ref<Message[]> = ref([]);
const selectedModel = ref("openai");
const isTyping = ref(false);
const isSettingsOpen = ref(false);

const sendMessage = async (content: string) => {
  if (!content.trim()) return;

  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    content: content.trim(),
    sender: "user",
    timestamp: new Date(),
  };
  messages.value.push(userMessage);

  // Show typing indicator
  isTyping.value = true;

  try {
    let responseContent = "";

    if (selectedModel.value === "gemini") {
      const response = await sendGeminiMessage(content.trim());
      responseContent = response.content;
    } else {
      // Simulate other AI responses (placeholder for future API integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      responseContent = `Response from ${selectedModel.value}: ${content}`;
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responseContent,
      sender: "ai",
      timestamp: new Date(),
    };
    messages.value.push(aiMessage);
  } catch (error) {
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      sender: "ai",
      timestamp: new Date(),
    };
    messages.value.push(errorMessage);
  } finally {
    isTyping.value = false;
  }
};

const clearChat = () => {
  messages.value = [];
};

const openSettings = () => {
  isSettingsOpen.value = true;
};

const closeSettings = () => {
  isSettingsOpen.value = false;
};
</script>

<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h2>Chat with AI</h2>
      <div class="header-controls">
        <ModelSelector v-model="selectedModel" />
        <button @click="openSettings" class="settings-btn">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button @click="clearChat" class="clear-btn">Clear</button>
      </div>
    </div>

    <div class="chat-messages">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      <div v-if="isTyping" class="typing-indicator">
        <span>AI is typing</span>
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <ChatInput @send-message="sendMessage" />

    <SettingsModal :is-open="isSettingsOpen" @close="closeSettings" />
  </div>
</template>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.chat-header h2 {
  margin: 0;
  color: #333;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.settings-btn {
  padding: 0.5rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background: #4b5563;
}

.settings-btn svg {
  width: 16px;
  height: 16px;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-btn:hover {
  background: #c82333;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-style: italic;
}

.typing-dots {
  display: flex;
  gap: 2px;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  background: #666;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .chat-interface {
    height: 100vh;
    border-radius: 0;
  }

  .chat-header {
    border-radius: 0;
  }
}
</style>
