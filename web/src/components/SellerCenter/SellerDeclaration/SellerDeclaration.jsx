/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Grid, Typography, Tabs, Tab, withStyles, Button, Icon, Paper, IconButton } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import TabContainer from '../../../utils/common/TabContainer';
import peopleImage from '../../../images/people-fill-out-form.jpg';
import UploadImgZone from '../../User/UserAvatar/UploadImgZone';
import sellerDeclarationStyles from './styles/sellerDeclarationStyles';
import SellerProfile from './SellerProfile';

const imgCardStyles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    maxHeight: 240,
    margin: '0 16px',
  },
  imageContainer: {
    overflow: 'hidden',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    borderRadius: theme.spacing.unit * 2,
    '&:hover': {
      transform: 'scale(1.04)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
    },
  },
  fitImage: {
    width: 200,
    height: 200,
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    transform: 'translate(16px, 24px)',
    zIndex: 10,
  },
  closeIcon: {
    padding: 8,
    backgroundColor: 'rgb(245, 245, 245)',
  },
});

const ImageCardReview = withStyles(imgCardStyles)(({ src, classes, removeItem, ...others }) => {
  return (
    <div className={classes.container}>
      <div className={classes.buttonContainer}>
        <IconButton onClick={removeItem} className={classes.closeIcon}>
          <Icon>close</Icon>
        </IconButton>
      </div>
      <Paper elevation={0} className={classes.imageContainer}>
        <img className={classes.fitImage} src={src} alt="review" />
      </Paper>
    </div>
  );
});

const SellerDeclaration = ({ classes, theme }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [images, setImages] = useState([]);

  const handleTabChange = (e, id) => {
    setActiveTabId(id);
  };
  const handleChangeIndex = index => {
    setActiveTabId(index);
  };

  const removeItem = index => () => {
    const newImages = images.filter((image, i) => i !== index);
    setImages(newImages);
  };

  return (
    <Grid container className={classes.container}>
      <SellerProfile
        cover="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80"
        image="https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
        name="Grace Shop"
        email="minhkha791140@gmail.com"
        phone="0938499460"
      />
      <Paper className={classes.wrapper}>
        <Typography className={classes.title}>Thông tin tài khoản bán hàng</Typography>
        <Typography align="center" className={classes.subtitle} variant="subtitle2">
          Vui lòng cung cấp những thông tin cần thiết tùy theo loại hình kinh doanh mà bạn đã đăng ký trước đó. Đây là
          những thông tin để chúng tôi có thể xác thực tài khoản bán hàng của bạn
        </Typography>
        <div className={classes.wrapContent}>
          <div className={classes.logoContainer}>
            <img className={classes.logoImage} src={peopleImage} alt="fill-information" />
          </div>
          <div className={classes.formContainer}>
            <Tabs
              className={classes.tabContainer}
              value={activeTabId}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Thông tin" classes={{ root: classes.tab }} />
              <Tab label="Tài khoản ngân hàng" classes={{ root: classes.tab }} />
            </Tabs>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeTabId}
              onChangeIndex={handleChangeIndex}
            >
              {activeTabId === 0 ? (
                <TabContainer dir={theme.direction}>
                  <Typography className={classes.heading} variant="h3">
                    <strong>Cá nhân</strong>
                  </Typography>
                  <Typography gutterBottom>Tải ảnh CMND của bạn bao gồm mặt trước và mặt sau.</Typography>
                  <UploadImgZone style={classes.uploadZone} images={images} setImages={setImages} />
                  <Grid className={classes.gridContainer} wrap="nowrap" container spacing={8}>
                    {images.map((image, index) => (
                      <Grid item>
                        <ImageCardReview key={image.path} src={image.preview} removeItem={removeItem(index)} />
                      </Grid>
                    ))}
                  </Grid>

                  <div className={classes.buttonContainer}>
                    <Button variant="contained" color="secondary" className={classes.buttonAction}>
                      Lưu
                    </Button>
                  </div>
                </TabContainer>
              ) : (
                /* Avoiding raise invalid child: null error from react-swipe-view */
                <Typography />
              )}
              {activeTabId === 1 ? <TabContainer dir={theme.direction} /> : <Typography />}
            </SwipeableViews>
          </div>
        </div>
      </Paper>
      <div className={classes.background} />
      <div className={`${classes.background} ${classes.v2}`} />
    </Grid>
  );
};

export default withStyles(sellerDeclarationStyles, { withTheme: true })(SellerDeclaration);
