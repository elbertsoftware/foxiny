import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Icon, Fade } from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import RFTextField from '../../../utils/common/form/RFTextField';

const useStyles = makeStyles({
  finalForm: {
    padding: 32,
  },
  field: {
    width: '90%',
    marginBottom: 16,
  },
  icon: {},
});

const SellerEditForm = ({ isEdited }) => {
  const classes = useStyles();
  const onSubmit = async values => {};
  return (
    <Form onSubmit={onSubmit} subscription={{ submitting: true }}>
      {({ handleSubmit, submitting }) => (
        <Fade in={isEdited}>
          <form className={classes.finalForm} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Icon className={classes.icon}>account_circle</Icon>
              </Grid>
              <Grid className={classes.field} item>
                <Field
                  fullWidth
                  size="small"
                  component={RFTextField}
                  disabled={submitting}
                  name="businessName"
                  label="Tên cửa hàng"
                  type="text"
                  variant="filled"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Icon className={classes.icon}>phone</Icon>
              </Grid>
              <Grid className={classes.field} item>
                <Field
                  fullWidth
                  size="large"
                  component={RFTextField}
                  disabled={submitting}
                  name="businessPhone"
                  label="Số điện thoại cửa hàng"
                  type="text"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Icon className={classes.icon}>email</Icon>
              </Grid>
              <Grid className={classes.field} item>
                <Field
                  fullWidth
                  size="large"
                  component={RFTextField}
                  disabled={submitting}
                  name="businessEmail"
                  label="Địa chỉ Email cửa hàng"
                  type="email"
                  variant="filled"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Icon className={classes.icon}>location_on</Icon>
              </Grid>
              <Grid className={classes.field} item>
                <Field
                  fullWidth
                  size="large"
                  component={RFTextField}
                  disabled={submitting}
                  name="businessAddress"
                  label="Địa chỉ"
                  type="text"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </form>
        </Fade>
      )}
    </Form>
  );
};

export default SellerEditForm;
