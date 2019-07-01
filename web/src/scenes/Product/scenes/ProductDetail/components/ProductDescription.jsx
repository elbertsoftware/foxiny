import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const styleProductDescrip = theme => ({
  rootDescription: {
    position: 'relative',
    minHeight: 500,
    backgroundImage: 'url(/assets/images/white-bg-2.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  decorDiv: {
    position: 'absolute',
    width: '20%',
    height: '100%',
    backgroundColor: '#f5f5f6',
    zIndex: 1,
  },
  decorDivLeft: {
    top: 0,
    left: 0,
  },
  decorDivRight: {
    top: 0,
    right: 0,
  },
  imageZone: {
    zIndex: 2,
  },
  heroImg: {
    width: '80%',
    height: 400,
    objectFit: 'cover',
    backgroundColor: '#000',
    opacity: 0.7,
    transition: 'opacity 1s',
    boxShadow: '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)',
    '&:hover': {
      opacity: 1,
      cursor: 'pointer',
    },
  },
  paragraphSpacing: {
    margin: `${theme.spacing.unit * 5}px 0`,
  },
});

const ProductDescription = withStyles(styleProductDescrip)(
  ({ classes, heroImg, title, descriptions, imgLeftContentRight }) => {
    return (
      <div className={classes.rootDescription}>
        {/* Decoration for hero image. */}
        <div
          className={
            /* Just override the decorDivRight change right into left */
            imgLeftContentRight
              ? `${classes.decorDiv} ${classes.decorDivLeft}`
              : `${classes.decorDiv} ${classes.decorDivRight}`
          }
        />
        {imgLeftContentRight ? (
          <Grid className="maintain-height" container alignItems="center">
            <Grid className={`well ${classes.imageZone}`} item md={4}>
              <Grid container justify="center">
                <img alt="hero-image" src={heroImg} className={classes.heroImg} />
              </Grid>
            </Grid>
            <Grid className="well" item md={8}>
              <Typography className="spacing-top-bottom" gutterBottom variant="h2">
                {title}
              </Typography>
              {descriptions.map((descrip, index) => (
                <Typography key={index} className={classes.paragraphSpacing}>
                  {descrip}
                </Typography>
              ))}
            </Grid>
          </Grid>
        ) : (
          <Grid className="maintain-height" container alignItems="center">
            <Grid className="well" item md={8}>
              <Typography className="spacing-top-bottom" gutterBottom variant="h2">
                {title}
              </Typography>
              {descriptions.map((descrip, index) => (
                <Typography key={index} className={classes.paragraphSpacing}>
                  {descrip}
                </Typography>
              ))}
            </Grid>
            <Grid className={`well ${classes.imageZone}`} item md={4}>
              <Grid container justify="center">
                <img alt="hero-image" src={heroImg} className={classes.heroImg} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    );
  },
);

ProductDescription.propTypes = {
  imgLeftContentRight: PropTypes.bool,
};

ProductDescription.defaultProps = {
  imgLeftContentRight: false,
};

export default ProductDescription;
