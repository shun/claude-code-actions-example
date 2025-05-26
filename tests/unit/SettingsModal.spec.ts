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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
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

  it("renders correctly when open", () => {
    expect(wrapper.find(".settings-modal").exists()).toBe(true);
    expect(wrapper.find(".modal-overlay").exists()).toBe(true);
    expect(wrapper.find(".modal-content").exists()).toBe(true);
    expect(wrapper.find("h3").text()).toBe("Settings");
  });

  it("does not render when closed", async () => {
    await wrapper.setProps({ isOpen: false });
    expect(wrapper.find(".settings-modal").exists()).toBe(false);
  });

  it("renders Gemini API key input field", () => {
    expect(wrapper.find('label[for="gemini-api-key"]').text()).toBe("Gemini API Key");
    expect(wrapper.find('#gemini-api-key').exists()).toBe(true);
    expect(wrapper.find('#gemini-api-key').attributes('type')).toBe('password');
    expect(wrapper.find('#gemini-api-key').attributes('placeholder')).toBe('Enter your Gemini API key');
  });

  it("loads API key from localStorage on mount", () => {
    localStorageMock.getItem.mockReturnValue('test-api-key');
    
    wrapper = mount(SettingsModal, {
      props: { isOpen: true },
    });

    expect(localStorageMock.getItem).toHaveBeenCalledWith('gemini-api-key');
    expect(wrapper.find('#gemini-api-key').element.value).toBe('test-api-key');
  });

  it("saves API key to localStorage when save button is clicked", async () => {
    const apiKeyInput = wrapper.find('#gemini-api-key');
    await apiKeyInput.setValue('new-test-key');

    const saveButton = wrapper.find('.save-btn');
    await saveButton.trigger('click');

    expect(localStorageMock.setItem).toHaveBeenCalledWith('gemini-api-key', 'new-test-key');
  });

  it("emits close event when save button is clicked", async () => {
    const saveButton = wrapper.find('.save-btn');
    await saveButton.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it("emits close event when cancel button is clicked", async () => {
    const cancelButton = wrapper.find('.cancel-btn');
    await cancelButton.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it("emits close event when overlay is clicked", async () => {
    const overlay = wrapper.find('.modal-overlay');
    await overlay.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it("does not close when modal content is clicked", async () => {
    const modalContent = wrapper.find('.modal-content');
    await modalContent.trigger('click');

    expect(wrapper.emitted('close')).toBeFalsy();
  });

  it("clears API key when clear button is clicked", async () => {
    const apiKeyInput = wrapper.find('#gemini-api-key');
    await apiKeyInput.setValue('test-key');

    const clearButton = wrapper.find('.clear-btn');
    await clearButton.trigger('click');

    expect(apiKeyInput.element.value).toBe('');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('gemini-api-key');
  });

  it("shows validation message for empty API key", async () => {
    const saveButton = wrapper.find('.save-btn');
    await saveButton.trigger('click');

    expect(wrapper.find('.validation-message').exists()).toBe(true);
    expect(wrapper.find('.validation-message').text()).toBe('API key is required');
  });

  it("hides validation message when valid API key is entered", async () => {
    // First trigger validation
    const saveButton = wrapper.find('.save-btn');
    await saveButton.trigger('click');
    expect(wrapper.find('.validation-message').exists()).toBe(true);

    // Then enter valid key
    const apiKeyInput = wrapper.find('#gemini-api-key');
    await apiKeyInput.setValue('valid-key');
    await saveButton.trigger('click');

    expect(wrapper.find('.validation-message').exists()).toBe(false);
  });

  it("shows/hides API key with toggle button", async () => {
    const apiKeyInput = wrapper.find('#gemini-api-key');
    const toggleButton = wrapper.find('.toggle-visibility-btn');

    expect(apiKeyInput.attributes('type')).toBe('password');

    await toggleButton.trigger('click');
    expect(apiKeyInput.attributes('type')).toBe('text');

    await toggleButton.trigger('click');
    expect(apiKeyInput.attributes('type')).toBe('password');
  });
});