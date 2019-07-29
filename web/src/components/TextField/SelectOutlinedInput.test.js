import React from 'react';
import { shallow } from 'enzyme';
import MuiSelectOutlinedInput from './SelectOutlinedInput';

describe('Render correctly props', () => {
  const SelectOutlinedInput = props => (
    <MuiSelectOutlinedInput
      input={{
        value: 'selected',
      }}
      meta={{ error: 'This field is required' }}
      {...props}
    />
  );
  it('Render correctly with value', () => {
    const props = {};
    const component = shallow(<SelectOutlinedInput {...props} />);
    expect(component.props().input.value).toBe('selected');
  });
  it('Render correctly with error', () => {
    const props = {
      input: {
        value: 'selected',
      },
    };
    const component = shallow(<SelectOutlinedInput {...props} />);
    expect(component.props().meta.error).toBe('This field is required');
  });
});
