import React, { useEffect } from 'react';
import { AppBar, Typography, withStyles, Grid, GridList, GridListTile, GridListTileBar, Icon } from '@material-ui/core';
import Glider from 'glider-js';

import NavBar from '../../components/NavBar/NavBar';
import Banner from '../../components/Banner/Banner';

const tileData = [
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-23583524BC63F3HE._V535581698_.jpg',
    title: 'Health and Household',
    cols: 2,
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/I/41JnnaZGJ2L._AC_SY200_.jpg',
    title: 'Computer & Accessories',
    cols: 1,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-31383EA36FFED919._V531363695_.jpg',
    title: ' Toy & Games',
    cols: 2,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-2B638E86650FFF18._V531815327_.jpg',
    title: 'Video Games',
    cols: 2,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-275C68D005273E1H._CB534580833_.jpg',
    title: 'Baby',
    cols: 2,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/acs/amazon-designer/2017/02/03/DURM-213F370665902D13.jpeg',
    title: 'Luggage',
    cols: 1,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/clothingv3._V519733538_.jpg',
    title: "Men's Fashion",
    cols: 2,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-230DA9039F21E515._V535729156_.jpg',
    title: 'Electronics',
    cols: 3,
  },
  {
    img: 'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/kidsv2._V519741852_.jpg',
    title: 'Home & Kitchen',
    cols: 3,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/clothingv4._V519734107_.jpg',
    title: "Girl's Fashion",
    cols: 1,
  },
  {
    img:
      'https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/email/asins/DURM-2762A242B2B5D9D1._V534592485_.jpg',
    title: 'Pet Supplies',
    cols: 1,
  },
];

const styles = () => ({
  rootAppBar: {
    backgroundImage:
      'linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(assets/images/banner-image-demo.jpg)',
    height: '100vh',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  },
  home: {
    marginTop: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heroText: {
    fontSize: 56,
    fontWeight: 900,
  },
  heroSubText: {
    fontWeight: 300,
    letterSpacing: 3,
    margin: '12px 16px 0',
  },
  gridList: {
    width: '100%',
    height: '100%',
    transform: 'translateZ(0)',
    borderRadius: 30,
    overflow: 'hidden',
    boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)',
  },
  gridListTitle: {
    overflow: 'hidden',
    filter: 'brightness(70%)',
    transition: 'filter 0.5s',
    '&:hover': {
      filter: 'brightness(100%)',
    },
  },
  titleBar: {
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  imgMedium: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: 'brightness(70%)',
    transform: 'scale(1.15)',
    transition: 'transform 0.5s filter 0.5s',
    '&:hover': {
      transform: 'scale(1.03)',
      filter: 'brightness(100%)',
    },
  },
  linkColor: {
    color: '#fff',
  },
  greetingContainer: {
    height: 500,
    display: 'inline-block',
    textAlign: 'center',
  },
  greetingMessage: {
    padding: '0 20px 20px',
  },
  maintainHeight: {
    height: '100%',
  },
  categoryGrid: {
    position: 'relative',
    opacity: 0.9,
    paddingRight: '2rem',
  },
  favorite: {
    height: 350,
    overflow: 'hidden',
    position: 'relative',
    width: '80%',
    margin: '0 auto',
    padding: '10px 0 30px',
    boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)',
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
  },
  categoryNameText: {
    fontSize: 13,
    color: '#fff',
  },
  overflow: {
    overflow: 'hidden',
  },
  arrowLeft: {
    position: 'absolute',
    top: '41%',
    left: '1rem',
    cursor: 'pointer',
  },
  arrowRight: {
    position: 'absolute',
    top: '41%',
    right: '2.7rem',
    cursor: 'pointer',
  },
});

const Homepage = ({ classes }) => {
  useEffect(() => {
    const glider = new Glider(document.querySelector('.product-categories'), {
      slidesToShow: 1,
      arrows: {
        prev: '.glider-prev-product-category',
        next: '.glider-next-product-category',
      },
    });
  }, []);
  return (
    <AppBar classes={{ root: classes.rootAppBar }} position="static" color="primary">
      <NavBar />
      <div className={classes.home}>
        <div className={classes.greetingContainer}>
          <Grid className={classes.maintainHeight} container justify="center" alignItems="center">
            <Grid className={`${classes.greetingMessage} ${classes.maintainHeight}`} item md={6}>
              <Grid
                className={classes.maintainHeight}
                container
                direction="column"
                justify="flex-start"
                alignItems="center"
              >
                <div style={{ display: 'inline-flex', marginBottom: 10 }}>
                  <Typography className={classes.heroText} gutterBottom color="inherit" variant="h1">
                    FOXINY Inc |
                  </Typography>
                  <Typography className={classes.heroSubText} gutterBottom color="inherit" variant="h5">
                    Mua sắm trong tầm tay
                  </Typography>
                </div>
                <Grid container justify="center">
                  <Grid item md={8}>
                    <div className={`${classes.favorite} ${classes.maintainHeight}`}>
                      <Typography color="inherit">Men's Dress Shoes</Typography>
                      <div className={classes.overflow}>
                        <a href="#">
                          <img
                            className={classes.imgMedium}
                            src="https://images-na.ssl-images-amazon.com/images/G/01/amazonglobal/images/Fuji/Dash/2019/January/mShoes_1X._CB455678051_SY260_.jpg"
                            alt="favorite"
                          />
                        </a>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid className={`${classes.categoryGrid} ${classes.maintainHeight}`} item md={6}>
              <div className="product-categories">
                <GridList cols={5} cellHeight={220} spacing={2} className={classes.gridList}>
                  {tileData.slice(0, 6).map(tile => (
                    <GridListTile className={classes.gridListTitle} key={tile.img} cols={tile.cols} rows={1}>
                      <img src={tile.img} alt={tile.title} />
                      <GridListTileBar
                        title={
                          <a className={classes.linkColor} href="#">
                            {tile.title}
                          </a>
                        }
                        titlePosition="bottom"
                        className={classes.titleBar}
                      />
                    </GridListTile>
                  ))}
                </GridList>
                <GridList cols={5} cellHeight={220} spacing={2} className={classes.gridList}>
                  {tileData.slice(6, 12).map(tile => (
                    <GridListTile className={classes.gridListTitle} key={tile.img} cols={tile.cols} rows={1}>
                      <img src={tile.img} alt={tile.title} />
                      <GridListTileBar
                        title={
                          <a className={classes.linkColor} href="#">
                            {tile.title}
                          </a>
                        }
                        titlePosition="bottom"
                        className={classes.titleBar}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
              <Icon className={`glider-prev-product-category ${classes.arrowLeft}`}>arrow_back_ios</Icon>
              <Icon className={`glider-next-product-category ${classes.arrowRight}`}>arrow_forward_ios</Icon>
            </Grid>
          </Grid>
        </div>
        <Banner />
      </div>
    </AppBar>
  );
};

export default withStyles(styles)(Homepage);
