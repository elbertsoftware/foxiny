import React, { useState } from 'react';
import {
  withStyles,
  Dialog,
  Button,
  Grid,
  FormGroup,
  FormControlLabel,
  Card,
  CardMedia,
  Checkbox,
  Typography,
} from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { DialogTitle, DialogContent, DialogActions } from '../../../../../../../components/Dialog/Dialog';

const styles = theme => ({
  root: {},
  card: {
    maxWidth: 220,
  },
  media: {
    height: 200,
  },
  formGroup: {
    marginTop: '2rem',
  },
  active: {
    border: `4px solid ${theme.palette.secondary.main}`,
  },
});

const ApplyImgMultiSecModal = ({ classes, open, handleClose, currentIndex, images, setImages, products }) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  let imgs;
  // Current product that clicked the modal.
  // Based on current product and get images uploaded for it
  if (currentIndex > -1) {
    imgs = images[currentIndex];
  }
  // Checkbox: Change event to select PRODUCTS to copy
  const handleChange = id => () => {
    // Determine which product need to be applied the copied image
    const selectedIndex = selectedProduct.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProduct, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProduct.slice(1));
    } else if (selectedIndex === selectedProduct.length - 1) {
      newSelected = newSelected.concat(selectedProduct.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProduct.slice(0, selectedIndex),
        selectedProduct.slice(selectedIndex + 1),
      );
    }
    setSelectedProduct(newSelected);
  };
  const saveClick = () => {
    if (selectedImages.length === 0) {
      toast.warn('Vui lòng click vào ảnh mà bạn chọn để copy cho sản phẩm khác !');
      return;
    }
    // Copying images for other products except current product
    const newImages = images;
    selectedProduct.forEach(element => {
      if (element !== undefined) {
        newImages[element] = selectedImages;
      }
    });
    setImages(newImages);
    // Clear the state
    setSelectedProduct([]);
    setSelectedImages([]);
    // Close modal
    handleClose();
  };
  // Event click for choosing images need to be copied
  const handleClick = img => () => {
    setIsActive(!isActive);
    // Determine how many images that user want to copy for other products
    const selectedIndex = selectedImages.indexOf(img);
    let newImageSelected = [];
    if (selectedIndex === -1) {
      newImageSelected = newImageSelected.concat(selectedImages, img);
    } else if (selectedIndex === 0) {
      newImageSelected = newImageSelected.concat(selectedImages.slice(1));
    } else if (selectedIndex === newImageSelected.length - 1) {
      newImageSelected = newImageSelected.concat(selectedImages.slice(0, -1));
    } else if (selectedIndex > 0) {
      newImageSelected = newImageSelected.concat(
        selectedImages.slice(0, selectedIndex),
        selectedImages.slice(selectedIndex + 1),
      );
    }
    setSelectedImages(newImageSelected);
  };
  // Checkbox: Choosing all products for the sake of copying
  const onClickAll = event => {
    if (event.target.checked) {
      setSelectedProduct(
        products.map((product, index) => {
          if (index === currentIndex) {
            // The idea is to skip the current product that triggered modal (currentIndexProduct)
            return undefined;
          }
          return index;
        }),
      );
      return;
    }
    setSelectedProduct([]);
  };
  const selectedImageName = selectedImages.map(ele => ele.name);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Sao chép hình ảnh cho sản phẩm khác</DialogTitle>
      <DialogContent>
        {imgs && imgs.length !== 0 && (
          <Typography variant="h5" gutterBottom>
            Vui lòng click chọn ảnh mà bạn muốn sao chép
          </Typography>
        )}
        <Grid container spacing={8}>
          {imgs && imgs.length !== 0 ? (
            imgs.map(img => (
              <Grid key={img.preview} item xs>
                <Card
                  onClick={handleClick(img)}
                  elevation={0}
                  className={classNames({
                    [classes.card]: true,
                    [classes.active]: selectedImageName.indexOf(img.name) !== -1,
                  })}
                >
                  <CardMedia className={classes.media} image={img.preview} src={img.preview} />
                </Card>
              </Grid>
            ))
          ) : (
            <Typography align="center" variant="h5">
              Chưa có hình ảnh được chọn ...
            </Typography>
          )}
        </Grid>
        <FormGroup className={classes.formGroup}>
          <FormControlLabel control={<Checkbox onChange={onClickAll} value="all" />} label="Tất cả" />
          {products &&
            products.map((product, index) => {
              if (index === currentIndex) return null;
              const isSelected = selectedProduct.indexOf(index) !== -1;
              return (
                <FormControlLabel
                  key={product.productId}
                  control={<Checkbox onChange={handleChange(index)} />}
                  label={product.name}
                  checked={isSelected}
                />
              );
            })}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          Đóng
        </Button>
        <Button onClick={saveClick} variant="contained" color="secondary">
          Lưu lựa chọn
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ApplyImgMultiSecModal.propTypes = {
  products: PropTypes.array,
};
export default withStyles(styles)(ApplyImgMultiSecModal);
