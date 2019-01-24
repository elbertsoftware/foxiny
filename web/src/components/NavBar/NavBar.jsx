import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import SignInMenu from '../Menu/SignInMenu';
import SignUpMenu from '../Menu/SignUpMenu';
import { getAuthorizationToken } from '../../utils/authentication';
import { renderToStringWithData } from 'react-apollo';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  image: {
    maxWidth: '60px',
    height: 'auto',
  },
  signUpMenu: {
    display: 'flex',
  },
});

class NavBar extends React.Component {
  state = {
    authToken: null,
  };

  componentDidMount() {
    this.setState({
      authToken: getAuthorizationToken(),
    });
  }

  handleRemoveToken = () => {
    this.setState({ authToken: null });
  };

  render() {
    const { classes } = this.props;
    const { authToken } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <a href="/">
              <img alt="Foxiny Inc - We care your needs" src="/assets/foxiny_logo.png" className={classes.image} />
            </a>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Foxiny
            </Typography>
            {authToken ? <SignInMenu handleRemoveToken={this.handleRemoveToken} /> : <SignUpMenu classes={classes} />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
