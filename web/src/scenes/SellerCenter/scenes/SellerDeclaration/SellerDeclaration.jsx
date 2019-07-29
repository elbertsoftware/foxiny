/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import { compose, graphql } from "react-apollo";
import { Redirect } from "react-router";

import sellerDeclarationStyles from "./styles/sellerDeclarationStyles";
import SellerProfile from "./components/SellerProfile/SellerProfile";
import { GET_ONE_RETAILER } from "../../../../utils/graphql/retailer";
import SellerBusinessInfo from "./components/SellerBusinessInfo/SellerBusinessInfo";

import Loading from "../../../../components/Loading/Loading";
import { getSellerId } from "../../../../utils/processData/localStorage";

const SellerDeclaration = ({ classes, theme, ...props }) => {
  // Data query from Graphql
  const { loading, myRetailer } = props;
  // Auth
  const { userLoggedIn } = props;

  if (!userLoggedIn()) {
    return <Redirect to="/sellers/sign" />;
  }
  if (loading) return <Loading />;
  if (!myRetailer) return <Redirect to="/" />;

  return (
    <Grid container className={classes.container}>
      <SellerProfile
        cover="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png"
        retailerInfo={myRetailer && myRetailer[0]}
      />
      <SellerBusinessInfo seller={myRetailer[0]} className={classes.width} />
      <div className={classes.background} />
      <div className={`${classes.background} ${classes.v2}`} />
    </Grid>
  );
};

export default compose(
  graphql(GET_ONE_RETAILER, {
    options: {
      variables: {
        query: getSellerId()
      },
      notifyOnNetworkStatusChange: true
    },
    props: ({ data: { loading, retailers } }) => ({
      loading,
      myRetailer: retailers
    })
  }),
  withStyles(sellerDeclarationStyles, { withTheme: true })
)(SellerDeclaration);
