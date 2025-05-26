import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import ModelSelector from '@/components/ModelSelector.vue'

describe('ModelSelector', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(ModelSelector, {
      props: {
        modelValue: 'openai'
      }
    })
  })

  it('renders correctly with initial model', () => {
    expect(wrapper.find('.model-selector').exists()).toBe(true)
    expect(wrapper.find('.selector-button').exists()).toBe(true)
    expect(wrapper.find('.selected-model').text()).toBe('OpenAI GPT')
  })

  it('displays all available models', () => {
    const models = wrapper.vm.models
    expect(models).toHaveLength(3)
    expect(models[0]).toEqual({
      value: 'openai',
      label: 'OpenAI GPT',
      description: 'GPT-4 and GPT-3.5'
    })
    expect(models[1]).toEqual({
      value: 'claude',
      label: 'Anthropic Claude',
      description: 'Claude 3 family'
    })
    expect(models[2]).toEqual({
      value: 'gemini',
      label: 'Google Gemini',
      description: 'Gemini Pro'
    })
  })

  it('toggles dropdown when button is clicked', async () => {
    // Initially closed
    expect(wrapper.find('.dropdown').exists()).toBe(false)
    
    // Click to open
    await wrapper.find('.selector-button').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(true)
    expect(wrapper.find('.selector-button').classes()).toContain('active')
    
    // Click to close
    await wrapper.find('.selector-button').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  it('shows dropdown items when open', async () => {
    await wrapper.find('.selector-button').trigger('click')
    
    const dropdownItems = wrapper.findAll('.dropdown-item')
    expect(dropdownItems).toHaveLength(3)
    
    expect(dropdownItems[0].find('.model-name').text()).toBe('OpenAI GPT')
    expect(dropdownItems[0].find('.model-description').text()).toBe('GPT-4 and GPT-3.5')
    
    expect(dropdownItems[1].find('.model-name').text()).toBe('Anthropic Claude')
    expect(dropdownItems[1].find('.model-description').text()).toBe('Claude 3 family')
    
    expect(dropdownItems[2].find('.model-name').text()).toBe('Google Gemini')
    expect(dropdownItems[2].find('.model-description').text()).toBe('Gemini Pro')
  })

  it('highlights selected model in dropdown', async () => {
    await wrapper.find('.selector-button').trigger('click')
    
    const dropdownItems = wrapper.findAll('.dropdown-item')
    expect(dropdownItems[0].classes()).toContain('selected')
    expect(dropdownItems[1].classes()).not.toContain('selected')
    expect(dropdownItems[2].classes()).not.toContain('selected')
  })

  it('shows check icon for selected model', async () => {
    await wrapper.find('.selector-button').trigger('click')
    
    const selectedItem = wrapper.find('.dropdown-item.selected')
    expect(selectedItem.find('.check-icon').exists()).toBe(true)
    
    const nonSelectedItems = wrapper.findAll('.dropdown-item:not(.selected)')
    nonSelectedItems.forEach(item => {
      expect(item.find('.check-icon').exists()).toBe(false)
    })
  })

  it('emits update:modelValue when model is selected', async () => {
    await wrapper.find('.selector-button').trigger('click')
    
    const claudeItem = wrapper.findAll('.dropdown-item')[1]
    await claudeItem.trigger('click')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['claude'])
  })

  it('closes dropdown after selecting a model', async () => {
    await wrapper.find('.selector-button').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(true)
    
    const geminiItem = wrapper.findAll('.dropdown-item')[2]
    await geminiItem.trigger('click')
    
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  it('rotates chevron icon when dropdown is open', async () => {
    const chevron = wrapper.find('.chevron')
    expect(chevron.classes()).not.toContain('rotated')
    
    await wrapper.find('.selector-button').trigger('click')
    expect(chevron.classes()).toContain('rotated')
  })

  it('works with different initial modelValue props', async () => {
    await wrapper.unmount()
    
    wrapper = mount(ModelSelector, {
      props: {
        modelValue: 'claude'
      }
    })
    
    expect(wrapper.find('.selected-model').text()).toBe('Anthropic Claude')
    
    await wrapper.find('.selector-button').trigger('click')
    const dropdownItems = wrapper.findAll('.dropdown-item')
    expect(dropdownItems[1].classes()).toContain('selected')
  })

  it('closes dropdown on blur', async () => {
    await wrapper.find('.selector-button').trigger('click')
    expect(wrapper.find('.dropdown').exists()).toBe(true)
    
    await wrapper.find('.model-selector').trigger('blur')
    expect(wrapper.find('.dropdown').exists()).toBe(false)
  })

  it('handles keyboard navigation', () => {
    const selectorElement = wrapper.find('.model-selector')
    expect(selectorElement.attributes('tabindex')).toBe('0')
  })
})