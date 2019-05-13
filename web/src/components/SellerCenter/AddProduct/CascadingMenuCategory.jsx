import React, { useState } from 'react';
import { Paper, Typography, Icon } from '@material-ui/core';
import EnhancedList from '../../../utils/common/EnhancedList';

const menuItems = [
  {
    key: 'noithat',
    caption: 'Nội thất',
    subMenuItems: [
      {
        key: '1',
        caption: 'Bàn ghế',
        subMenuItems: [
          {
            key: '11',
            caption: 'Bàn tròn',
            onClick: () => {},
          },
          {
            key: '12',
            caption: 'Bàn vuông',
            onClick: () => {},
          },
          {
            key: '13',
            caption: 'Bàn đá',
            subMenuItems: [
              {
                key: '131',
                caption: 'Đá hoa cương',
                onClick: () => {},
              },
              {
                key: '132',
                caption: 'Gỗ',
                onClick: () => {},
              },
            ],
            onClick: () => {},
          },
          {
            key: '14',
            caption: 'Bàn kiếng',
            onClick: () => {},
          },
        ],
        onClick: () => {},
      },
      {
        key: '2',
        caption: 'Sofa',
        onClick: () => {},
      },
      {
        key: '3',
        caption: 'Đồ decor',
        onClick: () => {},
      },
    ],
  },
  {
    key: 'ngoaithat',
    caption: 'Ngoại thất',
    subMenuItems: [
      {
        key: 'ngoaithat1',
        caption: 'Cay xanh',
        subMenuItems: [
          {
            key: 'cayxanh1',
            caption: 'Cay dua',
            onClick: () => {},
          },
          {
            key: 'cayxanh2',
            caption: 'Cay hoa giay',
            onClick: () => {},
          },
          {
            key: 'cayxanh3',
            caption: 'Cay van tho',
            onClick: () => {},
          },
          {
            key: 'cayxanh4',
            caption: 'Cay hoa su',
            onClick: () => {},
          },
        ],
        onClick: () => {},
      },
      {
        key: 'ngoaithat2',
        caption: 'Cửa',
        onClick: () => {},
      },
    ],
  },
  {
    key: 'danhmuc3',
    caption: 'Danh mục 3',
  },
  {
    key: 'danhmuc4',
    caption: 'Danh mục 4',
  },
  {
    key: 'danhmuc5',
    caption: 'Danh mục 5',
  },
  {
    key: 'danhmuc6',
    caption: 'Danh mục 6',
  },
  {
    key: 'danhmuc7',
    caption: 'Danh mục 7',
  },
  {
    key: 'danhmuc8',
    caption: 'Danh mục 8',
  },
];

const CascadingMenuCategory = () => {
  const style = {
    display: 'flex',
    height: '50vh',
    postion: 'relative',
    margin: '16px 0',
  };
  const [selected, setSelected] = useState('');
  return (
    <React.Fragment>
      <div>
        <Typography gutterBottom variant="subtitle1">
          Danh mục <Icon>info</Icon>
        </Typography>
      </div>
      <Paper elevation={3} style={style}>
        <EnhancedList selected={selected} setSelected={setSelected} menuItems={menuItems} />
      </Paper>
    </React.Fragment>
  );
};

export default CascadingMenuCategory;
