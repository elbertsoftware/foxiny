import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';

const list = [
  {
    primaryText: 'Thêm sản phẩm',
    icon: 'add_box',
    href: '/sellers/add-product',
  },
  {
    primaryText: 'Danh sách sản phẩm',
    icon: 'ballot',
    href: '/sellers/list-products',
  },
  {
    primaryText: 'Duyệt tài khoản bán hàng',
    icon: 'how_to_reg',
    href: '/sellers/approve-sellers',
  },
  {
    primaryText: 'Duyệt sản phẩm',
    icon: 'offline_pin',
    href: '/sellers/approve-products',
  },
];
const NavContentEx = () => (
  <List>
    {list.map(({ primaryText, icon, href }, i) => (
      <ListItem key={href} component="a" href={href} selected={i === 0} button>
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={primaryText} primaryTypographyProps={{ noWrap: true }} />
      </ListItem>
    ))}
    <Divider style={{ margin: '12px 0' }} />
    <ListItem button>
      <ListItemIcon>
        <Icon>settings</Icon>
      </ListItemIcon>
      <ListItemText primary={'Settings & account'} primaryTypographyProps={{ noWrap: true }} />
    </ListItem>
  </List>
);

NavContentEx.propTypes = {};
NavContentEx.defaultProps = {};

export default NavContentEx;
