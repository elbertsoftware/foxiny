import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const TabContainer = ({ children, dir }) => {
  return (
    <Typography component="div" dir={dir}>
      {children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

export default TabContainer;
