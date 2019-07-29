/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useState, useContext, useEffect } from 'react';
import { Button, Slide, Dialog, AppBar, Toolbar, Typography, withStyles, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import AddProductImgSection from './components/AddProductImgSection';
import ApplyImgMultiSecModal from './components/ApplyImgMultiSecModal';
import OpenContext from '../../../../../../utils/context/OpenContextAddProduct';
import ProductDataContext from '../../../../../../utils/context/ProductDataContext';
import ProductDetailPage from '../../../../../Product/scenes/ProductDetail/ProductDetailPage';
import ProductEditDataContext from '../../../../../../utils/context/ProductEditDataContext';
import ApprovalContainer from '../../../../../../components/ApproveContainer/ApprovalContainer';
import Paper from '../../../../../../components/Paper/Paper';

const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
export const Preview = withStyles(styles)(({ classes, open, handleClose, productImage, options, basicInfo }) => {
  // Other things
  return (
    <Dialog fullScreen open={open} disableRestoreFocus={true} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Xem trước sản phẩm
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            Đóng
          </Button>
        </Toolbar>
      </AppBar>
      <ProductDetailPage preview optionList={options} productImageData={productImage} textData={basicInfo} />
    </Dialog>
  );
});

const addProductImageStyles = makeStyles({
  ruleOfImage: {
    borderRadius: 30,
    padding: 24,
    margin: '16px 0',
  },
});

function AddProductImage(props) {
  const { setValue, edit, review } = props;
  // Get product data from final form STATE using context
  const productData = useContext(edit ? ProductEditDataContext : ProductDataContext);
  const { products } = productData.data;

  // Logic
  const [images, setImages] = useState(Array(products.length).fill([]));
  const handleUpdateImages = index => files => {
    const newArray = [...images];
    newArray[index] = files;
    setImages(newArray);
  };
  const [indexOfProduct, setIndexOfProduct] = useState(-1);
  const handleSetIndex = index => () => {
    setIndexOfProduct(index);
  };
  const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState([]); // selected product to apply images for
  // const [selectedImages, setSelectedImages] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openPreview, setOpenPreview] = useState(false);
  const [dataPreview, setData] = useState({});
  const handleOpenPreview = () => {
    // Data for options that store have
    const { options } = productData.data;
    const numberOption = options.length;
    // Create new data shape for product from available product object, to pass to ProductDetailPage
    // Data for images
    const productImage = {};
    products.forEach((product, index) => {
      const optionNameArr = Object.values(product).slice(0, numberOption);
      // eslint-disable-next-line camelcase
      const option1_option2_KEY = optionNameArr.join('');
      productImage[option1_option2_KEY] = images[index].map(image => image.preview);
    });
    // Deep copy an array of objects, avoid [...spreads] (swallow copy) because it will reference to original array.
    const newOptions = JSON.parse(JSON.stringify(options));
    newOptions.forEach(option => {
      option.listItems = option.listItems.map(item => item.optionValue);
    });
    // Data for Basic info of product
    const { data } = productData;
    // Get properties we want by using immediately invoked anonymous (arrow) function
    // Ignore products and options that are reconstructed above
    const basicInfo = (({ productName, brandName, fromWhere, briefDescription }) => ({
      productName,
      brandName,
      fromWhere,
      briefDescription,
    }))(data);
    // Just get one price to present for the price of product
    // Giá sẽ thay đổi tùy theo options của sản phẩm, nhưng ở đây vi muc đích preview nên chỉ đại diện 1 price
    basicInfo.sellPrice = data.products[0].sellPrice;
    const previewingData = {
      productImage,
      options: newOptions,
      basicInfo,
    };
    setData(previewingData);
    setOpenPreview(true);
  };
  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  useEffect(() => {
    setValue('images', images);
  }, [images]);
  useEffect(() => {
    if (productData.data.images) {
      setImages(productData.data.images);
    }
  }, []);

  const classes = addProductImageStyles();

  return (
    <OpenContext.Provider value={{ setOpen: handleOpen }}>
      <ApplyImgMultiSecModal
        images={images}
        open={open}
        currentIndex={indexOfProduct}
        setImages={setImages}
        handleClose={handleClose}
        products={products}
      />
      <Paper className={classes.ruleOfImage} elevation={0} background="main">
        <Typography variant="h6">Yêu cầu đối với hình ảnh: </Typography>
        <Typography variant="body2">1. Kích thước tối thiểu: </Typography>
        <Typography variant="subtitle2">- Các sản phẩm nội thất: 500 x 700 px </Typography>
        <Typography gutterBottom variant="subtitle2">
          - Các sản phẩm khác: 500 x 500 px{' '}
        </Typography>
        <Typography variant="body2">2. Toàn bộ hình ảnh không chứa logo / watermark / thông tin Nhà Bán </Typography>
      </Paper>
      <ApprovalContainer review={review} name="checkImageProducts">
        {products.map((product, index) => (
          <AddProductImgSection
            files={images[index]}
            setImages={handleUpdateImages(index)}
            setIndexProduct={handleSetIndex(index)}
            key={`product${index}`}
            productName={product.productName}
          />
        ))}
      </ApprovalContainer>
      <Button onClick={handleOpenPreview} variant="contained">
        Xem trước
      </Button>
      <Preview
        preview
        open={openPreview}
        handleClose={handleClosePreview}
        productImage={dataPreview.productImage}
        options={dataPreview.options}
        basicInfo={dataPreview.basicInfo}
      />
    </OpenContext.Provider>
  );
}

AddProductImage.propTypes = {
  edit: PropTypes.bool,
  review: PropTypes.bool,
};

AddProductImage.defaultProps = {
  edit: false,
  review: false,
};

export default AddProductImage;
