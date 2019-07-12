import React from 'react';
import { shallow, mount } from 'enzyme';
import FormButton from './FormButton';

// Form button is wrapped by defer HOC, and defer HOC required children when using FormButton
describe('Form Button', () => {
  it('Render when when mounted', () => {
    const props = {
      mounted: true,
    };
    const wrapper = mount(<FormButton {...props}>Button</FormButton>);
    expect(wrapper.prop('mounted')).toEqual(true);
  });
  it('Button type should be submit', () => {
    const wrapper = mount(<FormButton>Button</FormButton>);
    expect(wrapper.find('button').prop('type')).toEqual('submit');
  });
  it('Render with correct disabled prop', () => {
    const props = {
      disabled: true,
    };
    const wrapper = shallow(<FormButton {...props} />);
    expect(wrapper.props().disabled).toBeTruthy();
  });
});
