import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import TestLayoutBody from './LayoutBody';

const defaultProps = {
    component: 'div',
    fullHeight: false,
    fullWidth: false,
    margin: false,
    marginBottom: false,
    width: 'small',
  },
  LayoutBody = props => <TestLayoutBody {...props} {...defaultProps} />;

describe('Render layout body', () => {
  it('render correctly', () => {
    const LayoutComponent = renderer.create(<LayoutBody />).toJSON();
    expect(LayoutComponent).toMatchSnapshot();
  });

  describe('Render correct props', () => {
    it('Render with default props', () => {
      const LayoutComponent = shallow(<LayoutBody />);
      expect(LayoutComponent.props().component).toEqual('div');
      expect(LayoutComponent.props().fullHeight).toBeFalsy();
      expect(LayoutComponent.props().fullWidth).toBeFalsy();
      expect(LayoutComponent.props().margin).toBeFalsy();
      expect(LayoutComponent.props().marginBottom).toBeFalsy();
      expect(LayoutComponent.props().width).toEqual('small');
    });
    it('render with props', () => {
      const props = {
        component: () => <p />,
        width: 'xlarge',
      };
      const LayoutComponent = mount(<LayoutBody {...props} margin fullHeight />);
      expect(LayoutComponent.props().component).toBeInstanceOf(Function);
      expect(LayoutComponent.props().fullHeight).toBeTruthy();
      expect(LayoutComponent.props().fullWidth).toBeFalsy();
      expect(LayoutComponent.props().margin).toBeTruthy();
      expect(LayoutComponent.props().marginBottom).toBeFalsy();
      expect(LayoutComponent.props().width).toEqual('xlarge');
    });
    it('render with style object', () => {
      const props = {
        style: {
          root: { width: 200 },
        },
      };
      const LayoutComponent = shallow(<LayoutBody style={props.style} />);
      expect(LayoutComponent.props().style).toMatchObject({
        root: { width: 200 },
      });
    });
  });
  it('render children', () => {
    const LayoutComponent = mount(
      <LayoutBody>
        <p />
      </LayoutBody>,
    );
    expect(LayoutComponent.props().children.type).toEqual('p');
  });
});
