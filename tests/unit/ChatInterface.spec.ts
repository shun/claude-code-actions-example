import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import ChatInterface from "@/components/ChatInterface.vue";
import ChatMessage from "@/components/ChatMessage.vue";
import ChatInput from "@/components/ChatInput.vue";
import ModelSelector from "@/components/ModelSelector.vue";

// Mock the child components to isolate ChatInterface testing
vi.mock("@/components/ChatMessage.vue", () => ({
  default: {
    name: "ChatMessage",
    props: ["message"],
    template: '<div class="chat-message-mock">{{ message.content }}</div>',
  },
}));

vi.mock("@/components/ChatInput.vue", () => ({
  default: {
    name: "ChatInput",
    emits: ["send-message"],
    template:
      "<div class=\"chat-input-mock\" @click=\"$emit('send-message', 'test message')\"></div>",
  },
}));

vi.mock("@/components/ModelSelector.vue", () => ({
  default: {
    name: "ModelSelector",
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: '<div class="model-selector-mock">{{ modelValue }}</div>',
  },
}));

describe("ChatInterface", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(ChatInterface);
  });

  it("renders correctly with initial state", () => {
    expect(wrapper.find(".chat-interface").exists()).toBe(true);
    expect(wrapper.find(".chat-header h2").text()).toBe("Chat with AI");
    expect(wrapper.find(".chat-messages").exists()).toBe(true);
    expect(wrapper.find(".clear-btn").exists()).toBe(true);
  });

  it("renders child components", () => {
    expect(wrapper.findComponent({ name: "ModelSelector" }).exists()).toBe(
      true
    );
    expect(wrapper.findComponent({ name: "ChatInput" }).exists()).toBe(true);
  });

  it("starts with empty messages", () => {
    expect(wrapper.findAllComponents({ name: "ChatMessage" })).toHaveLength(0);
  });

  it("handles sending a message", async () => {
    const chatInput = wrapper.findComponent({ name: "ChatInput" });

    // Trigger send-message event
    await chatInput.trigger("click");

    // Wait for message to be added
    await wrapper.vm.$nextTick();

    // Should have one user message
    expect(wrapper.findAllComponents({ name: "ChatMessage" })).toHaveLength(1);
  });

  it("shows typing indicator when AI is responding", async () => {
    const chatInput = wrapper.findComponent({ name: "ChatInput" });

    // Send a message
    await chatInput.trigger("click");
    await wrapper.vm.$nextTick();

    // Should show typing indicator
    expect(wrapper.find(".typing-indicator").exists()).toBe(true);
    expect(wrapper.find(".typing-indicator").text()).toContain("AI is typing");
  });

  it("clears chat when clear button is clicked", async () => {
    // First send a message
    const chatInput = wrapper.findComponent({ name: "ChatInput" });
    await chatInput.trigger("click");
    await wrapper.vm.$nextTick();

    // Verify message exists
    expect(wrapper.findAllComponents({ name: "ChatMessage" })).toHaveLength(1);

    // Click clear button
    await wrapper.find(".clear-btn").trigger("click");

    // Messages should be cleared
    expect(wrapper.findAllComponents({ name: "ChatMessage" })).toHaveLength(0);
  });

  it("passes correct model value to ModelSelector", () => {
    const modelSelector = wrapper.findComponent({ name: "ModelSelector" });
    expect(modelSelector.props("modelValue")).toBe("openai");
  });

  it("has responsive design classes", () => {
    expect(wrapper.find(".chat-interface").exists()).toBe(true);
    expect(wrapper.find(".chat-header").exists()).toBe(true);
    expect(wrapper.find(".chat-messages").exists()).toBe(true);
  });

  it("handles empty message input gracefully", async () => {
    // Mock the sendMessage method to test empty content
    const originalSendMessage = wrapper.vm.sendMessage;
    const sendMessageSpy = vi.fn(originalSendMessage);
    wrapper.vm.sendMessage = sendMessageSpy;

    // Call with empty string
    await wrapper.vm.sendMessage("");

    // Should not add any messages
    expect(wrapper.findAllComponents({ name: "ChatMessage" })).toHaveLength(0);
  });
});
