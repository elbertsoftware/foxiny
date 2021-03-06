/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  withStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
} from '@material-ui/core';
import { Form } from 'react-final-form';
import { graphql, compose } from 'react-apollo';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';
import arrayMutators from 'final-form-arrays';
import CascadingMenuCategory from './components/CascadingMenuCategory/CascadingMenuCategory';
import BasicInfo from './components/BasicInfo/BasicInfo';
import ProductProperties from './components/ProductProperties/ProductProperties';
import AttachmentSection from './components/Attachment/AttachmentSection';
import AddProductImage from './components/AddProductImages/AddProductImage';
import ProductDataContext from '../../../../utils/context/ProductDataContext';
import FormButton from '../../../../components/Button/FormButton/FormButton';
import {
  CREATE_NEW_PRODUCT,
  UPLOAD_IMAGES,
} from '../../../../utils/graphql/product';
import { getSellerId } from '../../../../utils/processData/localStorage';

const styles = theme => ({
  paper: {
    margin: 'auto',
    overflow: 'hidden',
    padding: '30px 20px 20px',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  grow: {
    flexGrow: 1,
  },
  finishedContainer: {
    position: 'relative',
    height: '100%',
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return [
    'Danh mục',
    'Thông tin cơ bản',
    'Lựa chọn sản phẩm đăng bán',
    'Hình ảnh',
    'Tài liệu đính kèm',
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <CascadingMenuCategory />;
    case 1:
      return <BasicInfo />;
    // case 3:
    //   return <AddProductImage />;
    case 4:
      return <AttachmentSection />;
    default:
      return (
        <Paper square elevation={0}>
          <Typography>
            Các bước thêm sản phẩm đã hoàn tất, nhấn Tạo mới để tạo sản phẩm,
            chúng tôi sẽ kiểm duyệt yêu cầu của bạn trong vòng 24h.
          </Typography>
        </Paper>
      );
  }
}

const AddProduct = ({
  classes,
  createNewProduct,
  uploadProductImgs,
  ...props
}) => {
  const { userLoggedIn } = props;
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const steps = getSteps();
  const onSubmit = async values => {
    const { products, options, images } = values;
    // Upload images for each product
    const productImagesIDAllProduct = [];
    for (let index = 0; index < images.length; index++) {
      try {
        const media = await uploadProductImgs({
          variables: {
            files: images[index],
          },
        });
        productImagesIDAllProduct.push(
          media.data.uploadProductMedias.map(img => img.id),
        ); // Just need the id of image been uploaded
      } catch (error) {
        toast.error(
          error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !',
        );
        return;
      }
    }
    // Format the shape of data to pass to mutation
    // Adding attributes array for each product
    const attributeArrOfAllProduct = [];
    for (let i = 0; i < products.length; i++) {
      const attributeArrEachPro = [];
      for (let y = 0; y < options.length; y++) {
        const attributeObject = {
          attributeName: options[y].attributeName,
          value: products[i][`option${y}`],
        };
        attributeArrEachPro.push(attributeObject);
      }
      attributeArrOfAllProduct.push(attributeArrEachPro);
    }
    const newProducts = products.map((product, index) =>
      Object.assign(
        {},
        {
          productName: product.productName,
          listPrice: +product.listPrice / 1000,
          sellPrice: +product.sellPrice / 1000,
          stockQuantity: +product.stockQuantity,
          productMediaIds: productImagesIDAllProduct[index],
          attributes: attributeArrOfAllProduct[index],
        },
      ),);
    console.log(newProducts);
    // Kiểm tra xem Sửa hay Thêm product, vì Sửa product tái sử dụng lại các component của Add product
    // Nếu Sửa, thì mỗi product trong list product sẽ có field productTemplateId, và productId được load lên và gán vào ở ListProducts component
    // Edit products

    // Create new product
    try {
      await createNewProduct({
        variables: {
          sellerId: getSellerId(),
          data: {
            name: values.name,
            briefDescription: values.briefDescription,
            catalogIds: values.catalogIds,
            products: newProducts,
            brandName: values.brandName,
            detailDescription: 'Hello from Tan Binh',
          },
        },
      });
      toast.success('Tạo sản phẩm thành công !');
    } catch (error) {
      toast.error(
        error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !',
      );
    }
  };
  if (!userLoggedIn()) return <Redirect to="/sellers/sign" />;
  return (
    <Paper className={classes.paper}>
      <Typography gutterBottom variant="h2">
        Tạo mới sản phẩm
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <Paper square elevation={0} className={classes.finishedContainer}>
          <Form
            onSubmit={onSubmit}
            mutators={{
              setValue: ([field, value], state, { changeValue }) => {
                changeValue(state, field, () => value);
              },
              ...arrayMutators,
            }}
            render={({
              handleSubmit,
              submitting,
              form: {
                mutators: {
 setValue, push, pop, remove 
},
              },
              values,
            }) => (
              <form onSubmit={handleSubmit} noValidate>
                <ProductDataContext.Provider value={{ data: values, setValue }}>
                  {activeStep === 2 ? (
                    <ProductProperties
                      setValue={setValue}
                      push={push}
                      pop={pop}
                      remove={remove}
                    />
                  ) : (
                    <React.Fragment>
                      {activeStep === 3 ? (
                        <AddProductImage setValue={setValue} />
                      ) : (
                        getStepContent(activeStep)
                      )}
                    </React.Fragment>
                  )}
                </ProductDataContext.Provider>
                <div className={classes.actionsContainer}>
                  <div className={classes.grow} />
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Quay lại
                    </Button>
                    {activeStep === steps.length ? (
                      <FormButton
                        className={classes.button}
                        disabled={submitting}
                        color="secondary"
                        fullWidth
                      >
                        {submitting ? 'Thực hiện...' : 'Tạo mới'}
                      </FormButton>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1
                          ? 'Hoàn thành'
                          : 'Tiếp'}
                      </Button>
                    )}
                  </div>
                </div>
                <pre>{JSON.stringify(values, 0, 2)}</pre>
              </form>
            )}
          />
        </Paper>
      </div>
    </Paper>
  );
};

export default compose(
  graphql(CREATE_NEW_PRODUCT, { name: 'createNewProduct' }),
  graphql(UPLOAD_IMAGES, { name: 'uploadProductImgs' }),
  withStyles(styles),
)(AddProduct);
