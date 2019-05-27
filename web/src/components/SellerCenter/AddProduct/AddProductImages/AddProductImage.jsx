/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useState, useContext, useEffect } from 'react';
import { Button, Slide, Dialog, AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import AddProductImgSection from './AddProductImgSection';
import ApplyImgMultiSecModal from './ApplyImgMultiSecModal';
import OpenContext from '../../../../utils/context/OpenContextAddProduct';
import ProductDataContext from '../../../../utils/context/ProductDataContext';
import ProductDetailPage from '../../../Product/ProductDetail/ProductDetailPage';

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

function AddProductImage(props) {
  const { setValue } = props;
  // Get product data from final form STATE using context
  const productData = useContext(ProductDataContext);
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
    const portionOfData = (({ productName, brandName, fromWhere, briefDescription }) => ({
      productName,
      brandName,
      fromWhere,
      briefDescription,
    }))(data);
    // Just get one price to present for the price of product
    // Giá sẽ thay đổi tùy theo options của sản phẩm, nhưng ở đây vi muc đích preview nên chỉ đại diện 1 price
    portionOfData.sellPrice = data.products[0].sellPrice;
    const previewingData = {
      productImage,
      options: newOptions,
      basicInfo: portionOfData,
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
      {products.map((product, index) => (
        <AddProductImgSection
          files={images[index]}
          setImages={handleUpdateImages(index)}
          setIndexProduct={handleSetIndex(index)}
          key={product.productId}
          productName={product.name}
        />
      ))}
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

export default AddProductImage;
