import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders prop.msg when passed', () => {
    const msg = 'Hello Vitest'
    const wrapper = mount(HelloWorld, { props: { msg } })
    expect(wrapper.text()).toContain(msg)
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Test' } })
    const button = wrapper.find('button')
    
    expect(wrapper.text()).toContain('count is 0')
    
    await button.trigger('click')
    expect(wrapper.text()).toContain('count is 1')
    
    await button.trigger('click')
    expect(wrapper.text()).toContain('count is 2')
  })
})