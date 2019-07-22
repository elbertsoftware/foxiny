/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router';

import sellerDeclarationStyles from './styles/sellerDeclarationStyles';
import SellerProfile from './components/SellerProfile/SellerProfile';
import { RETAILERS } from '../../../../utils/graphql/retailer';
import SellerBusinessInfo from './components/SellerBusinessInfo/SellerBusinessInfo';

import Loading from '../../../../components/Loading/Loading';

const SellerDeclaration = ({ classes, theme, ...props }) => {
  // Data query from Graphql
  const { loading, myRetailers } = props;
  // Auth
  const { userLoggedIn } = props;

  if (!userLoggedIn()) {
    return <Redirect to="/sellers/sign" />;
  }
  if (loading) return <Loading />;
  if (!myRetailers) return <Redirect to="/sellers/register-seller" />;

  return (
    <Grid container className={classes.container}>
      <SellerProfile
        cover="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png"
        retailerInfo={myRetailers && myRetailers[0]}
      />
      <SellerBusinessInfo seller={myRetailers[0]} className={classes.width} />
      <div className={classes.background} />
      <div className={`${classes.background} ${classes.v2}`} />
    </Grid>
  );
};

export default compose(
  graphql(RETAILERS, {
    props: ({ data: { loading, myRetailers } }) => ({
      loading,
      myRetailers,
    }),
  }),
  withStyles(sellerDeclarationStyles, { withTheme: true }),
)(SellerDeclaration);
