// @flow
import React from 'react';

type Props = {
  name: string,
  countFunc: (count: number) => void,
};

const MyButton = ({ name, countFunc }: Props) => (
  <button type="button" onClick={() => countFunc(2)}>
    {name}
  </button>
);

export default MyButton;
