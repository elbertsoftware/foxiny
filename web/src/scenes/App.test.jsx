// @flow

import React from 'react';
import { shallow } from 'enzyme';

import App from './App';

describe('<App />', () => {
  it('Should render the App', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.length).toEqual(1);
  });
});
