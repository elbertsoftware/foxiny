import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Icon,
  CardContent,
  CardActions,
  Button,
  Grid,
  withStyles,
  Tooltip,
  MenuItem,
  Select,
  CardMedia,
  CardActionArea,
} from '@material-ui/core';
import '../../../utils/style/commonStyle.css';
import { red } from '@material-ui/core/colors';
import PropTypes from 'prop-types';

const styles = theme => ({
  customerReview: {
    padding: 30,
  },
  card: {
    marginBottom: 10,
    position: 'relative',
    borderRadius: 15,
  },
  topReviewCard: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    '&:hover': {
      boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    },
    backgroundColor: '#071f2e',
  },
  ellipse: {
    position: 'absolute',
    width: '43rem',
    height: '39rem',
    top: '-32rem',
    right: '1%',
    margin: '0 auto',
    background: 'linear-gradient(68.62deg, #F9AA33 25.97%, rgba(6, 120, 145, 0) 104.96%)',
    boxShadow: 'inset 0px -4px 8px rgba(0, 0, 0, 0.25)',
    '-webkit-transform': 'rotate(15deg)',
    transform: 'rotate(15deg)',
    borderRadius: '34%',
  },
  avatar: {
    backgroundColor: red[500],
  },
  verified: {
    display: 'flex',
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2,
    alignItems: 'center',
  },
  title: {
    padding: `0 ${theme.spacing.unit * 2}px`,
    display: 'flex',
  },
  rootIconButton: {
    padding: 0,
    color: '#ff512f',
    marginRight: 6,
  },
  people: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
  voteActions: {
    display: 'flex',
  },
  reviewSelect: {
    margin: '20px 16px',
  },
  whiteText: {
    color: '#cfd8dc',
  },
  empty: {},
  textTopReview: {
    color: '#cfd8dc',
    margin: '8px 16px',
  },
  showMore: {
    width: '50%',
    margin: '16px 25%',
    fontSize: 20,
    borderRadius: 15,
  },
  commentCard: {
    margin: '16px 0',
  },
  media: {
    height: 140,
  },
});

const ReviewCard = withStyles(styles)(({ classes, topReview }) => {
  return (
    <Card className={topReview ? `${classes.card} ${classes.topReviewCard}` : `${classes.card}`}>
      {topReview && <div className={classes.ellipse} />}

      <CardHeader
        classes={{
          title: topReview ? classes.whiteText : classes.empty,
          subheader: topReview ? classes.whiteText : classes.empty,
        }}
        avatar={<Avatar className={classes.avatar}>MK</Avatar>}
        action={
          <div className={classes.verified}>
            {topReview && (
              <Typography variant="h3" className={classes.textTopReview}>
                #Top{' '}
                <span style={{ backgroundColor: 'rgba(239, 239, 239, 0.6)', padding: '3px 15px', borderRadius: 10 }}>
                  REVIEW
                </span>
              </Typography>
            )}
            <Icon className="a-color-success">verified_user</Icon>
            <Typography className="a-color-success spacing-left" variant="subtitle1">
              Đã mua hàng
            </Typography>
          </div>
        }
        title="Chorizo Paella"
        subheader="March 14, 2019"
      />

      <div className={classes.title}>
        <IconButton classes={{ root: classes.rootIconButton }}>
          <Icon>thumb_up_alt</Icon>
        </IconButton>
        <Typography className={topReview ? classes.whiteText : classes.empty} variant="h5">
          <b>Great quality and great price!</b>
        </Typography>
      </div>
      <CardContent>
        <Typography className={topReview ? classes.whiteText : classes.empty} gutterBottom component="p">
          This shirt is quite a unique item. It's the kind of material that reminds me of pleather. It doesn't really
          breathe, and if you sweat a lot, the material may be a problem. But despite these drawbacks, I love this
          shirt. It has the look of being a man's shirt on the hanger--to me--but it doesn't fit that way. It is very
          chick, very cute. The colors are on the outside of the garment, and they are quite vivid. That's what truly
          drew me to buy this item. I ordered the size I usually buy when it comes to all blouses and shirts, no matter
          the store or brand, and the fit was fine, perfect actually. It wasn't tight in the arms, even when I lifted
          them. It wasn't tight through the bust either. The shirt fell and flowed effortlessly. <br />
          While this blouse does have its drawbacks with the 95%polyester + 5%spandex blend, I think it lends to the
          vibrancy of color and the style. If you're fussy about shirts, the material, natural feel, you may want to
          look someplace else, but I think this is a good buy. I recommend.
        </Typography>
      </CardContent>
      <Typography className={classes.people} variant="subtitle2">
        30 người cảm thấy hữu ích
      </Typography>
      <CardActions>
        <Tooltip title="Hữu ích">
          <IconButton>
            <Icon className={topReview ? classes.whiteText : classes.empty}>star_border</Icon>
          </IconButton>
        </Tooltip>
        <i className="a-text-separator" />
        <Button className={topReview ? classes.whiteText : classes.empty}>Bình luận</Button>
        <i className="a-text-separator" />
        <Button className={topReview ? classes.whiteText : classes.empty}>Báo cáo</Button>
      </CardActions>
    </Card>
  );
});

ReviewCard.PropTypes = {
  topReview: PropTypes.bool,
};
ReviewCard.defaultProps = {
  topReview: false,
};

const CustomerReviews = ({ classes }) => {
  const [reviewType, setReviewType] = useState(0);
  return (
    <Grid container className={classes.customerReview} spacing={24}>
      <Grid item lg={3}>
        <Typography className="spacing-top" variant="h1">
          3260 Lượt Đánh Giá
        </Typography>
        <Card className={classes.commentCard}>
          <CardActionArea>
            <CardMedia className={classes.media} image="assets/images/digital_v1-05.png" title="Customer's Reviews" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Phản hồi
              </Typography>
              <Typography component="p">
                Hãy chia sẻ với chúng tôi về cảm nhận của bạn khi sử dụng sản phẩm này.
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Viết bình luận
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item lg={9}>
        <Select
          className={classes.reviewSelect}
          value={reviewType}
          onChange={event => setReviewType(event.target.value)}
          inputProps={{
            name: 'filter',
            id: 'filter-simple',
          }}
        >
          <MenuItem value={0}>Lượt đánh giá cao nhất</MenuItem>
          <MenuItem value={1}>Lượt đánh giá gần đây</MenuItem>
        </Select>
        <ReviewCard topReview />
        <ReviewCard />
        <ReviewCard />
        <Button className={classes.showMore} variant="contained" color="secondary">
          Xem thêm
        </Button>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CustomerReviews);
