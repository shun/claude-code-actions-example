<script setup lang="ts">
import { ref, type Ref } from "vue";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ModelSelector from "./ModelSelector.vue";
import SettingsModal from "./SettingsModal.vue";
import { GeminiApiService, type GeminiApiConfig } from "@/services/geminiApi";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const messages: Ref<Message[]> = ref([]);
const selectedModel = ref("openai");
const isTyping = ref(false);
const showSettings = ref(false);
const errorMessage = ref("");

let geminiService: GeminiApiService | null = null;

const initializeGeminiService = () => {
  try {
    const apiKey = localStorage.getItem("gemini_api_key");
    if (apiKey) {
      geminiService = new GeminiApiService({ apiKey });
    }
  } catch (error) {
    console.error("Failed to initialize Gemini service:", error);
  }
};

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
  errorMessage.value = "";

  try {
    let responseContent = "";

    if (selectedModel.value === "gemini") {
      if (!geminiService) {
        throw new Error("Gemini API key not configured. Please set it in settings.");
      }

      const result = await geminiService.generateResponse(content);
      if (result.success) {
        responseContent = result.content;
      } else {
        throw new Error(result.error || "Failed to get response from Gemini");
      }
    } else {
      // Simulate other AI models (placeholder for future API integration)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      responseContent = `Response from ${selectedModel.value}: ${content}`;
    }

    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responseContent,
      sender: "ai",
      timestamp: new Date(),
    };
    messages.value.push(aiMessage);
  } catch (error: any) {
    errorMessage.value = error.message || "An error occurred while sending the message";
    console.error("Error sending message:", error);
  } finally {
    isTyping.value = false;
  }
};

const clearChat = () => {
  messages.value = [];
  errorMessage.value = "";
};

const openSettings = () => {
  showSettings.value = true;
};

const onSettingsSaved = () => {
  initializeGeminiService();
  errorMessage.value = "";
};

// Initialize Gemini service on component mount
initializeGeminiService();
</script>

<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h2>Chat with AI</h2>
      <div class="header-controls">
        <ModelSelector v-model="selectedModel" />
        <button @click="openSettings" class="settings-btn" aria-label="Settings">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              fill="currentColor"
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
        <button @click="clearChat" class="clear-btn">Clear</button>
      </div>
    </div>

    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
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

    <SettingsModal
      v-model:is-open="showSettings"
      @settings-saved="onSettingsSaved"
    />
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
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-btn:hover {
  background: #5a6268;
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

.error-banner {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 0 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
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
