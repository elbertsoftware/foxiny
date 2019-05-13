import React from 'react';
import {
  Paper,
  AppBar,
  Toolbar,
  Grid,
  Button,
  Tooltip,
  Typography,
  IconButton,
  Icon,
  withStyles,
  TextField,
} from '@material-ui/core';

const styles = theme => ({
  paper: {
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing.unit,
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

const RequestProduct = ({ classes, ...others }) => {
  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={16} alignItems="center">
            <Grid item>
              <Icon className={classes.block} color="inherit">
                search
              </Icon>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm trước khi tạo mới sản phẩm"
                InputProps={{
                  disableUnderline: true,
                  className: classes.searchInput,
                }}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" className={classes.addUser}>
                Tìm
              </Button>
              <Tooltip title="Reload">
                <IconButton>
                  <Icon className={classes.block} color="inherit">
                    refresh
                  </Icon>
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        <Typography color="textSecondary" align="center">
          Không tìm thấy sản phẩm nào
        </Typography>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(RequestProduct);
