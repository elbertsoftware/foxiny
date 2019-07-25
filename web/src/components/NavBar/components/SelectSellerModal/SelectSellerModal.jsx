import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Dialog,
  Paper,
  Grid,
  Button,
  makeStyles,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Icon,
} from '@material-ui/core';
import { Query } from 'react-apollo';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
} from '../../../Dialog/Dialog';
import { RETAILERS } from '../../../../utils/graphql/retailer';
import Loading from '../../../Loading/Loading';
import { setSellerId } from '../../../../utils/processData/localStorage';

const cardStyles = makeStyles(theme => ({
  root: {},
  media: {
    width: 300,
    height: 300,
  },
}));

const SellerCard = ({ businessName, image, handleChooseSeller }) => {
  const classes = cardStyles();
  return (
    <Card>
      <CardMedia image={image} title="seller-image" className={classes.media} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {businessName}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={handleChooseSeller}>
          <Icon>transit_enterexit</Icon>
        </IconButton>
      </CardActions>
    </Card>
  );
};

const SelectSellerModal = ({ handleClose, open, ...props }) => {
  const handleChooseSeller = sellerId => () => {
    setSellerId(sellerId);
    console.log(sellerId);
    props.history.push('/sellers/');
    window.location.reload();
  };
  return (
    <Query query={RETAILERS}>
      {({ data, loading }) => {
        if (loading) return <Loading />;
        return (
          <Dialog maxWidth="md" open={open} onClose={handleClose}>
            <DialogTitle onClose={handleClose}>
              Lựa chọn gian hàng của bạn
            </DialogTitle>
            <DialogContent>
              <Paper elevation={0}>
                <Grid container spacing={2}>
                  {data.myRetailers.map(retailer => (
                    <Grid key={retailer.id} item xs={4}>
                      <SellerCard
                        businessName={retailer.businessName}
                        image="https://cdn.pixabay.com/photo/2019/04/26/07/14/store-4156934_960_720.png"
                        handleChooseSeller={handleChooseSeller(retailer.id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button variant="text">Đóng</Button>
            </DialogActions>
          </Dialog>
        );
      }}
    </Query>
  );
};

SelectSellerModal.propTypes = {};

export default withRouter(SelectSellerModal);
