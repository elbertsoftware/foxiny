import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Avatar, Icon, withStyles, ButtonBase } from '@material-ui/core';
import sellerProfileStyles from './styles/sellerProfileStyles';
import SellerEditForm from './SellerEditForm';

const SellerProfileCard = ({ classes, cover, image, name, email, phone }) => {
  const [isEdited, setIsEdited] = useState(false);
  return (
    <Card className={classes.cardRoot}>
      <CardMedia className={`${classes.cardMedia} ${isEdited ? classes.avatarDarker : undefined}`} image={cover}>
        <Avatar
          src={image}
          className={`${classes.avatarBig} ${classes.avatar} ${isEdited ? classes.avatarDarker : undefined}`}
        />
        {isEdited && (
          <React.Fragment>
            <ButtonBase className={`${classes.buttonBase} ${classes.buttonChangeCover}`}>
              <div className={classes.changeAvaBox}>
                <Icon size="large" className={`${classes.changeCoverIcon} ${classes.changeAvaIcon}`}>
                  panorama
                </Icon>
                <Typography className={`${classes.changeCoverIcon} ${classes.changeAvaIcon}`}>
                  Thay đổi ảnh bìa
                </Typography>
              </div>
            </ButtonBase>
            <ButtonBase className={`${classes.buttonBase} ${classes.buttonChangeAva}`}>
              <div className={classes.changeAvaBox}>
                <Icon className={classes.changeAvaIcon}>add_photo_alternate</Icon>
                <Typography className={classes.changeAvaIcon}>Thay đổi</Typography>
              </div>
            </ButtonBase>
          </React.Fragment>
        )}
      </CardMedia>
      <CardContent className={classes.contentRoot}>
        <div className={classes.cardAction}>
          {!isEdited ? (
            <React.Fragment>
              <Button onClick={() => setIsEdited(true)}>
                <Icon>edit</Icon>
                <span>Chỉnh sửa</span>
              </Button>
              <IconButton className={classes.more}>
                <Icon>more_vert</Icon>
              </IconButton>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button className={classes.button} onClick={() => setIsEdited(false)}>
                Cancle
              </Button>
              <Button variant="contained" color="secondary" className={classes.button}>
                Lưu
              </Button>
            </React.Fragment>
          )}
        </div>
        {!isEdited ? (
          <React.Fragment>
            <Typography align="left" className={classes.heading}>
              {name}
            </Typography>
            <Typography align="left" variant="subtitle2">
              {email}
            </Typography>
            <Typography align="left" variant="subtitle2" className={classes.subheading}>
              {phone}
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Icon color="secondary">location_on</Icon>
              </Grid>
              <Grid item>
                <Typography gutterBottom>Ho Chi Minh, Vietnam.</Typography>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SellerEditForm isEdited={isEdited} />
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  );
};

SellerProfileCard.propTypes = {
  image: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  phone: PropTypes.string,
};
SellerProfileCard.defaultProps = {
  email: '',
  phone: '',
};

export default withStyles(sellerProfileStyles)(SellerProfileCard);
