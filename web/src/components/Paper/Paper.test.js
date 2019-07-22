import React from 'react';
import { shallow } from 'enzyme';
import TestPaper from './Paper';

describe('Paper component', () => {
  it('Render with right default props', () => {
    const component = shallow(<TestPaper />);
    expect(component.props().background).toBe('light');
    expect(component.props().padding).toBeFalsy();
  });
  it('Render with props passed in', () => {
    const props = {
      background: 'main',
    };
    const component = shallow(<TestPaper {...props} padding />);
    expect(component.props().background).toBe('main');
    expect(component.props().padding).toBeTruthy();
  });
  it('Check proptype for className is string', () => {
    const component = shallow(<TestPaper className="class" />);
    expect(typeof component.props().className).toBe('string');
  });
});
