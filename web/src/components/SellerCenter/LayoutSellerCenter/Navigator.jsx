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
} from '@material-ui/core';

const categories = [
  {
    id: 'Sản phẩm',
    children: [{ id: 'Tạo mới sản phẩm', active: true }],
  },
];

const styles = theme => ({
  paperDrawer: {
    backgroundColor: theme.palette.primary.main,
  },
  expandPanel: {
    boxShadow: '0 0 0 0',
    backgroundColor: theme.palette.primary.main,
    width: '100%',
  },
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: theme.palette.secondary.main,
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
    '&$textDense': {
      fontSize: theme.typography.fontSize,
    },
  },
  textDense: {},
  divider: {
    marginTop: theme.spacing.unit * 2,
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
                  <Typography className={classes.categoryHeaderPrimary}>{id}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {children.map(({ id: childId, active }) => (
                    <ListItem
                      button
                      dense
                      key={childId}
                      className={classNames(classes.item, classes.itemActionable, active && classes.itemActiveItem)}
                    >
                      <ListItemIcon>
                        <Icon color="secondary">add</Icon>
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: classes.itemPrimary,
                          textDense: classes.textDense,
                        }}
                      >
                        {childId}
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
