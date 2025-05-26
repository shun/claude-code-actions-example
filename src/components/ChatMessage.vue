<script setup lang="ts">
interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

defineProps<{
  message: Message
}>()

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <div class="message" :class="[`message--${message.sender}`]">
    <div class="message-avatar">
      <div class="avatar" :class="[`avatar--${message.sender}`]">
        <span v-if="message.sender === 'user'">U</span>
        <span v-else>AI</span>
      </div>
    </div>
    
    <div class="message-content">
      <div class="message-bubble" :class="[`bubble--${message.sender}`]">
        <p class="message-text">{{ message.content }}</p>
      </div>
      <div class="message-time">
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  gap: 0.75rem;
  max-width: 100%;
}

.message--user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.avatar--user {
  background: #3b82f6;
}

.avatar--ai {
  background: #10b981;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message--user .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
}

.bubble--user {
  background: #3b82f6;
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble--ai {
  background: #f3f4f6;
  color: #374151;
  border-bottom-left-radius: 4px;
}

.message-text {
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.message-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  padding: 0 0.5rem;
}

.message--user .message-time {
  text-align: right;
}

@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }
  
  .avatar {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
  
  .message-text {
    font-size: 0.875rem;
  }
}
</style>