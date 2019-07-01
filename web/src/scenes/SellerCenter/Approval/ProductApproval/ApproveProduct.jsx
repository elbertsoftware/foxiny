import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditProduct from '../../ListProducts/EditProduct';
import Loading from '../../../App/Loading';
import { graphql } from 'react-apollo';
import { GET_PRODUCT } from '../../../../graphql/product';

const groupByProTemId = data => {
  const result = {};
  data.forEach(element => {
    if (!result[element.productTemplateId]) {
      result[element.productTemplateId] = [];
      result[element.productTemplateId].push(element);
    } else {
      result[element.productTemplateId].push(element);
    }
  });
  return result;
};

const ApproveProduct = ({ match, ...props }) => {
  const { loading, productsData } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!loading) {
      const dataAfter = groupByProTemId(productsData)[match.params.id];
      console.log(dataAfter);
      setData(dataAfter);
    }
  }, [productsData]);

  if (loading) return <Loading />;

  return (
    <div>
      <EditProduct review dataEdit={data} />
    </div>
  );
};

ApproveProduct.propTypes = {};

export default graphql(GET_PRODUCT, {
  options: props => ({ variables: { sellerId: 'cjx8wso1x00f30a89i06iqz0n' } }),
  props: ({ data: { loading, productsWoTemplateAfterCreated } }) => ({
    loading,
    productsData: productsWoTemplateAfterCreated,
  }),
})(ApproveProduct);
