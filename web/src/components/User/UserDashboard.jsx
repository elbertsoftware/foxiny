/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Redirect } from 'react-router';
import UserHeader from './UserHeader';
import Loading from '../App/Loading';

class UserDashboard extends React.Component {
  render() {
    const { history, match, isLoggedIn, isLoading } = this.props;
    if (!isLoggedIn()) {
      return <Redirect to="/signin" />;
    }
    if (isLoading()) {
      return <Loading />;
    }
    return <UserHeader user={isLoggedIn} history={history} match={match} />;
  }
}
export default UserDashboard;
