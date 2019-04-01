import React from 'react';
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
  Paper,
} from '@material-ui/core';
import '../../../utils/style/commonStyle.css';
import { red } from '@material-ui/core/colors';

const styles = theme => ({
  customerReview: {
    padding: 30,
  },
  card: {
    marginBottom: 10,
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
  paperImage: {
    margin: '24px 0',
    width: '80%',
    height: 400,
    backgroundImage: 'url(assets/images/digital_v1-05.png)',
    backgroundPosition: 'left',
    backgroundSize: 'contain',
    backgroundAttachment: 'fixed',
  },
});

const ReviewCard = withStyles(styles)(({ classes }) => {
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>MK</Avatar>}
        action={
          <div className={classes.verified}>
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
        <Typography variant="h5">
          <b>Great quality and great price!</b>
        </Typography>
      </div>
      <CardContent>
        <Typography gutterBottom component="p">
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
            <Icon>star_border</Icon>
          </IconButton>
        </Tooltip>
        <i className="a-text-separator" />
        <Button>Bình luận</Button>
        <i className="a-text-separator" />
        <Button>Báo cáo</Button>
      </CardActions>
    </Card>
  );
});

const CustomerReviews = ({ classes }) => {
  return (
    <Grid container className={classes.customerReview} spacing={24}>
      <Grid item lg={4}>
        <Typography className="spacing-top" variant="h1">
          3260 Lượt Đánh Giá
        </Typography>
        <Paper classes={{ root: classes.paperImage }} elevation={8} />
      </Grid>
      <Grid item lg={8}>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CustomerReviews);
