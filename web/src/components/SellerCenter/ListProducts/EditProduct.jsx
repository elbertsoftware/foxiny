/* eslint-disable implicit-arrow-linebreak */
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Step,
  Stepper,
  StepLabel,
  Button,
  Slide,
  Toolbar,
  Dialog,
  AppBar,
  withStyles,
} from '@material-ui/core';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { graphql, compose } from 'react-apollo';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import ProductProperties from '../AddProduct/ProductProperties/ProductProperties';
import AttachmentSection from '../AddProduct/Attachment/AttachmentSection';
import AddProductImage from '../AddProduct/AddProductImages/AddProductImage';
import ProductEditDataContext from '../../../utils/context/ProductEditDataContext';
import FormButton from '../../../utils/common/form/FormButton';

const UPLOAD_IMAGES = gql`
  mutation($files: [Upload!]!) {
    uploadProductMedias(files: $files) {
      id
    }
  }
`;
const EDIT_PRODUCT = gql`
  mutation updateProducts($sellerId: String!, $data: [UpdateProductInput!]!) {
    updateProducts(sellerId: $sellerId, data: $data) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      category {
        id
        name
      }
      descriptions {
        fromRetailers
      }
      productMedias {
        uri
      }
      listPrice
      sellPrice
      stockQuantity
      inStock
      approved
      attributes {
        attributeName
        value
      }
    }
  }
`;
function getSteps() {
  return ['Lựa chọn sản phẩm đăng bán', 'Hình ảnh', 'Tài liệu đính kèm'];
}
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
const styles = theme => ({
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  table: {
    marginTop: 16,
  },
  img: {
    width: 200,
    height: 200,
    objectFit: 'contain',
    marginRight: 8,
  },
  button: {
    width: '5rem',
    height: '2rem',
    borderRadius: '30px',
  },
  productCard: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: 16,
  },
  icon: {
    fontSize: 15,
    marginRight: 4,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  paper: {
    padding: '30px 20px 20px',
  },
  actionsContainer: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 2,
  },
  buttonAction: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
const EditProduct = ({ classes, open, handleClose, dataEdit, uploadProductImgs, editProducts }) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const steps = getSteps();
  const [initData, setInitData] = useState({});
  useEffect(() => {
    const newData = {};
    if (dataEdit.length > 0) {
      // For options list
      const groupedOption = dataEdit.map(x =>
        x.attributes.reduce((acc, curr) => {
          acc[curr.attributeName] = acc[curr.attributeName] || [];
          acc[curr.attributeName].push(curr.value);
          return acc;
        }, {}),
      );
      const regroupedOption = Object.keys(groupedOption[0]).map(a => ({
        attributeName: a,
        listItems: [],
      }));
      groupedOption.forEach(a => {
        Object.keys(groupedOption[0]).forEach((k, i) => {
          regroupedOption[i].listItems = regroupedOption[i].listItems.concat(a[k]);
        });
      });

      regroupedOption.forEach(a => {
        a.listItems = a.listItems
          .filter(function(item, pos) {
            return a.listItems.indexOf(item) === pos;
          })
          .map(item => Object.assign({}, { optionValue: item }));
      });
      newData.options = regroupedOption;
      // For products list
      const newProducts = dataEdit.map(oldData => {
        const attributes = oldData.attributes.reduce((pre, cur, index) => {
          return {
            ...pre,
            [`option${index}`]: cur.value,
          };
        }, {});
        return Object.assign(attributes, {
          productTemplateId: oldData.productTemplateId,
          productId: oldData.productId,
          productName: oldData.productName,
          listPrice: oldData.listPrice * 1000,
          sellPrice: oldData.sellPrice * 1000,
          stockQuantity: oldData.stockQuantity,
        });
      });
      newData.products = newProducts;
      // For images list
      const newImages = dataEdit.map(oldData => {
        return oldData.productMedias.map(media =>
          Object.assign({}, { id: media.id, name: media.name, preview: media.uri }),
        );
      });
      newData.images = newImages;
    }
    setInitData(newData);
  }, [dataEdit]);

  const onSubmit = async values => {
    const { products, options, images } = values;
    // Upload images for each product
    const productImagesIDAllProduct = [];
    for (let index = 0; index < images.length; index++) {
      try {
        // Nếu hình nào còn giữ nguyên, gửi id của hình đó về lại server
        // Nếu hình đã được thay đổi, thực hiện uploadProductImgs, sau đó server trả về id cho hinh mới vừa up
        // Kết hợp id của hình cũ, và hinh mới vừa upload => gửi về cho server để thực hiện update.
        const imageIdEachProduct = []; // Danh sách lưu id hình cũ của 1 sản phẩm trong danh sách sản phẩm
        const imageUpdate = []; // Danh sách File ảnh mới cần được upload
        let finalId = []; // Danh sách id ảnh cuôi cung (Gồm id ảnh cũ và id ảnh mới)
        images[index].forEach(img => {
          if (img.id) {
            imageIdEachProduct.push(img.id);
          } else {
            imageUpdate.push(img);
          }
        });
        if (imageUpdate.length > 0) {
          // Nếu có ảnh cần upload, hàm upload trả về data, lấy id ảnh của data, sau đó merge với imageIdEachProduct (list id ảnh cũ) => finalId.
          const media = await uploadProductImgs({
            variables: {
              files: imageUpdate,
            },
          });
          const idAfterUpload = media.data.uploadProductMedias.map(img => img.id);
          finalId = imageIdEachProduct.concat(idAfterUpload);
        } else {
          // Ngược lại không có ảnh nào mới cần upload, finalId = list id ảnh cũ
          finalId = imageIdEachProduct;
        }
        // Thêm danh sách id ảnh của current product vào Danh sách cuôi cùng. Danh sách này bao gồm nhiều danh sách id ảnh của nhiều product khác nhau. Bởi vì mỗi product có nhiều images.
        productImagesIDAllProduct.push(finalId);
        // Just need the id of image been uploaded
      } catch (error) {
        toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !');
      }
    }
    // console.log(productImagesIDAllProduct);
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
          productTemplateId: product.productTemplateId,
          productId: product.productId,
          productName: product.productName,
          listPrice: +product.listPrice / 1000, // + dùng để ép kiểu nhanh về integer
          sellPrice: +product.sellPrice / 1000,
          stockQuantity: +product.stockQuantity,
          productMediaIds: productImagesIDAllProduct[index],
          attributes: attributeArrOfAllProduct[index],
        },
      ),
    );
    console.log(newProducts);
    try {
      await editProducts({
        variables: {
          sellerId: 'cjurxpx4o00az07063f7imdn3',
          data: newProducts,
        },
      });
      toast.success('Cập nhật thành công thông tin các sản phẩm.');
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !');
    }
  };
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Chỉnh sửa sản phẩm
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            Đóng
          </Button>
        </Toolbar>
      </AppBar>
      <Paper className={classes.paper}>
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
              initialValues={initData}
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
                  mutators: { setValue, push, pop, remove },
                },
                values,
              }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <ProductEditDataContext.Provider value={{ data: values }}>
                    {activeStep === 0 && (
                      <ProductProperties
                        edit={Boolean(true)}
                        setValue={setValue}
                        push={push}
                        pop={pop}
                        remove={remove}
                      />
                    )}
                    {activeStep === 1 && <AddProductImage edit={Boolean(true)} setValue={setValue} />}
                    {activeStep === 2 && <AttachmentSection edit={Boolean(true)} />}
                  </ProductEditDataContext.Provider>
                  <div className={classes.actionsContainer}>
                    <div className={classes.grow} />
                    <div>
                      <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                        Quay lại
                      </Button>
                      {activeStep === steps.length ? (
                        <FormButton className={classes.buttonAction} disabled={submitting} color="secondary" fullWidth>
                          {submitting ? 'Thực hiện...' : 'Chỉnh sửa'}
                        </FormButton>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleNext}
                          className={classes.buttonAction}
                        >
                          {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp'}
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
    </Dialog>
  );
};
export default compose(
  graphql(EDIT_PRODUCT, { name: 'editProducts' }),
  graphql(UPLOAD_IMAGES, { name: 'uploadProductImgs' }),
  withStyles(styles),
)(EditProduct);
