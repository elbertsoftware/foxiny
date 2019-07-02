/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Redirect } from 'react-router';
import UserHeader from './components/UserProfileHeader/UserProfileHeader';

class UserDashboard extends React.Component {
  render() {
    const { history, match, userLoggedIn } = this.props;
    if (!userLoggedIn()) {
      return <Redirect to="/signin" />;
    }
    return (
      <React.Fragment>
        {userLoggedIn() && <UserHeader user={userLoggedIn()} history={history} match={match} />}
      </React.Fragment>
    );
  }
}
export default UserDashboard;
