import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import TestSelectList from './SelectList';

const SelectList = props => <TestSelectList value="value" {...props} />;

describe('Render SelectList component', () => {
  it('Render no children by default', () => {
    const component = shallow(<SelectList />);
    expect(component.prop('children')).toBe(undefined);
  });
  it('Render with children', () => {
    const component = shallow(<SelectList>Test</SelectList>);
    expect(component.props().children).toBe('Test');
  });
  it('Render correctly render prop', () => {
    const component = mount(<SelectList render={() => <p>Kha</p>} />);
    // console.log(renderer.create(component.props().render()).toJSON());
    expect(renderer.create(component.props().render()).toJSON()).toMatchObject(renderer.create(<p>Kha</p>).toJSON());
  });
});
