import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ChatInput from '@/components/ChatInput.vue'

describe('ChatInput', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ChatInput)
  })

  it('renders correctly', () => {
    expect(wrapper.find('.chat-input').exists()).toBe(true)
    expect(wrapper.find('.input-container').exists()).toBe(true)
    expect(wrapper.find('.message-input').exists()).toBe(true)
    expect(wrapper.find('.send-button').exists()).toBe(true)
  })

  it('has correct placeholder text', () => {
    const textarea = wrapper.find('.message-input')
    expect(textarea.attributes('placeholder')).toBe('Type a message...')
  })

  it('starts with empty message', () => {
    expect(wrapper.vm.message).toBe('')
    expect(wrapper.find('.message-input').element.value).toBe('')
  })

  it('send button is disabled when message is empty', () => {
    const sendButton = wrapper.find('.send-button')
    expect(sendButton.attributes('disabled')).toBeDefined()
  })

  it('send button is enabled when message has content', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Hello world')
    
    const sendButton = wrapper.find('.send-button')
    expect(sendButton.attributes('disabled')).toBeUndefined()
  })

  it('emits send-message when send button is clicked', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    
    expect(wrapper.emitted('send-message')).toBeTruthy()
    expect(wrapper.emitted('send-message')![0]).toEqual(['Test message'])
  })

  it('clears message after sending', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    
    expect(wrapper.vm.message).toBe('')
    expect(textarea.element.value).toBe('')
  })

  it('sends message on Enter key (without Shift)', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    
    expect(wrapper.emitted('send-message')).toBeTruthy()
    expect(wrapper.emitted('send-message')![0]).toEqual(['Test message'])
  })

  it('does not send message on Shift+Enter', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
    
    expect(wrapper.emitted('send-message')).toBeFalsy()
    expect(wrapper.vm.message).toBe('Test message')
  })

  it('prevents default behavior on Enter key', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    const mockEvent = {
      key: 'Enter',
      shiftKey: false,
      preventDefault: vi.fn()
    }
    
    wrapper.vm.handleKeydown(mockEvent)
    
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('adjusts textarea height on input', async () => {
    const textarea = wrapper.find('.message-input')
    
    // Mock the textarea element and its properties
    const mockTextarea = {
      style: { height: '' },
      scrollHeight: 60
    }
    wrapper.vm.textarea = mockTextarea
    
    await wrapper.vm.adjustTextareaHeight()
    
    expect(mockTextarea.style.height).toBe('60px')
  })

  it('limits textarea height to maximum', async () => {
    const textarea = wrapper.find('.message-input')
    
    // Mock textarea with large scroll height
    const mockTextarea = {
      style: { height: '' },
      scrollHeight: 200
    }
    wrapper.vm.textarea = mockTextarea
    
    await wrapper.vm.adjustTextareaHeight()
    
    // Should be limited to 120px max
    expect(mockTextarea.style.height).toBe('120px')
  })

  it('handles composition events for IME input', async () => {
    const textarea = wrapper.find('.message-input')
    
    // Start composition
    await textarea.trigger('compositionstart')
    expect(wrapper.vm.isComposing).toBe(true)
    
    // End composition
    await textarea.trigger('compositionend')
    expect(wrapper.vm.isComposing).toBe(false)
  })

  it('does not send message during composition', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('Test message')
    
    // Start composition
    wrapper.vm.isComposing = true
    
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    
    expect(wrapper.emitted('send-message')).toBeFalsy()
  })

  it('trims whitespace from messages', async () => {
    const textarea = wrapper.find('.message-input')
    await textarea.setValue('  Test message  ')
    
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    
    expect(wrapper.emitted('send-message')![0]).toEqual(['Test message'])
  })

  it('does not send empty or whitespace-only messages', async () => {
    const textarea = wrapper.find('.message-input')
    
    // Test empty message
    await textarea.setValue('')
    let sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    expect(wrapper.emitted('send-message')).toBeFalsy()
    
    // Test whitespace-only message
    await textarea.setValue('   ')
    sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')
    expect(wrapper.emitted('send-message')).toBeFalsy()
  })

  it('resets textarea height after sending', async () => {
    const mockTextarea = {
      style: { height: '80px' }
    }
    wrapper.vm.textarea = mockTextarea
    
    await wrapper.vm.resetTextareaHeight()
    
    expect(mockTextarea.style.height).toBe('auto')
  })

  it('handles input event and adjusts height', async () => {
    const adjustHeightSpy = vi.spyOn(wrapper.vm, 'adjustTextareaHeight')
    
    const textarea = wrapper.find('.message-input')
    await textarea.trigger('input')
    
    // Need to wait for nextTick
    await wrapper.vm.$nextTick()
    
    expect(adjustHeightSpy).toHaveBeenCalled()
  })

  it('has correct textarea attributes', () => {
    const textarea = wrapper.find('.message-input')
    expect(textarea.attributes('rows')).toBe('1')
    expect(textarea.element.tagName).toBe('TEXTAREA')
  })

  it('displays send icon in button', () => {
    const sendButton = wrapper.find('.send-button')
    const svg = sendButton.find('svg')
    expect(svg.exists()).toBe(true)
  })

  describe('Responsive Design', () => {
    it('has mobile-responsive classes', () => {
      expect(wrapper.find('.chat-input').exists()).toBe(true)
      expect(wrapper.find('.input-container').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('has proper focus management', async () => {
      const textarea = wrapper.find('.message-input')
      
      // Should be focusable (check element properties)
      expect(textarea.element.tagName).toBe('TEXTAREA')
      expect(textarea.attributes('tabindex')).not.toBe('-1')
    })

    it('has semantic button for send action', () => {
      const sendButton = wrapper.find('.send-button')
      expect(sendButton.element.tagName).toBe('BUTTON')
    })
  })
})