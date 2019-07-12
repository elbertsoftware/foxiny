import React from 'react';
import { shallow, mount } from 'enzyme';
import { DialogTitle } from './Dialog';

const DialogComponent = props => <DialogTitle onClose={() => {}} {...props} />;

describe('Dialog Title component', () => {
  it('Check children prop', () => {
    const component = shallow(
      <DialogComponent>
        <div />
      </DialogComponent>,
    );
    expect(component.props().children.type).toEqual('div');
  });
  it('Check onClose function', () => {
    const mock = jest.fn();
    const component = mount(<DialogComponent onClose={mock} />);
    component.find('button').simulate('click');
    expect(mock).toBeCalledWith(expect.anything());
  });
  it('Render correctly without onClose function', () => {
    const component = mount(<DialogTitle />);
    expect(component.find('button').exists()).toBeFalsy();
  });
});
