import React, { Component } from 'react';
import { Redirect } from 'react-router';
import SecurityQuesForm from '../Form/SecurityQuesForm';
import Loading from '../App/Loading';

export default class UserSecurityQuestion extends Component {
  render() {
    const { isLoggedIn, isLoading } = this.props;
    if (!isLoggedIn()) {
      return <Redirect to="/signin" />;
    }
    if (isLoading()) {
      return <Loading />;
    }
    return (
      <div>
        <SecurityQuesForm />
      </div>
    );
  }
}
