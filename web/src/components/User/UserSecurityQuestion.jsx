import React from 'react';
import { Redirect } from 'react-router';
import SecurityQuesForm from '../Form/SecurityQuesForm';
import Loading from '../App/Loading';

const UserSecurityQuestion = ({ isLoggedIn, isLoading, history }) => {
  if (!isLoggedIn()) {
    return <Redirect to="/signin" />;
  }
  if (isLoading()) {
    return <Loading />;
  }
  return (
    <div>
      <SecurityQuesForm history={history} />
    </div>
  );
};
export default UserSecurityQuestion;
