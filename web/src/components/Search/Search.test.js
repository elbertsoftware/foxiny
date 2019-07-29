import React from 'react';
import { shallow, mount } from 'enzyme';
import TestSearch from './Search';

describe('Render search component', () => {
  it('Render correctly default props', () => {
    const component = shallow(<TestSearch />);
    expect(component.props().background).toBe('light');
    expect(component.props().margin).toBeFalsy();
  });
  it('Render with props', () => {
    const props = {
      className: 'style-class',
      margin: true,
      background: 'dark',
    };
    const component = shallow(<TestSearch {...props} />);
    expect(typeof component.props().className).toBe('string');
    expect(component.props().margin).toBeTruthy();
    expect(component.props().background).toBe('dark');
  });
  it('Render right placeholder', () => {
    const component = mount(<TestSearch />);
    expect(
      component
        .find('input')
        .render()
        .attr('placeholder'),
    ).toBe('Tìm kiếm…');
  });
});
