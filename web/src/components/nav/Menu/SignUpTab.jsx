import React from 'react';
import { Tabs } from 'gestalt';

class SignUpTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this.handleChange = this._handleChange.bind(this);
  }

  _handleChange({ activeTabIndex, event }) {
    event.preventDefault();
    this.setState({
      activeIndex: activeTabIndex,
    });
  }

  render() {
    return (
      <Tabs
        tabs={[
          {
            text: 'Boards',
            href: '#',
          },
          {
            text: 'Pins',
            href: '#',
          },
          {
            text: 'Topics',
            href: '#',
          },
        ]}
        activeTabIndex={this.state.activeIndex}
        onChange={this.handleChange}
      />
    );
  }
}
export default SignUpTab;
