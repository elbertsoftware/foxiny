import React, { useState } from 'react';
import { withStyles, Hidden } from '@material-ui/core';
import Navigator from './Navigator';
import Header from './Header';

const drawerWidth = 256;

const styles = theme => ({
  root: {
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
  },
});

const LayoutSellerCenter = ({ classes, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <div className={classes.root}>
      <Header onDrawerToggle={handleDrawerToggle} />

      <div className={classes.appContent}>
        <div className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Hidden>
        </div>
        <main className={classes.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default withStyles(styles)(LayoutSellerCenter);
