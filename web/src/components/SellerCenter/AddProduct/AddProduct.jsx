import React, { useState } from 'react';
import { Paper, Typography, withStyles, Stepper, Step, StepLabel, Button } from '@material-ui/core';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import CascadingMenuCategory from './CascadingMenuCategory';
import BasicInfo from './BasicInfo/BasicInfo';
import ProductProperties from './ProductProperties/ProductProperties';
import AttachmentSection from './Attachment/AttachmentSection';
import AddProductImage from './AddProductImages/AddProductImage';
import ProductDataContext from '../../../utils/context/ProductDataContext';

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
  return ['Danh mục', 'Thông tin cơ bản', 'Lựa chọn sản phẩm đăng bán', 'Hình ảnh', 'Tài liệu đính kèm'];
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
      return 'Unknown step';
  }
}

const AddProduct = ({ classes }) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const steps = getSteps();
  const onSubmit = values => {
    window.alert(JSON.stringify(values, 0, 2));
  };
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
        {activeStep === steps.length ? (
          <Paper square elevation={0} className={classes.finishedContainer}>
            <Typography>
              Các bước thêm sản phẩm đã hoàn tất, chúng tôi sẽ kiểm duyệt yêu cầu của bạn trong vòng 24h.
            </Typography>
            <div>
              <Button onClick={handleBack} className={classes.button}>
                Quay lại
              </Button>
              <Button variant="contained" color="secondary" className={classes.button}>
                Tạo mới
              </Button>
            </div>
          </Paper>
        ) : (
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
                  mutators: { setValue, push, pop, remove },
                },
                values,
              }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <ProductDataContext.Provider value={{ data: values }}>
                    {activeStep === 2 ? (
                      <ProductProperties setValue={setValue} push={push} pop={pop} remove={remove} />
                    ) : (
                      <React.Fragment>
                        {activeStep === 3 ? <AddProductImage setValue={setValue} /> : getStepContent(activeStep)}
                      </React.Fragment>
                    )}
                    {/*<ProductProperties setValue={setValue} push={push} pop={pop} remove={remove} />*/}
                  </ProductDataContext.Provider>
                  <div className={classes.actionsContainer}>
                    <div className={classes.grow} />
                    <div>
                      <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                        Quay lại
                      </Button>
                      <Button variant="contained" color="secondary" onClick={handleNext} className={classes.button}>
                        {activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp'}
                      </Button>
                    </div>
                  </div>
                  <pre>{JSON.stringify(values, 0, 2)}</pre>
                </form>
              )}
            />
          </Paper>
        )}
      </div>
    </Paper>
  );
};

export default withStyles(styles)(AddProduct);
