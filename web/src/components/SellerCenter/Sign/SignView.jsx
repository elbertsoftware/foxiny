/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Grid, Typography, Tabs, Tab, withStyles } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';

import TabContainer from '../../../utils/common/TabContainer';
import signStyles from './signStyles';
import SignIn from '../../SignIn/SignIn';
import SignUp from '../../SignUp/SignUp';
import ConfirmPage from '../../Form/ConfirmPage';

const SignView = ({ classes, theme, history }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [userId, setUserId] = useState('');
  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.logoContainer}>
        <img src="/assets/foxiny_logo.png" alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Foxiny Seller Center</Typography>
      </div>
      <div className={classes.formContainer}>
        <div>
          <Tabs value={activeTabId} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
            <Tab label="Đăng nhập" classes={{ root: classes.tab }} />
            <Tab label="Đăng ký" classes={{ root: classes.tab }} />
            <Tab label={activeTabId === 2 ? 'Xác thực' : ''} disabled classes={{ root: classes.tab }} />
          </Tabs>

          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeTabId}
            onChangeIndex={handleChangeIndex}
          >
            {activeTabId === 0 ? (
              <TabContainer dir={theme.direction}>
                <SignIn sellerCenter={Boolean(true)} controlRoute={history} />
              </TabContainer>
            ) : (
              /* Avoiding raise invalid child: null error from react-swipe-view */
              <Typography />
            )}
            {activeTabId === 1 ? (
              <TabContainer dir={theme.direction}>
                <SignUp sellerCenter={Boolean(true)} setUserId={setUserId} setActiveTabId={setActiveTabId} />
              </TabContainer>
            ) : (
              <Typography />
            )}
            {activeTabId === 2 ? (
              <TabContainer dir={theme.direction}>
                <ConfirmPage userId={userId} history={history} />
              </TabContainer>
            ) : (
              <Typography />
            )}
          </SwipeableViews>
        </div>
      </div>
    </Grid>
  );
};

export default withStyles(signStyles, { withTheme: true })(SignView);
