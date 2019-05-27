import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  withStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Icon,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Link,
} from '@material-ui/core';
import { Link as RouteLink } from 'react-router-dom';

const categories = [
  {
    id: 'Sản phẩm',
    children: [
      { id: 'Tạo mới sản phẩm', active: true, icon: <Icon>add</Icon>, link: '/seller/add-product' },
      { id: 'Danh sách sản phẩm', icon: <Icon>list</Icon>, link: '/seller/list-product' },
    ],
  },
];

const styles = theme => ({
  paperDrawer: {
    zIndex: 0,
  },
  expandPanel: {
    boxShadow: '0 0 0 0',
    width: '100%',
  },
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  itemCategory: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
  },
  itemActiveItem: {
    color: theme.palette.secondary.main,
  },
  itemPrimary: {
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
  },
  details: {
    display: 'block',
  },
});

const Navigator = ({ classes, ...others }) => {
  return (
    <Drawer classes={{ paper: classes.paperDrawer }} variant="permanent" {...others}>
      <List disablePadding>
        <ListItem className={classNames(classes.firebase, classes.item, classes.itemCategory)}>Seller center</ListItem>
        <ListItem className={classNames(classes.item, classes.itemCategory)}>
          <ListItemIcon>
            <Icon>home</Icon>
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Trang chủ
          </ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem disableGutters className={classes.categoryHeader}>
              <ExpansionPanel classes={{ root: classes.expandPanel }}>
                <ExpansionPanelSummary expandIcon={<Icon color="secondary">expand_more</Icon>}>
                  <Typography>{id}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                  {children.map(({ id: childId, active, icon, link }) => (
                    <ListItem
                      button
                      dense
                      key={childId}
                      className={classNames(classes.item, active && classes.itemActiveItem)}
                    >
                      {icon}
                      <ListItemText
                        classes={{
                          primary: classes.itemPrimary,
                          textDense: classes.textDense,
                        }}
                      >
                        <Link component={RouteLink} to={link}>
                          {childId}
                        </Link>
                      </ListItemText>
                    </ListItem>
                  ))}
                  <Divider className={classes.divider} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(Navigator);
