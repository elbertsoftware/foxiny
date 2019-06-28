import React from 'react';

const ProductDataContext = React.createContext({
  data: {},
  setValue: () => {},
});

export default ProductDataContext;
