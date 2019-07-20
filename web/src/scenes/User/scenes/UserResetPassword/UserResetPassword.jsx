import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Field, Form } from 'react-final-form';
import { graphql, compose } from 'react-apollo';
import createDecorator from 'final-form-focus';
import SwipeableViews from 'react-swipeable-views';
import { Button, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import RFTextField from '../../../../components/TextField/RFTextField';
import FormButton from '../../../../components/Button/FormButton/FormButton';
import { required } from '../../../../utils/processData/validation/validation';
import AppForm from '../../../../components/AppForm/AppForm';
import requestResetPass from '../../../../utils/graphql/requestResetPass';
import UserAnswerQuestions from './components/UserAnswerQuestions';
import { setAuthorizationToken } from '../../../../utils/processData/localStorage';

const focusOnError = createDecorator();

const styles = theme => ({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: '24px',
    right: '30px',
  },
  typo: {
    marginTop: '-20px',
    marginBottom: '20px',
  },
});

class UserResetPassword extends Component {
  state = {
    viewIndex: 0,
    securityQuestions: [],
  };

  onSubmit = async values => {
    try {
      const {
        data: {
          requestResetPwd: { securityQuestions, token },
        },
      } = await this.props.requestResetPass({
        variables: {
          mailOrPhone: values.emailOrPhone,
        },
      });
      if (securityQuestions.length !== 0) {
        this.setState({ securityQuestions });
        setAuthorizationToken(token);
        this.handleNextView();
      }
    } catch (error) {
      toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra !');
    }
  };

  handleNextView = () => {
    this.setState({ viewIndex: 1 });
  };

  handleBackView = () => {
    this.setState({ viewIndex: 0 });
  };

  render() {
    const { classes, history, theme } = this.props;
    const { viewIndex, securityQuestions } = this.state;
    return (
      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={viewIndex}>
        {viewIndex === 0 ? (
          <AppForm>
            <Typography variant="h4">Lấy lại mật khẩu</Typography>
            <Typography variant="h6">Vui lòng nhập email/phone của bạn</Typography>
            <Form
              onSubmit={this.onSubmit}
              subscription={{ submitting: true }}
              decorators={[focusOnError]}
              validate={values => required(['emailOrPhone'], values)}
            >
              {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} noValidate>
                  <Field
                    component={RFTextField}
                    margin="normal"
                    label="Email/Phone"
                    name="emailOrPhone"
                    type="text"
                    fullWidth
                  />
                  <div className={classes.buttonContainer}>
                    <Button onClick={() => history.goBack()}>Trở về</Button>
                    <FormButton color="secondary" disabled={submitting}>
                      Tiếp
                    </FormButton>
                  </div>
                </form>
              )}
            </Form>
          </AppForm>
        ) : (
          <Typography>Trick</Typography>
        )}
        {viewIndex === 1 ? (
          <UserAnswerQuestions
            handleBackView={this.handleBackView}
            securityQuestions={securityQuestions}
            history={history}
          />
        ) : (
          <Typography>Trick</Typography>
        )}
      </SwipeableViews>
    );
  }
}

export default compose(
  graphql(requestResetPass, { name: 'requestResetPass' }),
  withStyles(styles, { withTheme: true }),
)(UserResetPassword);
