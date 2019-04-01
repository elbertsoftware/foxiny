import React, { useState } from 'react';
import { withStyles, Dialog, Grid } from '@material-ui/core';
import '../../../utils/style/commonStyle.css';
import Loading from '../../App/Loading';
import { DialogTitle, DialogContent } from '../../../utils/common/Dialog';

const styles = theme => ({
  thumbnails: {
    overflow: 'auto',
  },
  thumbnailImg: {
    display: 'inline-block',
    width: 75,
    height: 75,
    margin: '10px 10px 0 0',
    border: '1px solid #f7f7f8',
    '&:hover': {
      border: `2px solid ${theme.palette.secondary.main}`,
    },
  },
  selected: {
    '-webkit-box-shadow': '0 0 18px 1px #F9AA33',
    'box-shadow': '0 0 18px 1px #F9AA33',
    border: `2px solid ${theme.palette.secondary.main}`,
  },
  imgFit: {
    width: 375,
    height: 375,
    objectFit: 'contain',
  },
});

const ImgGalleryModal = ({ handleClose, open, listImage }) => (
  <Dialog maxWidth="lg" fullWidth onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
      Ảnh (5)
    </DialogTitle>
    <DialogContent>
      <ImgGalleryContent listImage={listImage} />
    </DialogContent>
  </Dialog>
);

const ImgGalleryContent = withStyles(styles)(({ classes, listImage }) => {
  const [activeIndex, setActive] = useState(0);
  const handleChangeImg = index => {
    setActive(index);
  };
  return (
    <Grid container spacing={16}>
      <Grid item xs={8} className="a-text-center">
        <div className="img-wrapper maintain-height">
          <div className="ig-inner maintain-height">
            {/* <Loading circle /> */}
            <img id="zoom-image" className={classes.imgFit} src={listImage[activeIndex].src} />
          </div>
        </div>
      </Grid>

      <Grid item xs={4}>
        <div className={classes.thumbnails}>
          {listImage.map((ele, index) => {
            const className = `${classes.thumbnailImg}${
              activeIndex === index ? ` ${classes.selected}` : ''
            } fit-img-div`;
            return (
              <a key={index} href="#" onClick={() => handleChangeImg(index)} data-url={ele.src}>
                <div className={className} style={{ backgroundImage: `url(${ele.src})` }} />
              </a>
            );
          })}
        </div>
      </Grid>
    </Grid>
  );
});

export default ImgGalleryModal;
