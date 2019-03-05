// @flow

import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';
import { Route, Switch, withRouter } from 'react-router';
import { I18nProvider } from '@lingui/react';
import { graphql } from 'react-apollo';
import compose from 'recompose/compose';
import 'react-toastify/dist/ReactToastify.css';
import withTheme from '../../utils/withTheme';
import NavBar from '../NavBar/NavBar';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import ConfirmPage from '../Form/ConfirmPage';
import UserDashboard from '../User/UserDashboard';
import Homepage from '../Homepage';
import UserSecurityQuestion from '../User/UserSecurityQuestion';
import withAuthenticator from '../../utils/RouteProtector';
import UserResetPassword from '../User/UserResetPassword/UserResetPassword';
import getCurrentUser from '../../graphql/getCurrentUser';
import UserContext from '../../utils/context';
import Loading from './Loading';

class App extends Component<Props, State> {
  state = {
    language: 'vi',
    catalogs: {},
    user: {},
  };

  componentDidMount() {
    loadReCaptcha();
    this.loadLanguage(this.state.language);
  }

  componentDidUpdate(prevProps, { language, catalogs }) {
    const { location, user } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      if (prevProps.location.pathname === '/signin' && location.pathname === '/') {
        window.location.reload();
        return false;
      }
    }
    if (user !== prevProps.user) {
      const authUser = { ...user };
      this.setState({ user: authUser });
      return false;
    }
    if (this.state.language !== language && !catalogs[language]) {
      this.loadLanguage(this.state.language);
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.setState({
      language: 'vi',
      catalogs: {},
    });
  }

  loadLanguage = async language => {
    const catalogs = await import(`../../locales/${language}/messages`);
    this.setState(state => ({
      catalogs: {
        ...state.catalogs,
        [language]: catalogs,
      },
    }));
  };

  handleSetLanguage = language => {
    this.setState({ language });
  };

  render() {
    const { language, catalogs, user } = this.state;
    const { loading } = this.props;
    if (loading) return <Loading />;
    return (
      <I18nProvider language={language} catalogs={catalogs}>
        <UserContext.Provider value={user}>
          <Switch>
            <Route exact path="/" component={() => <Homepage />} />
          </Switch>
          <Route
            path="/(.+)"
            render={() => (
              <React.Fragment>
                <NavBar handleSetLanguage={this.handleSetLanguage} />
                <Switch>
                  <Route path="/signin" component={SignIn} />
                </Switch>
                <Switch>
                  <Route path="/signup" component={SignUp} />
                </Switch>
                <Switch>
                  <Route path="/confirm/:id" component={ConfirmPage} />
                </Switch>
                <Switch>
                  <Route path="/reset-password" component={UserResetPassword} />
                </Switch>
                <Switch>
                  <Route path="/profile/:id" component={withAuthenticator(UserDashboard)} />
                </Switch>
                <Switch>
                  <Route path="/security-question" component={withAuthenticator(UserSecurityQuestion)} />
                </Switch>
              </React.Fragment>
            )}
          />
        </UserContext.Provider>
      </I18nProvider>
    );
  }
}

export default compose(
  graphql(getCurrentUser, {
    props: ({ data: { me, loading, error } }) => ({
      loading,
      user: me,
      error,
    }),
  }),
  withRouter,
  withTheme,
)(App);
