import React, { useState, useEffect, useContext } from 'react';
import { Paper, Typography, Icon } from '@material-ui/core';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import EnhancedList from '../../../utils/common/EnhancedList';
import ApprovalContainer from '../../../utils/ApprovalContainer';
import productContext from '../../../utils/context/ProductDataContext';
import { GET_CATEGORIES } from '../../../graphql/product';
import Loading from '../../App/Loading';

const menuItems = [
  {
    id: 'noithat',
    name: 'Nội thất',
    subMenuItems: [
      {
        id: '1',
        name: 'Bàn ghế',
        subMenuItems: [
          {
            id: '11',
            name: 'Bàn tròn',
            onClick: () => {},
          },
          {
            id: '12',
            name: 'Bàn vuông',
            onClick: () => {},
          },
          {
            id: '13',
            name: 'Bàn đá',
            subMenuItems: [
              {
                id: '131',
                name: 'Đá hoa cương',
                onClick: () => {},
              },
              {
                id: '132',
                name: 'Gỗ',
                onClick: () => {},
              },
            ],
            onClick: () => {},
          },
          {
            id: '14',
            name: 'Bàn kiếng',
            onClick: () => {},
          },
        ],
        onClick: () => {},
      },
      {
        id: '2',
        name: 'Sofa',
        onClick: () => {},
      },
      {
        id: '3',
        name: 'Đồ decor',
        onClick: () => {},
      },
    ],
  },
  {
    id: 'ngoaithat',
    name: 'Ngoại thất',
    subMenuItems: [
      {
        id: 'ngoaithat1',
        name: 'Cay xanh',
        subMenuItems: [
          {
            id: 'cayxanh1',
            name: 'Cay dua',
            onClick: () => {},
          },
          {
            id: 'cayxanh2',
            name: 'Cay hoa giay',
            onClick: () => {},
          },
          {
            id: 'cayxanh3',
            name: 'Cay van tho',
            onClick: () => {},
          },
          {
            id: 'cayxanh4',
            name: 'Cay hoa su',
            onClick: () => {},
          },
        ],
        onClick: () => {},
      },
      {
        id: 'ngoaithat2',
        name: 'Cửa',
        onClick: () => {},
      },
    ],
  },
  {
    id: 'danhmuc3',
    name: 'Danh mục 3',
  },
  {
    id: 'danhmuc4',
    name: 'Danh mục 4',
  },
  {
    id: 'danhmuc5',
    name: 'Danh mục 5',
  },
  {
    id: 'danhmuc6',
    name: 'Danh mục 6',
  },
  {
    id: 'danhmuc7',
    name: 'Danh mục 7',
  },
  {
    id: 'danhmuc8',
    name: 'Danh mục 8',
  },
];

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
  const { loading, categories } = props;
  const [selected, setSelected] = useState('');
  useEffect(() => {
    setValue('categoryIds', [selected]);
  }, [selected]);
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
          <div style={{ overflow: 'auto' }}>
            <EnhancedList selected={selected} setSelected={setSelected} menuItems={categories} />
          </div>
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
  props: ({ data: { loading, categories } }) => ({
    loading,
    categories,
  }),
})(CascadingMenuCategory);
