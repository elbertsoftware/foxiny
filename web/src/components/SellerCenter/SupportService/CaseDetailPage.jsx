import React from 'react';
import PropTypes from 'prop-types';
import { Paper, AppBar, Toolbar, Typography, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CorrespondenceCard from './CorrespondenceCard';
import Loading from '../../App/Loading';
import { Query } from 'react-apollo';
import { LAST_APPROVAL_PROCESS } from '../../../graphql/approvement';

const useStyles = makeStyles(({ breakpoints, palette, spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    paddingLeft: spacing(5),
    margin: '0 auto',
  },
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  caseDetailCard: {
    width: '100%',
  },
  detailInfo: {
    padding: spacing(3),
  },
  detailInfoContainer: {},
  title: {},
  content: {
    marginBottom: spacing(3),
  },
  flexContainer: {
    display: 'flex',
    height: '100%',
  },
  verticalDivider: {
    height: '100%',
    width: 1,
    backgroundColor: palette.text.hint,
    marginRight: spacing(3),
  },
  correspondence: {
    marginTop: spacing(3),
  },
}));

const CaseDetailPage = ({ match, location, ...props }) => {
  const classes = useStyles();
  return (
    <Query query={LAST_APPROVAL_PROCESS} variables={{ query: match.params.id }}>
      {({ data, loading }) => {
        if (loading) return <Loading />;
        return (
          <Paper className={classes.root} elevation={0}>
            <AppBar className={classes.bar} position="static" color="inherit" elevation={0}>
              <div>
                <Toolbar className={classes.toolbar}>
                  <Typography variant="h2">CASE ID 6133476357473</Typography>
                  <Button variant="contained" color="secondary">
                    Reopen case
                  </Button>
                </Toolbar>
              </div>
            </AppBar>
            <Paper className={classes.caseDetailCard}>
              <AppBar className={classes.bar} position="static" color="inherit" elevation={0}>
                <Toolbar className={classes.toolbar}>
                  <Typography variant="h5">Case details</Typography>
                </Toolbar>
              </AppBar>
              <Grid container spacing={3} className={classes.detailInfo} elevation={0}>
                <Grid className={classes.detailInfoContainer} item xs={6}>
                  <Typography className={classes.title} variant="h6">
                    Subject
                  </Typography>
                  <Typography className={classes.content}>
                    Your AWs Access Key is Exposed for AES Account 11293213123123
                  </Typography>
                  <Typography className={classes.title} variant="h6">
                    Case ID
                  </Typography>
                  <Typography className={classes.content}>617816273817</Typography>
                  <Typography className={classes.title} variant="h6">
                    Created
                  </Typography>
                  <Typography className={classes.content}>2019-06-05</Typography>
                  <Typography className={classes.title} variant="h6">
                    Case type
                  </Typography>
                  <Typography className={classes.content}>Account</Typography>
                  <Typography className={classes.title} variant="h6">
                    Opened by
                  </Typography>
                  <Typography>minhkha791140@gmail.com</Typography>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.flexContainer}>
                    <div className={classes.verticalDivider} />
                    <div>
                      <Typography className={classes.title} variant="h6">
                        Status
                      </Typography>
                      <Typography className={classes.content}>Resolved </Typography>
                      <Typography className={classes.title} variant="h6">
                        Severity
                      </Typography>
                      <Typography className={classes.content}>Urgent business impacting question</Typography>
                      <Typography className={classes.title} variant="h6">
                        Category
                      </Typography>
                      <Typography className={classes.content}>Account</Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Paper>
            <CorrespondenceCard
              processData={data.lastRetailerApprovalProcess && data.lastRetailerApprovalProcess.processData}
              approved={location.state.approved}
              className={classes.correspondence}
            />
          </Paper>
        );
      }}
    </Query>
  );
};

CaseDetailPage.propTypes = {};

export default CaseDetailPage;
