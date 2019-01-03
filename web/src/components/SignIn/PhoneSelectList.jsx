/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from '@material-ui/core';

const PhoneSelectList = ({ input, render, meta, children, ...restProps }) => {
  return (
    <React.Fragment>
      <Select {...input} {...restProps}>
        {(render && render()) || children}
      </Select>
    </React.Fragment>
  );
};

export default PhoneSelectList;
