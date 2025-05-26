<script setup lang="ts">
import { ref, type Ref } from "vue";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ModelSelector from "./ModelSelector.vue";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const messages: Ref<Message[]> = ref([]);
const selectedModel = ref("openai");
const isTyping = ref(false);

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

  // Simulate AI response (placeholder for future API integration)
  setTimeout(() => {
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Response from ${selectedModel.value}: ${content}`,
      sender: "ai",
      timestamp: new Date(),
    };
    messages.value.push(aiMessage);
    isTyping.value = false;
  }, 1000);
};

const clearChat = () => {
  messages.value = [];
};
</script>

<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h2>Chat with AI</h2>
      <div class="header-controls">
        <ModelSelector v-model="selectedModel" />
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
