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
    isLoggedIn = () => {
      return this.props.user;
    };

    // Check if the Authorization query is loading
    isLoading = () => {
      return this.props.loading;
    };

    render() {
      if (this.isLoading()) {
        return <Loading />;
      }
      // Pass the received 'props' and created functions to the ProtectedRoute component
      return <ProtectedRoute {...this.props} isLoggedIn={this.isLoggedIn} isLoading={this.isLoading} />;
    }
  }

  AuthHOC.contextTypes = {
    router: PropTypes.object.isRequired,
  };

  return graphql(getCurrentUser, {
    props: ({ data: { loading, me } }) => ({
      loading,
      user: me,
    }),
  })(withRouter(AuthHOC));
};
