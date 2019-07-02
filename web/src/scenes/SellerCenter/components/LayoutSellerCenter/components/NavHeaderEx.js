import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Redirect } from 'react-router';
import { RETAILERS } from '../../../../../utils/graphql/retailer';
import Loading from '../../../../../components/Loading/Loading';
import withAuth from '../../../../../utils/HOC/withRouteProtector';

const NavHeaderEx = ({ collapsed, ...props }) => {
  // Form graphql
  const { loading, sellers, userLoggedIn } = props;

  if (!userLoggedIn) {
    return <Redirect to="/sellers/sign" />;
  }
  if (loading) return <Loading />;

  return (
    <>
      {console.log(sellers)}
      <div style={{ padding: collapsed ? 8 : 16, transition: '0.3s' }}>
        <Avatar
          style={{
            width: collapsed ? 48 : 60,
            height: collapsed ? 48 : 60,
            transition: '0.3s',
          }}
          src={
            (sellers && sellers[0] && sellers[0].businessAvatar && sellers[0].businessAvatar.uri) ||
            'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
          }
        />
        <div style={{ paddingBottom: 16 }} />
        <Typography variant={'h6'} noWrap>
          {sellers && sellers[0] && sellers[0].businessName}
        </Typography>
        <Typography color={'textSecondary'} noWrap gutterBottom>
          {sellers && sellers[0] && sellers[0].businessEmail}
        </Typography>
      </div>
      <Divider />
    </>
  );
};

NavHeaderEx.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};
NavHeaderEx.defaultProps = {};

export default graphql(RETAILERS, {
  props: ({ data: { loading, myRetailers } }) => ({
    loading,
    sellers: myRetailers,
  }),
})(withAuth(NavHeaderEx));
