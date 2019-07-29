import React from 'react';
import { shallow, mount } from 'enzyme';
import MuiTextField from './RFTextField';

describe('Render text field component', () => {
  const TextField = props => (
    <MuiTextField input={{ name: 'fullname' }} meta={{ error: 'This field is required', touched: true }} {...props} />
  );
  it('Render correctly meta prop', () => {
    const props = {
      meta: {
        touched: true,
        error: 'This field is required',
      },
    };

    const component = mount(<TextField {...props} />);
    expect(component.props().meta).toMatchObject({
      touched: true,
      error: 'This field is required',
    });
  });
  it('Render correctly input prop', () => {
    const component = shallow(<TextField />);
    expect(component.props().input).toMatchObject({
      name: 'fullname',
    });
  });
  it('Render correctly autocomplete prop', () => {
    const props = {
      autoComplete: 'given-name',
    };
    const component = mount(<TextField {...props} />);
    expect(component.props().autoComplete).toBe('given-name');
  });
});
