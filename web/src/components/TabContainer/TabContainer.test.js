import React from 'react';
import { shallow } from 'enzyme';
import TabContainer from './TabContainer';

describe('Render Tab container', () => {
  it('Render children by default', () => {
    const component = shallow(
      <TabContainer dir="left">
        <div />
      </TabContainer>,
    );
    expect(component.contains(<div />)).toBe(true);
  });
  it('Render with className is string', () => {
    const component = shallow(
      <TabContainer className="container" dir="left">
        <div />
      </TabContainer>,
    );
    expect(component.contains(<div />)).toBe(true);
    expect(typeof component.props().className).toBe('string');
  });
});
