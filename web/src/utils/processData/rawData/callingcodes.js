/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { MenuItem } from '@material-ui/core';

export const callingCodes = [
  {
    country: 'China',
    value: '86',
    code: 'CN',
  },
  { country: 'United States', value: '1', code: 'US' },
  {
    country: 'Vietnam',
    value: '84',
    code: 'VN',
  },
];
export const countries = callingCodes.map(({ country, value }) => (
  <MenuItem key={country} value={value}>{`${country} + ${value}`}</MenuItem>
));

export const regex = {
  84: '^(\\+?84|0)(3[2-9]|5[689]|7[0|6-9]|8[1-5]|9[0-9])([0-9]{7})$',
  86: '^((\\+|00)86)?1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$',
  1: '^((\\+1|1)?( |-)?)?(\\([2-9][0-9]{2}\\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$',
};
