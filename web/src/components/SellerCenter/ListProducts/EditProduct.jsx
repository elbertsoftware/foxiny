/* eslint-disable implicit-arrow-linebreak */
import React, { useState } from 'react';
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
import ProductProperties from '../AddProduct/ProductProperties/ProductProperties';
import AttachmentSection from '../AddProduct/Attachment/AttachmentSection';
import AddProductImage from '../AddProduct/AddProductImages/AddProductImage';
import ProductDataContext from '../../../utils/context/ProductDataContext';
import FormButton from '../../../utils/common/form/FormButton';

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
const EditProduct = ({ classes, open, handleClose, dataEdit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const steps = getSteps();
  const formatDataEdit = data => {
    const newData = {};
    // For options list
    const groupedOption = data.map(x =>
      x.attributes.reduce((acc, curr) => {
        acc[curr.name] = acc[curr.name] || [];
        acc[curr.name].push(curr.value);
        return acc;
      }, {}),
    );
    const regroupedOption = Object.keys(groupedOption[0]).map(a => ({
      name: a,
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
    const newProducts = data.map(oldData => {
      const attributes = oldData.attributes.reduce((pre, cur, index) => {
        return {
          ...pre,
          [`option${index}`]: cur.value,
        };
      }, {});
      return Object.assign(attributes, {
        name: oldData.productName,
        listPrice: oldData.listPrice,
        sellPrice: oldData.sellPrice,
        stockQuantity: oldData.stockQuantity,
      });
    });
    newData.products = newProducts;
    // For images list
    const newImages = data.map(oldData => {
      return oldData.productMedias.map(media => Object.assign({}, { name: media.name, preview: media.uri }));
    });
    newData.images = newImages;
    // return final data
    return newData;
  };
  const onSubmit = async values => {};
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
              initialValues={formatDataEdit(dataEdit)}
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
                  <ProductDataContext.Provider value={{ data: values }}>
                    {activeStep === 0 && (
                      <ProductProperties setValue={setValue} push={push} pop={pop} remove={remove} />
                    )}
                    {activeStep === 1 && <AddProductImage setValue={setValue} />}
                    {activeStep === 2 && <AttachmentSection />}
                  </ProductDataContext.Provider>
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
export default withStyles(styles)(EditProduct);
