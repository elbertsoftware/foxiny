/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Redirect } from 'react-router';
import UserHeader from './UserHeader';

class UserDashboard extends React.Component {
  render() {
    const { history, match, isLoggedIn, isLoading } = this.props;
    if (!isLoggedIn()) {
      return <Redirect to="/signin" />;
    }
    return <UserHeader loading={isLoading()} history={history} match={match} />;
  }
}
export default UserDashboard;
