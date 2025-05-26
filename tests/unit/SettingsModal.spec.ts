import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import SettingsModal from "@/components/SettingsModal.vue";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("SettingsModal", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(SettingsModal, {
      props: {
        isOpen: true,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe("Component Rendering", () => {
    it("renders correctly when open", () => {
      expect(wrapper.find(".modal-overlay").exists()).toBe(true);
      expect(wrapper.find(".modal-content").exists()).toBe(true);
      expect(wrapper.find("h3").text()).toBe("Settings");
    });

    it("does not render when closed", async () => {
      await wrapper.setProps({ isOpen: false });
      expect(wrapper.find(".modal-overlay").exists()).toBe(false);
    });

    it("renders API key input field", () => {
      const input = wrapper.find("#gemini-api-key");
      expect(input.exists()).toBe(true);
      expect(input.attributes("type")).toBe("password");
      expect(input.attributes("placeholder")).toBe("Enter your Gemini API key");
    });

    it("renders all control buttons", () => {
      const buttons = wrapper.findAll(".btn");
      expect(buttons.length).toBe(3);
      expect(buttons[0].text()).toBe("Clear");
      expect(buttons[1].text()).toBe("Cancel");
      expect(buttons[2].text()).toBe("Save");
    });

    it("renders help text with correct link", () => {
      const helpText = wrapper.find(".help-text");
      expect(helpText.exists()).toBe(true);
      expect(helpText.text()).toContain("Get your API key from");
      
      const link = helpText.find("a");
      expect(link.exists()).toBe(true);
      expect(link.attributes("href")).toBe("https://makersuite.google.com/app/apikey");
      expect(link.attributes("target")).toBe("_blank");
    });
  });

  describe("API Key Input", () => {
    it("loads stored API key on mount", () => {
      localStorageMock.getItem.mockReturnValue("stored-api-key");
      
      const newWrapper = mount(SettingsModal, {
        props: { isOpen: true },
      });
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith("gemini_api_key");
      // Note: We'd need to wait for the component to fully initialize
      // In a real test, you might need to use nextTick or a different approach
    });

    it("handles localStorage errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });
      
      expect(() => {
        mount(SettingsModal, {
          props: { isOpen: true },
        });
      }).not.toThrow();
    });

    it("updates API key input value", async () => {
      const input = wrapper.find("#gemini-api-key");
      await input.setValue("new-api-key");
      expect(input.element.value).toBe("new-api-key");
    });

    it("toggles password visibility", async () => {
      const input = wrapper.find("#gemini-api-key");
      const toggleBtn = wrapper.find(".toggle-visibility-btn");
      
      expect(input.attributes("type")).toBe("password");
      
      await toggleBtn.trigger("click");
      expect(input.attributes("type")).toBe("text");
      
      await toggleBtn.trigger("click");
      expect(input.attributes("type")).toBe("password");
    });
  });

  describe("Save Functionality", () => {
    it("saves API key to localStorage", async () => {
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      await saveBtn.trigger("click");
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith("gemini_api_key", "test-api-key");
    });

    it("shows success message after saving", async () => {
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      await saveBtn.trigger("click");
      await wrapper.vm.$nextTick();
      
      const successMessage = wrapper.find(".success-message");
      expect(successMessage.exists()).toBe(true);
      expect(successMessage.text()).toBe("API key saved successfully");
    });

    it("emits settings-saved event after saving", async () => {
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      await saveBtn.trigger("click");
      
      expect(wrapper.emitted("settings-saved")).toBeTruthy();
    });

    it("shows error for empty API key", async () => {
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await saveBtn.trigger("click");
      await wrapper.vm.$nextTick();
      
      const errorMessage = wrapper.find(".error-message");
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toBe("API key is required");
    });

    it("handles localStorage save errors", async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });
      
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      await saveBtn.trigger("click");
      await wrapper.vm.$nextTick();
      
      const errorMessage = wrapper.find(".error-message");
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toBe("Failed to save API key");
    });

    it("disables save button when loading", async () => {
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      
      // Mock a slow localStorage operation
      localStorageMock.setItem.mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      });
      
      saveBtn.trigger("click");
      await wrapper.vm.$nextTick();
      
      expect(saveBtn.attributes("disabled")).toBeDefined();
    });
  });

  describe("Clear Functionality", () => {
    it("clears API key input and localStorage", async () => {
      const input = wrapper.find("#gemini-api-key");
      const clearBtn = wrapper.findAll(".btn")[0];
      
      await input.setValue("test-api-key");
      await clearBtn.trigger("click");
      
      expect(input.element.value).toBe("");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("gemini_api_key");
    });

    it("shows success message after clearing", async () => {
      const clearBtn = wrapper.findAll(".btn")[0];
      
      await clearBtn.trigger("click");
      await wrapper.vm.$nextTick();
      
      const successMessage = wrapper.find(".success-message");
      expect(successMessage.exists()).toBe(true);
      expect(successMessage.text()).toBe("API key cleared");
    });
  });

  describe("Modal Controls", () => {
    it("closes modal when cancel button is clicked", async () => {
      const cancelBtn = wrapper.findAll(".btn")[1];
      
      await cancelBtn.trigger("click");
      
      expect(wrapper.emitted("update:isOpen")).toBeTruthy();
      expect(wrapper.emitted("update:isOpen")[0]).toEqual([false]);
    });

    it("closes modal when close button is clicked", async () => {
      const closeBtn = wrapper.find(".close-btn");
      
      await closeBtn.trigger("click");
      
      expect(wrapper.emitted("update:isOpen")).toBeTruthy();
      expect(wrapper.emitted("update:isOpen")[0]).toEqual([false]);
    });

    it("closes modal when overlay is clicked", async () => {
      const overlay = wrapper.find(".modal-overlay");
      
      await overlay.trigger("click");
      
      expect(wrapper.emitted("update:isOpen")).toBeTruthy();
      expect(wrapper.emitted("update:isOpen")[0]).toEqual([false]);
    });

    it("does not close modal when content is clicked", async () => {
      const content = wrapper.find(".modal-content");
      
      await content.trigger("click");
      
      expect(wrapper.emitted("update:isOpen")).toBeFalsy();
    });

    it("closes modal on Escape key", async () => {
      const overlay = wrapper.find(".modal-overlay");
      
      await overlay.trigger("keydown", { key: "Escape" });
      
      expect(wrapper.emitted("update:isOpen")).toBeTruthy();
      expect(wrapper.emitted("update:isOpen")[0]).toEqual([false]);
    });

    it("saves on Enter key", async () => {
      const input = wrapper.find("#gemini-api-key");
      const overlay = wrapper.find(".modal-overlay");
      
      await input.setValue("test-api-key");
      await overlay.trigger("keydown", { key: "Enter" });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith("gemini_api_key", "test-api-key");
    });
  });

  describe("Button States", () => {
    it("enables save button when API key is provided", async () => {
      const input = wrapper.find("#gemini-api-key");
      const saveBtn = wrapper.findAll(".btn")[2];
      
      await input.setValue("test-api-key");
      
      expect(saveBtn.attributes("disabled")).toBeUndefined();
    });

    it("disables save button when API key is empty", async () => {
      const saveBtn = wrapper.findAll(".btn")[2];
      
      expect(saveBtn.attributes("disabled")).toBeDefined();
    });

    it("disables all buttons when loading", async () => {
      const input = wrapper.find("#gemini-api-key");
      
      await input.setValue("test-api-key");
      
      // Simulate loading state
      await wrapper.setData({ isLoading: true });
      
      const buttons = wrapper.findAll(".btn");
      buttons.forEach(button => {
        expect(button.attributes("disabled")).toBeDefined();
      });
    });
  });
});