// @flow

import React, { Component } from 'react';
import { loadReCaptcha } from 'react-recaptcha-google';
import { Route, Switch, withRouter } from 'react-router';
import { AppBar } from '@material-ui/core';
import { I18nProvider } from '@lingui/react';
import compose from 'recompose/compose';
import 'react-toastify/dist/ReactToastify.css';
import withTheme from '../../utils/withTheme';
import NavBar from '../NavBar/NavBar';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import ConfirmPage from '../Form/ConfirmPage';
import UserDashboard from '../User/UserDashboard';
import Homepage from '../HomePage/Homepage';
import UserSecurityQuestion from '../User/UserSecurityQuestion';
import withAuthenticator from '../../utils/RouteProtector';
import UserResetPassword from '../User/UserResetPassword/UserResetPassword';
import ProductCard from '../Product/ProductCard';
import ProductDetailPage from '../Product/ProductDetail/ProductDetailPage';
import ProductReviews from '../Product/CustomerReviews/ProductReviews';

class App extends Component<Props, State> {
  state = {
    language: 'vi',
    catalogs: {},
  };

  componentDidMount() {
    loadReCaptcha();
    this.loadLanguage(this.state.language);
  }

  componentDidUpdate(prevProps, { language, catalogs }) {
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
    const { language, catalogs } = this.state;
    return (
      <I18nProvider language={language} catalogs={catalogs}>
        <Switch>
          <Route exact path="/" component={() => <Homepage />} />
        </Switch>
        <Route
          path="/(.+)"
          render={() => (
            <React.Fragment>
              <AppBar position="static" color="primary">
                <NavBar handleSetLanguage={this.handleSetLanguage} />
              </AppBar>
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
              <Switch>
                <Route path="/productcard" component={ProductCard} />
              </Switch>
              <Switch>
                <Route path="/products" component={ProductDetailPage} />
              </Switch>
              <Switch>
                <Route path="/product-reviews" component={ProductReviews} />
              </Switch>
            </React.Fragment>
          )}
        />
      </I18nProvider>
    );
  }
}

export default compose(
  withRouter,
  withTheme,
)(App);
