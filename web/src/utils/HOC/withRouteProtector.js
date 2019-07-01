/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import getCurrentUser from '../graphql/getCurrentUser';
import Loading from '../components/App/Loading';

export default ProtectedRoute => {
  class AuthHOC extends Component {
    // Check if there is validated user logged
    userLoggedIn = () => {
      return this.props.user;
    };

    render() {
      const { loading, error } = this.props;
      if (loading) return <Loading />;
      // Pass the received 'props' and created functions to the ProtectedRoute component
      return <ProtectedRoute {...this.props} userLoggedIn={this.userLoggedIn} error={error} />;
    }
  }

  // AuthHOC.contextTypes = {
  //   router: PropTypes.object.isRequired,
  // };

  return graphql(getCurrentUser, {
    props: ({ data: { loading, me, error } }) => ({
      loading,
      user: me,
      error,
    }),
  })(withRouter(AuthHOC));
};
