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
import '../../../../../utils/style/commonStyle.css';

const styles = theme => ({
  customerReview: {
    padding: 30,
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

export const CustomerReviews = withStyles(styles)(({ classes }) => {
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
});
