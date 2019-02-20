/* eslint-disable react/prop-types */
import React from 'react';
import { Select } from '@material-ui/core';

const SelectList = ({ input, inputProps, render, meta, children, ...restProps }) => {
  return (
    <React.Fragment>
      <Select {...input} {...inputProps} {...restProps}>
        {(render && render()) || children}
      </Select>
    </React.Fragment>
  );
};

export default SelectList;
