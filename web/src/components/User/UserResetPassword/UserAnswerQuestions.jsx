/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Typography, Button, Icon, Grid, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Field, Form } from 'react-final-form';
import createDecorator from 'final-form-focus';
import Paper from '../../../utils/common/Paper';
import RFTextField from '../../../utils/common/form/RFTextField';
import FormButton from '../../../utils/common/form/FormButton';
import { required } from '../../../utils/common/form/validation';

const focusOnError = createDecorator();

const styles = theme => ({
  rootPaper: {
    border: '1px solid #c6c6c9',
    marginTop: '2%',
    padding: 60,
  },
  headerAnsQues: {
    margin: 'auto',
    maxWidth: '935px',
    marginTop: '50px',
    display: 'flex',
    alignItems: 'baseline',
  },
  formControl: {
    margin: '24px 0px',
    minWidth: 400,
  },
  formButton: {
    float: 'right',
    marginTop: 30,
  },
  resetPassContainer: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  verticalDivider: {
    borderRight: '1px solid grey',
    height: '200px',
    paddingLeft: '20px',
  },
  divider: {
    alignSelf: 'stretch',
    marginTop: '3px',
  },
  dividerContainer: {
    width: '100%',
    marginLeft: -20,
  },
});

const onSubmit = async values => {
  console.log(values);
};

const UserAnswerQuestions = ({ classes, handleBackView, securityQuestions }) => {
  return (
    <React.Fragment>
      <div className={classes.headerAnsQues}>
        <Button onClick={handleBackView}>
          <Icon>arrow_back</Icon>
        </Button>
        <Typography variant="h3">Lấy lại mật khẩu</Typography>
      </div>

      <Paper className={classes.rootPaper} background="light">
        <Form
          onSubmit={onSubmit}
          subscription={{ submitting: true }}
          decorators={[focusOnError]}
          validate={values => required(['answer0', 'answer1', 'answer2'], values)}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container justify="center" alignItems="center" spacing={16}>
                <Grid item lg={6}>
                  {securityQuestions.map((element, index) => (
                    <div key={element.id} className={classes.formControl}>
                      <Typography variant="h5">
                        Câu hỏi {index + 1}: {element.question}
                      </Typography>
                      <Field
                        component={RFTextField}
                        label="Câu trả lời của bạn"
                        name={`answer${index}`}
                        type="text"
                        fullWidth
                      />
                    </div>
                  ))}
                </Grid>
                <Grid item lg={1}>
                  <div className={classes.verticalDivider} />
                </Grid>
                <Grid item lg={5}>
                  <div className={classes.resetPassContainer}>
                    <div className={classes.dividerContainer}>
                      <Typography variant="h5">Đặt lại mật khẩu</Typography>
                      <Divider className={classes.divider} variant="fullWidth" />
                    </div>
                    <Field component={RFTextField} label="Mật khẩu hiện tại" name="password" type="text" />
                    <Field component={RFTextField} label="Mật khẩu mới" name="newPassword" type="text" />
                    <Field component={RFTextField} label="Nhập lại mật khẩu mới" name="confirmPassword" type="text" />
                    <FormButton className={classes.formButton} color="secondary" disabled={submitting} fullWidth>
                      TIẾP TỤC
                    </FormButton>
                  </div>
                </Grid>
              </Grid>
            </form>
          )}
        </Form>
      </Paper>
    </React.Fragment>
  );
};

export default withStyles(styles)(UserAnswerQuestions);
