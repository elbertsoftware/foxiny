import React from 'react';
import { shallow, mount } from 'enzyme';
import TestLoading from './Loading';

describe('Loading component', () => {
  it('Render correctly circle progress', () => {
    const component = mount(<TestLoading circle />);
    expect(component).toMatchSnapshot();
  });
  it('Render correctly linear progress', () => {
    const component = mount(<TestLoading />);
    expect(component).toMatchSnapshot();
  });
  it('Render correctly default props', () => {
    const component = shallow(<TestLoading />);
    expect(component.props().circle).toBeFalsy();
  });
});
