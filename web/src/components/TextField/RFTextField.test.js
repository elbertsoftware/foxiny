import React from 'react';
import { shallow, mount } from 'enzyme';
import TextField from './RFTextField';

describe('Render text field component', () => {
  it('Render correctly props passed in', () => {
    const props = {
      input: {
        name: 'field',
      },
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
});
