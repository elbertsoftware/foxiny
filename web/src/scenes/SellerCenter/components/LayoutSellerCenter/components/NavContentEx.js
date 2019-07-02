import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import { Collapse, makeStyles } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { LOGOUT } from '../../../../../utils/graphql/user';
import { removeAuthorizationToken } from '../../../../../utils/processData/localStorage';

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
const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
const NavContentEx = () => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const classes = useStyles();
  const handleAfterLogout = () => {
    removeAuthorizationToken();
    window.location.href = '/';
  };
  return (
    <Mutation mutation={LOGOUT}>
      {logout => (
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
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <Icon>settings</Icon>
            </ListItemIcon>
            <ListItemText primary={'Cài đặt và Tài khoản'} primaryTypographyProps={{ noWrap: true }} />
            {open ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ListItem
              button
              onClick={() =>
                logout().then(({ data }) => {
                  if (data.logout.token) {
                    handleAfterLogout();
                  }
                })
              }
              className={classes.nested}
            >
              <ListItemIcon>
                <Icon>person</Icon>
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                logout({
                  variables: {
                    all: true,
                  },
                }).then(({ data }) => {
                  if (data.logout.token) {
                    handleAfterLogout();
                  }
                })
              }
              className={classes.nested}
            >
              <ListItemIcon>
                <Icon>group</Icon>
              </ListItemIcon>
              <ListItemText primary="Đăng xuất tất cả thiết bị" />
            </ListItem>
          </Collapse>
        </List>
      )}
    </Mutation>
  );
};

NavContentEx.propTypes = {};
NavContentEx.defaultProps = {};

export default NavContentEx;
