import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose, Query } from 'react-apollo';
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  makeStyles,
  Button,
  Box,
  Typography,
} from '@material-ui/core';
import arrayMutators from 'final-form-arrays';
import { Form } from 'react-final-form';
import { toast } from 'react-toastify';
import Loading from '../../../../../../../components/Loading/Loading';

import { GET_MANY_PRODUCTS } from '../../../../../../../utils/graphql/product';
import BasicInfo from '../../../../AddProduct/components/BasicInfo/BasicInfo';
import ProductProperties from '../../../../AddProduct/components/ProductProperties/ProductProperties';
import AddProductImage from '../../../../AddProduct/components/AddProductImages/AddProductImage';
import AttachmentSection from '../../../../AddProduct/components/Attachment/AttachmentSection';
import ProductEditDataContext from '../../../../../../../utils/context/ProductEditDataContext';
import SetValueFunction from '../../../../../../../utils/context/SetValueFunc';
import {
  CREATE_PRODUCT_APPROVAL_PROCESS,
  APPROVE_PRODUCT_INFO,
  DISAPPROVE_PRODUCT_INFO,
  LAST_APPROVAL_PRODUCT_PROCESS,
} from '../../../../../../../utils/graphql/approvement';
import { checkAllValuesIsNull } from '../../../utils/processData';
import { getProductIds } from '../../../../../../../utils/processData/localStorage';

function getSteps() {
  return [
    'Thông tin cơ bản',
    'Lựa chọn sản phẩm đăng bán',
    'Hình ảnh',
    'Tài liệu đính kèm',
  ];
}

const styles = makeStyles(theme => ({
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
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '4rem',
  },
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '60%',
  },
  decoration: {
    padding: '4px 16px',
    border: '1px solid #6E6E6E',
    borderRadius: 30,
    minWidth: 267,
  },
  closeSave: {
    color: '#6E6E6E',
  },
}));

let oldData;

const messages = {
  checkProductName: 'Tên sản phẩm',
  checkBrandname: 'Tên nhà bán',
  checkDescription: 'Mô tả sản phẩm',
  checkDetailDescription: 'Thông tin chi tiết',
  checkOptions: 'Thuộc tính sản phẩm',
  checkDetailProducts: 'Bảng chi tiết từng sản phẩm',
  checkImageProducts: 'Hình ảnh sản phẩm',
  checkAttachedFile: 'Tài liệu đính kèm',
};

const ApproveProduct = ({
 history, match, location, ...props 
}) => {
  const {
    loading,
    productsData,
    createProductApprovalProcess,
    approveProductInfo,
    disapproveProductInfo,
  } = props;
  const classes = styles();
  // const [data, setData] = useState([]);
  const [isSubmited, setIsSubmited] = useState(0); // 0:default, 1: Close&Save 2:Approve

  // useEffect(() => {
  //   if (!loading) {
  //     const dataByProductTemplateId = productsData.filter(
  //       product => product.productTemplateId === match.params.id,
  //     );
  //     setData(dataByProductTemplateId);
  //   }
  // }, [loading, match.params.id, productsData]);

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
    if (productsData && productsData.length > 0) {
      // Product template info (using when approving products)
      newData.name = productsData[0].name;
      newData.brandName = productsData[0].brand;
      newData.briefDescription = productsData[0].briefDescription;

      // For options list
      const groupedOption = productsData.map(x => x.attributes.reduce((acc, curr) => {
          acc[curr.attributeName] = acc[curr.attributeName] || [];
          acc[curr.attributeName].push(curr.value);
          return acc;
        }, {}),);
      const regroupedOption = Object.keys(groupedOption[0]).map(a => ({
        attributeName: a,
        listItems: [],
      }));
      groupedOption.forEach(a => {
        Object.keys(groupedOption[0]).forEach((k, i) => {
          regroupedOption[i].listItems = regroupedOption[i].listItems.concat(
            a[k],
          );
        });
      });

      regroupedOption.forEach(a => {
        a.listItems = a.listItems
          .filter((item, pos) => a.listItems.indexOf(item) === pos)
          .map(item => Object.assign({}, { optionValue: item }));
      });
      newData.options = regroupedOption;
      // For products list
      const newProducts = productsData.map(oldData => {
        const attributes = oldData.attributes.reduce(
          (pre, cur, index) => ({
            ...pre,
            [`option${index}`]: cur.value,
          }),
          {},
        );
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
      const newImages = productsData.map(oldData => oldData.productMedias.map(media => Object.assign(
            {},
            { id: media.id, name: media.name, preview: media.uri },
          ),),);
      newData.images = newImages;
    }
    console.log(newData);
    setInitData(newData);
  }, [productsData, loading]);

  useEffect(() => {
    if (isSubmited !== 0) {
      document
        .getElementById('productApprovalForm')
        .dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }, [isSubmited]);

  const onSubmit = async values => {
    const data = {
      reviewValues: {
        ...oldData,
        ...values.reviewValues,
      },
    };
    const arrayKeyOfValues = Object.keys(values.reviewValues);
    // In case of Close and Save the approval process
    if (isSubmited === 1) {
      try {
        console.log(values.reviewValues, oldData);
        const result = await createProductApprovalProcess({
          variables: {
            data: {
              caseId: match.params.id,
              data,
            },
          },
        });
        toast.success('Lưu tiến trình xét duyệt thành công.');
        window.location.reload();
      } catch (error) {
        toast.error(
          error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!',
        );
      }
    }
    // In case of disapproved
    if (isSubmited === 2) {
      try {
        // Generate messages to inform
        const reasonMessage = arrayKeyOfValues.reduce(
          (previous, current, index) => {
            console.log(previous);
            if (values.reviewValues[current] != null) {
              return `${previous}${messages[current]}: ${
                values.reviewValues[current]
              }<br />`;
            }
            return previous;
          },
          '',
        );
        console.log(reasonMessage);
        const resultAfterDisapproval = await disapproveProductInfo({
          variables: {
            data: {
              caseId: match.params.id,
              data,
              note: reasonMessage,
            },
          },
        });
        if (resultAfterDisapproval.data.disapproveProducts) {
          setTimeout(() => {
            history.push(`/sellers/support/case-detail/${match.params.id}`);
            window.location.reload();
          }, 10);
        }
      } catch (error) {
        toast.error(
          error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!',
        );
      }
    }
    // In case of surely approving the product info
    if (isSubmited === 3) {
      // Kiểm tra đã đủ số field cần duyệt chưa. Ở đây xét duyệt 8 fields
      // liên quan đến sản phẩm và giá trị của các field === null (Quy ước = null nghĩa là đã verified)
      if (
        arrayKeyOfValues.length === 8
        && checkAllValuesIsNull(values.reviewValues)
      ) {
        // Approve cho seller
        const resultAfterApproval = await approveProductInfo({
          variables: {
            data: {
              caseId: match.params.id,
              data,
            },
          },
        });
        if (resultAfterApproval.data.approveProducts) {
          toast.success('Duyệt thành công sản phẩm.');
          history.push(`/sellers/support/case-detail/${match.params.id}`);
          window.location.reload();
        }
      } else {
        toast.warn('Vui lòng duyệt đầy đủ thông tin.');
      }
    }
    // set submitted to default value: 0
    setIsSubmited(0);
  };

  if (loading) return <Loading />;

  return (
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
          <Query
            query={LAST_APPROVAL_PRODUCT_PROCESS}
            variables={{
              query: {
                caseId: match.params.id,
              },
            }}
          >
            {({ data, loading }) => {
              if (loading) return <Loading />;
              const processData =                data.lastProductApprovalProcess.length > 0
                && data.lastProductApprovalProcess[0].data.reviewValues;
              oldData = processData;
              return (
                <Form
                  onSubmit={onSubmit}
                  initialValues={{ ...initData, reviewValues: processData }}
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
                    <form
                      id="productApprovalForm"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <ProductEditDataContext.Provider value={{ data: values }}>
                        <SetValueFunction.Provider value={{ setValue, values }}>
                          {activeStep === 0 && <BasicInfo edit review />}
                          {activeStep === 1 && (
                            <ProductProperties
                              edit
                              review
                              setValue={setValue}
                              push={push}
                              pop={pop}
                              remove={remove}
                            />
                          )}
                          {activeStep === 2 && (
                            <AddProductImage edit review setValue={setValue} />
                          )}
                          {activeStep === 3 && (
                            <AttachmentSection edit review />
                          )}
                          {activeStep === 4 && (
                            <Paper square elevation={0}>
                              <Typography variant="h5">
                                Các bước kiểm duyệt sản phẩm đã hoàn tất. Kiểm
                                duyệt hoặc có thể lưu lại quá trình kiểm duyệt.
                              </Typography>
                            </Paper>
                          )}
                        </SetValueFunction.Provider>
                      </ProductEditDataContext.Provider>
                      <div className={classes.actionsContainer}>
                        <div className={classes.grow} />
                        <Box display="flex">
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Quay lại
                          </Button>
                          {activeStep === steps.length ? (
                            <div className={classes.actions}>
                              <Paper
                                elevation={0}
                                className={classes.actionContainer}
                              >
                                <div className={classes.decoration}>
                                  <Button
                                    className={classes.closeSave}
                                    onClick={() => setIsSubmited(1)}
                                    color="primary"
                                  >
                                    Đóng và Lưu
                                  </Button>
                                  <Button
                                    onClick={() => setIsSubmited(2)}
                                    color="primary"
                                  >
                                    Từ chối
                                  </Button>
                                  <Button
                                    onClick={() => setIsSubmited(3)}
                                    variant="contained"
                                    color="secondary"
                                  >
                                    Duyệt
                                  </Button>
                                </div>
                              </Paper>
                            </div>
                          ) : (
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleNext}
                              className={classes.buttonAction}
                            >
                              {activeStep === steps.length - 1
                                ? 'Hoàn thành'
                                : 'Tiếp'}
                            </Button>
                          )}
                        </Box>
                      </div>
                      {<pre>{JSON.stringify(values, 0, 2)}</pre>}
                    </form>
                  )}
                />
              );
            }}
          </Query>
        </Paper>
      </div>
    </Paper>
  );
};

ApproveProduct.propTypes = {};

export default compose(
  graphql(GET_MANY_PRODUCTS, {
    options: props => ({
      variables: { query: { productIds: getProductIds } },
    }),
    props: ({ data: { loading, getProducts } }) => ({
      loading,
      productsData: getProducts,
    }),
  }),
  graphql(CREATE_PRODUCT_APPROVAL_PROCESS, {
    name: 'createProductApprovalProcess',
  }),
  graphql(APPROVE_PRODUCT_INFO, { name: 'approveProductInfo' }),
  graphql(DISAPPROVE_PRODUCT_INFO, { name: 'disapproveProductInfo' }),
)(ApproveProduct);
