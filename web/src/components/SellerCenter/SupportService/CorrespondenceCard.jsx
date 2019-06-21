import React from 'react';
import PropTypes from 'prop-types';
import { Paper, AppBar, Toolbar, Typography, Grid, Avatar, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import GenerateInformMessages from '../Approval/utils/generateInformMessage';

const useStyles = makeStyles(({ spacing, palette }) => ({
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  gridContainer: {
    padding: spacing(3),
  },
  content: {
    display: 'flex',
    height: '100%',
  },
  avatar: {
    width: 48,
    height: 48,
  },
  name: {
    margin: `${spacing(2)}px 0`,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: palette.text.hint,
    marginRight: spacing(3),
  },
}));

const CorrespondenceCard = ({ approved, processData, className, ...props }) => {
  const classes = useStyles();
  return (
    <Paper className={className}>
      <AppBar className={classes.bar} position="static" color="inherit" elevation={0}>
        <Toolbar>
          <Typography variant="h5">Correspondence</Typography>
        </Toolbar>
      </AppBar>
      <Grid className={classes.gridContainer} container spacing={2}>
        <Grid item xs={2}>
          <Avatar
            className={classes.avatar}
            src="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png"
          />
          <Typography className={classes.name}>Foxiny Web Services</Typography>
          <Typography variant="subtitle2">Sat Jun 08 2019 T8:23:48:48 GMT</Typography>
        </Grid>
        <Grid className={classes.content} item xs={10}>
          <div className={classes.verticalDivider} />
          <div>
            <GenerateInformMessages approved={approved} processData={processData} />
            <Link href="https://mobbin.design/">https://mobbin.design/</Link>
            <br />
            <Link href="https://www.producthunt.com/">https://www.producthunt.com//</Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

CorrespondenceCard.propTypes = {};

export default CorrespondenceCard;
