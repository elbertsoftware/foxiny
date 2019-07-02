import React, { useState } from 'react';
import {
  withStyles,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Link,
  Button,
  Select,
  MenuItem,
  Icon,
} from '@material-ui/core';
import ReviewCard from '../ProductDetail/components/CustomerReview';
import Search from '../../../../components/Search/Search';

const styles = theme => ({
  rootCommentSection: {
    padding: 24,
  },
  allCommentList: {},
  card: {
    margin: '16px 0 4px',
    display: 'flex',
    padding: 16,
  },
  productImg: {
    width: '10rem',
    backgroundSize: 'contain',
  },
  content: {
    padding: 0,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  price: {
    color: theme.palette.secondary.main,
  },
  searchControl: {
    display: 'flex',
    alignItems: 'baseline',
  },
  search: {
    width: '50%',
    margin: '1rem 0 2rem',
  },
  searchCondition: {
    display: 'flex',
    margin: '0 10px 2rem',
  },
  condition: {
    marginRight: '2rem',
  },
  pagination: {
    display: 'flex',
    margin: '2rem auto',
  },
  marginRight: {
    marginRight: '0.5rem',
  },
  productInfoList: {
    margin: '1rem 0',
  },
  amountOfReviews: {
    marginLeft: 8,
  },
});

const ReviewedProductInfo = withStyles(styles)(({ classes, image, title, price, retailer }) => {
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.productImg} image={image} title="TShirts for women" />

      <CardContent className={classes.content}>
        <Typography variant="h3">{title}</Typography>
        <Typography>
          by{' '}
          <Link href="#" color="primary" variant="h6">
            {retailer}
          </Link>
        </Typography>
        <br />
        <Typography>
          Giá: <span className={classes.price}>{price}</span>
        </Typography>
      </CardContent>
    </Card>
  );
});

const CustomerAlsoView = withStyles(styles)(({ classes }) => {
  return (
    <Grid className={classes.productInfoList} container justify="flex-end">
      <Typography gutterBottom variant="h6">
        Khách hàng cũng đã xem những sản phẩm này ...
      </Typography>
      <ReviewedProductInfo
        image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
        title="Women's Shirt Oxford"
        retailer="Shaphia Shop"
        price="100$ - 200$"
      />
      <ReviewedProductInfo
        image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
        title="Women's Shirt Oxford"
        retailer="Shaphia Shop"
        price="100$ - 200$"
      />
      <ReviewedProductInfo
        image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
        title="Women's Shirt Oxford"
        retailer="Shaphia Shop"
        price="100$ - 200$"
      />
      <ReviewedProductInfo
        image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
        title="Women's Shirt Oxford"
        retailer="Shaphia Shop"
        price="100$ - 200$"
      />
      <ReviewedProductInfo
        image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
        title="Women's Shirt Oxford"
        retailer="Shaphia Shop"
        price="100$ - 200$"
      />
    </Grid>
  );
});

const ProductReviews = ({ classes }) => {
  const [reviewType, setReviewType] = useState(0);
  return (
    <Grid className={classes.rootCommentSection} container>
      <Grid className={classes.allCommentList} item md={8}>
        <ReviewedProductInfo
          image="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
          title="Women's Shirt Oxford"
          retailer="Shaphia Shop"
          price="100$ - 200$"
        />
        <div className={classes.searchControl}>
          <div className={classes.search}>
            <Search background="dark" />
          </div>
          <Button style={{ height: 40, margin: '0 10px' }} variant="contained" color="primary">
            Tìm
          </Button>
        </div>
        <div className={classes.searchCondition}>
          <div className={classes.condition}>
            <Typography variant="h6">Sắp xếp theo</Typography>
            <Select
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
          </div>
          <div>
            <Typography variant="h6">Lọc theo</Typography>
            <Select
              value={reviewType}
              onChange={event => setReviewType(event.target.value)}
              inputProps={{
                name: 'filter',
                id: 'filter-simple',
              }}
            >
              <MenuItem value={0}>Tất cả đánh giá</MenuItem>
              <MenuItem value={1}>Đã xác thực mua hàng</MenuItem>
            </Select>
          </div>
        </div>
        <Typography className={classes.amountOfReviews} gutterBottom variant="subtitle2">
          Hiển thị 1-10 trong tổng số 1000 lượt đánh giá
        </Typography>
        <ReviewCard topReview />
        <ReviewCard topReview />
        <ReviewCard topReview />
        <ReviewCard topReview />
        <ReviewCard topReview />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </Grid>
      <Grid className={classes.advertisement} item md={4}>
        <CustomerAlsoView />
      </Grid>
      <div className={classes.pagination}>
        <Button className={classes.marginRight} variant="contained" color="inherit">
          <Icon>keyboard_arrow_left</Icon>Trang trước
        </Button>
        <Button variant="contained" color="inherit">
          Trang kế <Icon>keyboard_arrow_right</Icon>
        </Button>
      </div>
    </Grid>
  );
};

export default withStyles(styles)(ProductReviews);
