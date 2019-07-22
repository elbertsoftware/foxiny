import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from './Tooltip';

describe('Render Tooltip component', () => {
  const MuiTooltip = (
    <Tooltip title="Testing">
      <div />
    </Tooltip>
  );
  it('Render correctly with default state', () => {
    const component = shallow(MuiTooltip).dive();
    expect(component.state('arrowRef')).toBe(null);
  });
  it('Render correctly after updating state', () => {
    const component = shallow(MuiTooltip)
      .dive()
      .instance()
      .setState({ arrowRef: 'test' });
    expect(component.state('arrowRef')).toEqual('test');
  });
  it('Render correctly title', () => {
    const component = shallow(MuiTooltip);
    expect(component.props().title).toBe('Testing');
  });
});
