import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import TestAppForm from './AppForm';
import LayoutBody from '../LayoutBody/LayoutBody';
import Paper from '../Paper/Paper';

const defaultProps = {
    square: false,
    width: 'small',
  },
  AppForm = props => <TestAppForm {...defaultProps} {...props} />;

describe('App form', () => {
  it('render correctly App Form component', () => {
    // Snapshot
    const AppFormComponent = renderer.create(<AppForm />).toJSON();
    expect(AppFormComponent).toMatchSnapshot();
  });
  describe('render correctly children', () => {
    it('chilren is undefined by default', () => {
      const AppFormComponent = mount(<AppForm />);
      expect(AppFormComponent.props().children).toEqual(undefined);
    });
    it('render with defined children', () => {
      const AppFormComponent = shallow(<AppForm>Minh Kha</AppForm>);
      expect(AppFormComponent.contains('Minh Kha')).toBeTruthy();
    });
  });
  describe('render correctly width, square props', () => {
    it('check default props by default values', () => {
      const AppFormComponent = shallow(<AppForm />);
      expect(AppFormComponent.props().width).toBe('small');
    });
    it('render correctly with LayoutBody, and Paper', () => {
      // Snapshot
      const AppFormComponent = renderer.create(<AppForm />);
      const AppFormInstance = AppFormComponent.root;
      expect(AppFormInstance.findByType(LayoutBody).props.width).toBe('small');
      expect(AppFormInstance.findByType(Paper).props.square).toBeFalsy();
    });
    it('props is render with defined width, and square', () => {
      const props = {
        width: 'medium',
        square: true,
      };
      const AppFormComponent = mount(<AppForm {...props} />);
      expect(AppFormComponent.prop('width')).toBe('medium');
      expect(AppFormComponent.prop('square')).toBeTruthy();
    });
  });
});
