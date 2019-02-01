/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import UserHeader from './UserHeader';

class UserDashboard extends React.Component {
  render() {
    const { match } = this.props;
    return <UserHeader match={match} />;
  }
}
export default UserDashboard;
