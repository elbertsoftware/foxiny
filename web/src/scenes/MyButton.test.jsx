// @flow

import React from 'react';
import { shallow } from 'enzyme';

import MyButton from './MyButton';

describe('<MyButton />', () => {
  it('Should render button', () => {
    const wrapper = shallow(<MyButton />);
    expect(wrapper.length).toEqual(1);
  });

  it('Should be able to click the button', () => {
    const mockCountFunc = jest.fn();
    const wrapper = shallow(<MyButton countFunc={mockCountFunc} />);
    const btn = wrapper.find('button');
    btn.simulate('click');
    expect(mockCountFunc).toHaveBeenCalled();
  });
});
