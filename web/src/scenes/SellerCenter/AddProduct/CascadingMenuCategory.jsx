import React, { useState, useEffect, useContext } from 'react';
import { Paper, Typography, Icon } from '@material-ui/core';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import EnhancedList from '../../../utils/common/EnhancedList';
import ApprovalContainer from '../../../utils/ApprovalContainer';
import productContext from '../../../utils/context/ProductDataContext';
import { GET_CATEGORIES } from '../../../graphql/product';
import Loading from '../../App/Loading';
import Catalog from '../../../utils/dataUtil/class/Catalog';

const CascadingMenuCategory = ({ review, ...props }) => {
  const style = {
    display: 'flex',
    maxHeight: '50vh',
    postion: 'relative',
    margin: '16px 0',
    padding: 22,
  };
  const { setValue } = useContext(productContext);
  // Data from server
  const { loading, catalogs } = props;
  const [selected, setSelected] = useState('');
  const [catalogTree, setCatalogTree] = useState([]);
  useEffect(() => {
    setValue('catalogIds', [selected]);
  }, [selected]);
  useEffect(() => {
    if (!loading) {
      setCatalogTree(Catalog.buildTree(catalogs).children);
      console.log(catalogTree);
    }
  }, [catalogs]);
  if (loading) return <Loading />;
  return (
    <React.Fragment>
      <div>
        <Typography gutterBottom variant="subtitle1">
          Danh mục <Icon>info</Icon>
        </Typography>
      </div>
      <ApprovalContainer review={review} name="checkCategory">
        <Paper elevation={0} style={style}>
          <EnhancedList selected={selected} setSelected={setSelected} menuItems={catalogTree} />
        </Paper>
      </ApprovalContainer>
    </React.Fragment>
  );
};

CascadingMenuCategory.propTypes = {
  review: PropTypes.bool,
};

CascadingMenuCategory.defaultProps = {
  review: false,
};

export default graphql(GET_CATEGORIES, {
  props: ({ data: { loading, catalogs } }) => ({
    loading,
    catalogs,
  }),
})(CascadingMenuCategory);
