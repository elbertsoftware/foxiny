import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Redirect } from 'react-router';
import { GET_ONE_RETAILER } from '../../../../../utils/graphql/retailer';
import Loading from '../../../../../components/Loading/Loading';
import withAuth from '../../../../../utils/HOC/withRouteProtector';
import { getSellerId } from '../../../../../utils/processData/localStorage';

const NavHeaderEx = ({ collapsed, ...props }) => {
  // Form graphql
  const { loading, retailers, userLoggedIn } = props;

  if (!userLoggedIn) {
    return <Redirect to="/sellers/sign" />;
  }
  if (loading) return <Loading />;
  return (
    <>
      <div style={{ padding: collapsed ? 8 : 16, transition: '0.3s' }}>
        <Avatar
          style={{
            width: collapsed ? 48 : 60,
            height: collapsed ? 48 : 60,
            transition: '0.3s',
          }}
          src={
            (retailers
              && retailers.length > 0
              && retailers[0].businessAvatar
              && retailers[0].businessAvatar.uri)
            || 'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
          }
        />
        <div style={{ paddingBottom: 16 }} />
        <Typography variant="h6" noWrap>
          {retailers && retailers.length > 0 && retailers[0].businessName}
        </Typography>
        <Typography color="textSecondary" noWrap gutterBottom>
          {retailers && retailers.length > 0 && retailers[0].businessEmail}
        </Typography>
      </div>
      <Divider />
    </>
  );
};

NavHeaderEx.propTypes = {
  collapsed: PropTypes.bool,
};
NavHeaderEx.defaultProps = {};

export default graphql(GET_ONE_RETAILER, {
  options: props => ({
    variables: {
      query: getSellerId(),
    },
    notifyOnNetworkStatusChange: true,
  }),
  props: ({ data: { loading, retailers } }) => ({
    loading,
    retailers,
  }),
})(withAuth(NavHeaderEx));
