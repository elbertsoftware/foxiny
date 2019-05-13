import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Glider from 'glider-js';
import SwipeableViews from 'react-swipeable-views';
import {
  Grid,
  withStyles,
  Paper,
  Typography,
  IconButton,
  Icon,
  Divider,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Button,
  Tabs,
  Tab,
} from '@material-ui/core';
import ProductCard from '../ProductCard';
import '../../../utils/style/commonStyle.css';
import ImgGalleryModal from './ImgGalerryModal';
import '../../../utils/style/buyBox.css';
import { CustomerReviews } from '../CustomerReviews/CustomerReviews';
import ProductDescription from './ProductDescription';
import TabContainer from '../../../utils/common/TabContainer';

const styles = theme => ({
  root: {
    marginTop: 30,
    padding: 25,
  },
  imgBlockThumb: {
    display: 'inline-block',
    width: 60,
    height: 53,
    cursor: 'pointer',
  },
  imgCanvas: {
    width: 260,
    height: 260,
    position: 'absolute',
    top: 43,
    left: 16,
  },
  images: {
    width: 260,
    margin: '0 0 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  thumbText: {
    cursor: 'pointer',
    marginLeft: 16,
  },
  rootIconButton: {
    padding: 0,
    color: '#ff512f',
    marginRight: 3,
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  colorPaper: {
    backgroundColor: '#fff',
    marginRight: 16,
    height: '100%',
  },
  relatedProduct: {
    position: 'relative',
    padding: 20,
    backgroundColor: '#eaebee',
  },
  rootProductContainer: {
    padding: 30,
    paddingLeft: 43,
  },
  arrowLeft: {
    position: 'absolute',
    top: '50%',
    left: 15,
    cursor: 'pointer',
  },
  arrowRight: {
    position: 'absolute',
    top: '50%',
    right: 15,
    cursor: 'pointer',
  },
  expandPanel: {
    boxShadow: '0 0 0 0',
  },
  expandSummary: {
    padding: 0,
  },
  tabs: {
    marginTop: 20,
  },
});

const listImage = [
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg' },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_deeporangehthr_model_front_072014.jpg' },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_forestgreenhthr_model_front_072014.jpg' },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_graphitehthr_model_front_072014.jpg' },
  {
    src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_pinkraspberryhthr_model_front_072014.jpg',
  },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_scarleththr_model_front_072014.jpg' },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_turfgreenhthr_model_front_072014.jpg' },
  {
    src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_varsitypurplehthr_model_front_072014.jpg',
  },
  { src: 'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_vintagehthr_model_front_072014.jpg' },
];

const ProductImage = withStyles(styles)(({ classes, productImages, isPreviewed }) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => {
    if (isPreviewed) return;
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <Paper square elevation={0}>
      <div style={{ margin: '10px 0', height: 360 }}>
        <div style={{ position: 'relative' }}>
          <Paper
            elevation={7}
            className={`${classes.imgCanvas} fit-img-div`}
            style={{ backgroundImage: `url(${productImages[0]})` }}
          />
        </div>
      </div>
      <Paper square elevation={0} onClick={handleOpen} role="presentation" className={classes.images}>
        {productImages &&
          productImages.map((ele, index) => {
            return (
              <div
                key={index}
                className={`${classes.imgBlockThumb} fit-img-div`}
                style={{ backgroundImage: `url(${ele})` }}
              />
            );
          })}
      </Paper>
      <span role="presentation" onClick={handleOpen} className={classes.thumbText}>
        <span className="a-color-link">Xem tất cả {productImages && productImages.length} ảnh</span>
      </span>
      {productImages && !isPreviewed && (
        <ImgGalleryModal listImage={productImages} handleClose={handleClose} open={openModal} />
      )}
    </Paper>
  );
});
/* --------------------------------- */
/* OPTION ITEMS */
/* --------------------------------- */
// Destruct options array would be passed as props into name and listItems
const optionStyles = theme => ({
  activeItem: {
    background: theme.palette.primary.main,
    color: 'white',
    borderColor: theme.palette.primary.main,
  },
  inactive: {},
});
const OptionItems = withStyles(optionStyles)(
  ({ classes, option, selectedOption, handleSelectOption, handleSetProductImage }) => {
    const { name, listItems } = option;
    const [selected, setSelected] = useState('');
    const handeSetSelected = item => () => {
      setSelected(item);
      handleSelectOption(item);
    };
    useEffect(() => {
      handleSetProductImage();
    }, [selectedOption]);
    return (
      <React.Fragment>
        <Typography className="spacing-top-bottom" variant="h5">
          {name}
        </Typography>
        <div id="items">
          <ul>
            {listItems.map(item => (
              <li
                key={item}
                className={selected === item ? classes.activeItem : classes.inactive}
                onClick={handeSetSelected(item)}
                data-item={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Divider className="spacing-top-bottom" />
      </React.Fragment>
    );
  },
);

const ProductInfo = withStyles(styles)(({ classes, textData }) => {
  const [expanded, setExpanded] = useState(false);

  const handleOnChange = (e, exp) => {
    setExpanded(exp);
  };

  return (
    <Paper className="maintain-height well">
      <Typography variant="h6">{textData.productName}</Typography>
      <div className={`${classes.flexCenter} spacing-top-bottom`}>
        <IconButton classes={{ root: classes.rootIconButton }}>
          <Icon>thumb_up_alt</Icon>
        </IconButton>
        <Typography variant="subtitle2">334</Typography>
        <span className={classes.thumbText}>
          <span className="a-color-link">50 lượt đánh giá</span>
        </span>
      </div>
      <Divider className="spacing-top-bottom" />
      {textData.briefDescription &&
        textData.briefDescription.split('\n').map(description => (
          <Typography style={{ margin: '16px 0' }}>
            <strong>{description}</strong>
          </Typography>
        ))}
      <ExpansionPanel className={classes.expandPanel} expanded={expanded} onChange={handleOnChange}>
        <ExpansionPanelSummary className={classes.expandSummary}>
          <a className="a-color-link">{expanded ? 'Rút gọn' : 'Xem thêm'}</a>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            MOST APPLE USB-C CHARGERS WILL NOT WORK BECAUSE MOST MODELS DO NOT SUPPORT 12V or 15V OUTPUT
            <br /> About Apple Macbook power adapter
            <br /> Some Apple PD power chargers has no 12v or 15v output, some new models have. Here is the list:
            <br /> APPLE A1540 (29W) output: 5V/2.4A 14.5V/2A NOK (insufficient power for surface Pro but works with
            surface go and surface pro m3 model)
            <br /> APPLE A1882 (30W) 5V/3A 9V/3A 15V/2A 20V/1.5A NOK (insufficient power for surface Pro but works with
            surface go and surface pro m3 model)
            <br /> APPLE A1718(previous 61W) 5V/2.4A 9V/3A 20.3V/3A NOK (no 15V/12V output)
            <br /> APPLE A1947(New 61W) 5V/3A 9V/3A 15V/3A 20.3/3A OK
            <br /> APPLE A1719(87W) 5.2A/2.4A 9V/3A 20.2V/4.3A NOK (no 15V/12V output)
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Paper>
  );
});

/* const ColorItems = ({ setActiveImg }) => {
  const handleOnClick = event => {
    const imgUrl = event.target.dataset.colorImg;
    const { color } = event.target.dataset;
    if (imgUrl && color) {
      setActiveImg(imgUrl);
      // event.target.style.boxShadow = `0 0 0 2px #eee, 0 0 0 4px ${color}`;
    }
  };
  return (
    <React.Fragment>
      <Typography className="spacing-top-bottom" variant="h5">
        Màu sản phẩm
      </Typography>
      <div id="colors">
        <ul>
          <li
            onClick={handleOnClick}
            style={{ backgroundColor: 'darkblue' }}
            data-color="darkblue"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            onClick={handleOnClick}
            style={{ backgroundColor: 'orangered' }}
            data-color="orangered"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_deeporangehthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            onClick={handleOnClick}
            style={{ backgroundColor: 'darkgreen' }}
            data-color="darkgreen"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_forestgreenhthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            onClick={handleOnClick}
            style={{ backgroundColor: 'grey' }}
            data-color="grey"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_graphitehthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            onClick={handleOnClick}
            style={{ backgroundColor: 'hotpink' }}
            data-color="hotpink"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_pinkraspberryhthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            style={{ backgroundColor: 'red' }}
            data-color="red"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_scarleththr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            style={{ backgroundColor: 'limegreen' }}
            data-color="limegreen"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_turfgreenhthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            style={{ backgroundColor: 'purple' }}
            data-color="purple"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_varsitypurplehthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
          <li
            style={{ backgroundColor: 'darkgrey' }}
            data-color="darkgrey"
            data-color-img="http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_vintagehthr_model_front_072014.jpg"
          >
            <span className="glyphicon" />
          </li>
        </ul>
      </div>
      <Divider className="spacing-top-bottom" />
    </React.Fragment>
  );
};
*/
/* --------------------------------- */
/* QUANTITY */
/* --------------------------------- */
const QuantityButton = ({ classes, quantity, setQuantity, className }) => {
  const increQuan = () => {
    setQuantity(quantity + 1);
  };
  const decreQuan = () => {
    if (quantity < 2) return;
    setQuantity(quantity - 1);
  };
  return (
    <div id="quantity-btn" className={className}>
      <button type="button" className="plus-minus-button" onClick={decreQuan}>
        -
      </button>
      <input className="quantity-input" type="text" value={quantity} min={1} readOnly />
      <button type="button" className="plus-minus-button" onClick={increQuan}>
        +
      </button>
    </div>
  );
};
/* --------------------------------- */
/* BUY BOX */
/* --------------------------------- */
const BuyBox = ({ classes, quantity, setQuantity, optionList, textData: { price, brandName } }) => (
  <Paper classes={{ root: classes.colorPaper }}>
    <div className="product-options well">
      <div className="flex">
        <Typography variant="h5">Mua mới</Typography>
        <Typography variant="h4" color="secondary">
          VND {price}
        </Typography>
      </div>
      <Divider className="spacing-top-bottom" />
      {optionList}
      <Typography className="spacing-top-bottom" variant="h5">
        Số lượng
      </Typography>
      <QuantityButton className="spacing-top-bottom" quantity={quantity} setQuantity={setQuantity} classes={classes} />
      <Typography className="spacing-top-bottom a-color-success block" variant="h5">
        Còn hàng.
      </Typography>
      <Typography className="spacing-top-bottom" variant="subtitle1">
        Được bán bởi <span className="a-color-link">{brandName}</span>
      </Typography>
      <Button variant="contained" className="spacing-top" color="secondary" fullWidth>
        Thêm vào giỏ
      </Button>
    </div>
  </Paper>
);
BuyBox.propTypes = {
  classes: PropTypes.object.isRequired,
  optionList: PropTypes.any,
};
/* --------------------------------- */
/* RELATED PRODUCT SECTION */
/* --------------------------------- */
const RelatedProduct = ({ classes }) => {
  useEffect(() => {
    const glider = new Glider(document.querySelector('.glider-related-product'), {
      slidesToShow: 6,
      arrows: {
        prev: '.glider-prev-related-product',
        next: '.glider-next-related-product',
      },
    });
  }, []);
  return (
    <div className={classes.relatedProduct}>
      <div className="inline-block" style={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="h4">Sản phẩm liên quan</Typography>
      </div>
      <Grid className={`glider-related-product ${classes.rootProductContainer}`} container>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
        <Grid item md={2}>
          <ProductCard />
        </Grid>
      </Grid>

      <Icon className={`glider-prev-related-product ${classes.arrowLeft}`}>arrow_back_ios</Icon>

      <Icon className={`glider-next-related-product ${classes.arrowRight}`}>arrow_forward_ios</Icon>
    </div>
  );
};
/* --------------------------------- */
/* PRODUCT DETAIL PAGE */
/* --------------------------------- */
const descriptionData = [
  ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc',
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc',
];
// const productImageData = {
//   XanhS: [
//     'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg',
//     'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg',
//   ],
//   XanhM: ['http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_cobalththr_model_front_072014.jpg'],
//   ĐỏS: [
//     'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_scarleththr_model_front_072014.jpg',
//     'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_scarleththr_model_front_072014.jpg',
//     'http://cdn.sanmar.com/catalog/images/imglib/mresjpg/2014/f9/LST660_scarleththr_model_front_072014.jpg',
//   ],
// };
// Data for Buy box. This data will get from SelectOptionModal
// const optionList = [
//   {
//     key: '0',
//     name: 'Màu sắc',
//     listItems: ['Xanh', 'Đỏ', 'Tím', 'Vàng'],
//   },
//   {
//     key: '1',
//     name: 'Kích cỡ',
//     listItems: ['S', 'M', 'L', 'XL'],
//   },
// ];
const ProductDetailPage = ({ classes, theme, optionList, productImageData, textData, preview }) => {
  const [quantity, setQuantity] = useState(1);

  const defaultSelectOption = optionList.map(option => option.listItems[0]);
  // selectedOption is an array containing: [selectedOption in option1, selectedOption in option2, ...]
  const [selectedOption, setSelectedOption] = useState(defaultSelectOption);
  const handleSelectOption = optionKey => option => {
    // optionKey is a cue to know which set of options is (Color, Size, ...)
    // option is value receiving from OptionItem component
    const newArr = [...selectedOption];
    newArr[optionKey] = option;
    setSelectedOption(newArr);
  };

  const [productImages, setProductImages] = useState(productImageData[selectedOption.join('')]); // pattern: option1option2, ex: XanhS
  const handleSetProductImage = () => {
    const cloneArr = [...selectedOption]; // [Xanh, S]
    const key = cloneArr.join(''); // => XanhS
    setProductImages(productImageData[key]);
  };

  const [tabValue, setTabChange] = useState(0);
  const descriptionArr = [
    <ProductDescription
      heroImg="https://images.unsplash.com/photo-1553670092-786cf228510b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
      title="Lorem ipsum dolor sit amet 1"
      descriptions={descriptionData}
    />,
    <ProductDescription
      heroImg="https://images.unsplash.com/photo-1554167838-07aa5723df3a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
      title="Lorem ipsum dolor sit amet 2"
      descriptions={descriptionData}
      imgLeftContentRight
    />,
    <ProductDescription
      heroImg="https://images.unsplash.com/photo-1554220273-0c1b6c89951d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1055&q=80"
      title="Lorem ipsum dolor sit amet 3"
      descriptions={descriptionData}
    />,
  ];
  // Using component composition technique to avoid passing props through many level
  const optionItem = (
    <React.Fragment>
      {optionList.map((option, index) => (
        <OptionItems
          selectedOption={selectedOption}
          key={option.name}
          option={option}
          handleSelectOption={handleSelectOption(index)}
          handleSetProductImage={handleSetProductImage}
        />
      ))}
    </React.Fragment>
  );

  return (
    <Paper square elevation={0}>
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={2} sm={6} lg={2}>
          <ProductImage isPreviewed={preview} productImages={productImages} />
        </Grid>
        <Grid item xs={6} sm={6} lg={6}>
          <ProductInfo textData={textData} />
        </Grid>
        <Grid item xs={4} sm={4} lg={4}>
          <Grid container className="maintain-height">
            <Grid item lg={1} />
            <Grid item lg={11}>
              <BuyBox
                optionList={optionItem}
                quantity={quantity}
                setQuantity={setQuantity}
                classes={classes}
                textData={textData}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {!preview && (
        <React.Fragment>
          <Tabs
            className={classes.tabs}
            value={tabValue}
            onChange={(event, value) => setTabChange(value)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {descriptionArr.map((element, index) => (
              <Tab key={index} label={`Description ${index + 1}`} />
            ))}
          </Tabs>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={tabValue}
            onChangeIndex={index => setTabChange(index)}
          >
            {descriptionArr.map((element, index) => (
              <TabContainer key={index} dir={theme.direction}>
                {element}
              </TabContainer>
            ))}
          </SwipeableViews>

          <RelatedProduct classes={classes} />

          <CustomerReviews />
        </React.Fragment>
      )}
    </Paper>
  );
};

ProductDetailPage.propsTypes = {
  preview: PropTypes.bool,
};
ProductDetailPage.defaultProps = {
  preview: false,
};

export default withStyles(styles, { withTheme: true })(ProductDetailPage);
