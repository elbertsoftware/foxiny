import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { RETAILERS } from '../../../../graphql/retailer';
import Loading from '../../../App/Loading';

const NavHeaderEx = ({ collapsed, ...props }) => {
  // Form graphql
  const { loading, sellers } = props;
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
            (sellers[0] && sellers[0].businessAvatar && sellers[0].businessAvatar.uri) ||
            'https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png'
          }
        />
        <div style={{ paddingBottom: 16 }} />
        <Typography variant={'h6'} noWrap>
          {sellers[0] && sellers[0].businessName}
        </Typography>
        <Typography color={'textSecondary'} noWrap gutterBottom>
          {sellers[0] && sellers[0].businessEmail}
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
})(NavHeaderEx);
