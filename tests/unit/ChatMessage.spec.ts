import { describe, it, expect, beforeEach } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import ChatMessage from "@/components/ChatMessage.vue";

describe("ChatMessage", () => {
  const userMessage = {
    id: "1",
    content: "Hello, how are you?",
    sender: "user" as const,
    timestamp: new Date("2023-12-01T10:30:00Z"),
  };

  const aiMessage = {
    id: "2",
    content: "I am doing well, thank you for asking!",
    sender: "ai" as const,
    timestamp: new Date("2023-12-01T10:31:00Z"),
  };

  let wrapper: VueWrapper<any>;

  describe("User Message", () => {
    beforeEach(() => {
      wrapper = mount(ChatMessage, {
        props: {
          message: userMessage,
        },
      });
    });

    it("renders user message correctly", () => {
      expect(wrapper.find(".message").exists()).toBe(true);
      expect(wrapper.find(".message").classes()).toContain("message--user");
      expect(wrapper.find(".message-text").text()).toBe("Hello, how are you?");
    });

    it("displays user avatar correctly", () => {
      const avatar = wrapper.find(".avatar");
      expect(avatar.exists()).toBe(true);
      expect(avatar.classes()).toContain("avatar--user");
      expect(avatar.text()).toBe("U");
    });

    it("applies user styling to message bubble", () => {
      const bubble = wrapper.find(".message-bubble");
      expect(bubble.classes()).toContain("bubble--user");
    });

    it("displays timestamp", () => {
      const timeElement = wrapper.find(".message-time");
      expect(timeElement.exists()).toBe(true);
      // The exact format depends on locale, but should contain time elements
      expect(timeElement.text()).toMatch(/\d{2}:\d{2}/);
    });

    it("has correct layout for user messages", () => {
      expect(wrapper.find(".message").classes()).toContain("message--user");
      expect(wrapper.find(".message-content").exists()).toBe(true);
    });
  });

  describe("AI Message", () => {
    beforeEach(() => {
      wrapper = mount(ChatMessage, {
        props: {
          message: aiMessage,
        },
      });
    });

    it("renders AI message correctly", () => {
      expect(wrapper.find(".message").exists()).toBe(true);
      expect(wrapper.find(".message").classes()).toContain("message--ai");
      expect(wrapper.find(".message-text").text()).toBe(
        "I am doing well, thank you for asking!"
      );
    });

    it("displays AI avatar correctly", () => {
      const avatar = wrapper.find(".avatar");
      expect(avatar.exists()).toBe(true);
      expect(avatar.classes()).toContain("avatar--ai");
      expect(avatar.text()).toBe("AI");
    });

    it("applies AI styling to message bubble", () => {
      const bubble = wrapper.find(".message-bubble");
      expect(bubble.classes()).toContain("bubble--ai");
    });

    it("has correct layout for AI messages", () => {
      expect(wrapper.find(".message").classes()).not.toContain("message--user");
      expect(wrapper.find(".message-content").exists()).toBe(true);
    });
  });

  describe("Message Content", () => {
    it("handles long messages", () => {
      const longMessage = {
        ...userMessage,
        content:
          "This is a very long message that should be properly wrapped and displayed in the message bubble without breaking the layout or causing any overflow issues.",
      };

      wrapper = mount(ChatMessage, {
        props: {
          message: longMessage,
        },
      });

      expect(wrapper.find(".message-text").text()).toBe(longMessage.content);
      expect(wrapper.find(".message-bubble").exists()).toBe(true);
    });

    it("handles empty messages", () => {
      const emptyMessage = {
        ...userMessage,
        content: "",
      };

      wrapper = mount(ChatMessage, {
        props: {
          message: emptyMessage,
        },
      });

      expect(wrapper.find(".message-text").text()).toBe("");
      expect(wrapper.find(".message-bubble").exists()).toBe(true);
    });

    it("handles special characters and emojis", () => {
      const specialMessage = {
        ...userMessage,
        content: "Hello! 👋 How are you? 😊 Special chars: @#$%^&*()",
      };

      wrapper = mount(ChatMessage, {
        props: {
          message: specialMessage,
        },
      });

      expect(wrapper.find(".message-text").text()).toBe(specialMessage.content);
    });
  });

  describe("Time Formatting", () => {
    it("formats time correctly", () => {
      // Test the formatTime method directly
      const testDate = new Date("2023-12-01T14:30:00Z");
      const formattedTime = wrapper.vm.formatTime(testDate);

      // Should be in HH:MM format
      expect(formattedTime).toMatch(/\d{2}:\d{2}/);
    });

    it("handles different time formats", () => {
      const morningMessage = {
        ...userMessage,
        timestamp: new Date("2023-12-01T09:05:00Z"),
      };

      wrapper = mount(ChatMessage, {
        props: {
          message: morningMessage,
        },
      });

      const timeElement = wrapper.find(".message-time");
      expect(timeElement.text()).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = mount(ChatMessage, {
        props: {
          message: userMessage,
        },
      });
    });

    it("has proper semantic structure", () => {
      expect(wrapper.find(".message").exists()).toBe(true);
      expect(wrapper.find(".message-content").exists()).toBe(true);
      expect(wrapper.find(".message-text").element.tagName).toBe("P");
    });

    it("provides distinct visual indicators for user vs AI", () => {
      // User message
      expect(wrapper.find(".avatar--user").exists()).toBe(true);
      expect(wrapper.find(".bubble--user").exists()).toBe(true);

      // Switch to AI message
      wrapper = mount(ChatMessage, {
        props: {
          message: aiMessage,
        },
      });

      expect(wrapper.find(".avatar--ai").exists()).toBe(true);
      expect(wrapper.find(".bubble--ai").exists()).toBe(true);
    });
  });

  describe("Responsive Design", () => {
    it("has responsive CSS classes", () => {
      wrapper = mount(ChatMessage, {
        props: {
          message: userMessage,
        },
      });

      // Check that the component has the structure needed for responsive design
      expect(wrapper.find(".message").exists()).toBe(true);
      expect(wrapper.find(".message-bubble").exists()).toBe(true);
      expect(wrapper.find(".avatar").exists()).toBe(true);
    });
  });
});
