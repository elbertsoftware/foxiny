/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { Typography, Button, Icon, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Field, Form } from 'react-final-form';
import { compose, graphql } from 'react-apollo';
import { toast } from 'react-toastify';
import createDecorator from 'final-form-focus';
import RFTextField from '../../../../../components/TextField/RFTextField';
import Paper from '../../../../../components/Paper/Paper';
import FormButton from '../../../../../components/Button/FormButton/FormButton';
import { required, confirm } from '../../../../../utils/processData/validation/validation';
import RESET_PASSWORD from '../../../../../utils/graphql/resetPassword';

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

const validate = values => {
  const errors = required(['answer0', 'answer1', 'answer2', 'password', 'confirmPassword'], values);
  if (!errors.confirmPassword) {
    const confirmError = confirm(values.password, values.confirmPassword);
    if (confirmError) {
      errors.confirmPassword = confirmError;
    }
  }
  return errors;
};

const onSubmit = (securityQuestions, resetPassword) => async values => {
  const questionAnsPair = securityQuestions.map((ele, index) => {
    return { questionId: ele.id, answer: values[`answer${index}`] };
  });
  try {
    const result = await resetPassword({
      variables: {
        data: {
          securityInfo: questionAnsPair,
          password: values.password,
        },
      },
    });
    if (result.data.resetPassword) {
      window.location = '/signin';
    } else {
      toast.error('Có lỗi xảy ra.');
    }
  } catch (error) {
    toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra.');
  }
};

const UserAnswerQuestions = ({ classes, handleBackView, securityQuestions, resetPassword }) => {
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
          onSubmit={onSubmit(securityQuestions, resetPassword)}
          subscription={{ submitting: true }}
          decorators={[focusOnError]}
          validate={validate}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container justify="center" alignItems="center" spacing={16}>
                <Grid item lg={6}>
                  <Typography variant="h4">Trả lời câu hỏi bảo mật</Typography>
                  <Typography variant="subtitle2">
                    Hoàn tất ba câu trả lời để xác thực bạn chính là chủ sỡ hữu của tài khoản
                  </Typography>
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
                      <Typography variant="h4">Đặt lại mật khẩu</Typography>
                    </div>
                    <Field component={RFTextField} label="Mật khẩu mới" name="password" type="password" />
                    <Field
                      component={RFTextField}
                      label="Nhập lại mật khẩu mới"
                      name="confirmPassword"
                      type="password"
                    />
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

export default compose(
  graphql(RESET_PASSWORD, { name: 'resetPassword' }),
  withStyles(styles),
)(UserAnswerQuestions);
