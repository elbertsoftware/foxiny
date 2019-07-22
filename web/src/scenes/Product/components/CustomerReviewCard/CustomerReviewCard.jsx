import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Avatar,
  Typography,
  Icon,
  IconButton,
  CardContent,
  CardActions,
  Tooltip,
  Button,
  makeStyles,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const styles = makeStyles(theme => ({
  card: {
    marginBottom: 24,
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
    marginBottom: 24,
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
}));

const ReviewCard = ({ topReview }) => {
  const classes = styles();
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
};

ReviewCard.propTypes = {
  topReview: PropTypes.bool,
};
ReviewCard.defaultProps = {
  topReview: false,
};

export default ReviewCard;
