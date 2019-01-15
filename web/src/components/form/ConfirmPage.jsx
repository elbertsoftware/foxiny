import React from 'react';
import { Form, Field } from 'react-final-form';
import { Typography, Button, Divider } from '@material-ui/core';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import RFTextField from '../../utils/common/form/RFTextField';
import FormButton from '../../utils/common/form/FormButton';
import AppForm from '../../utils/common/form/AppForm';
import { required, messages } from '../../utils/common/form/validation';

const CONFIRM_USER = gql`
  mutation confirmUser($data: ConfirmUserInput!) {
    confirmUser(data: $data) {
      enabled
    }
  }
`;

class ConfirmPage extends React.Component {
  state = {
    loading: false,
    success: false,
  };

  onSubmit = ({ confirmUser }) => async values => {
    confirmUser({
      variables: {
        data: {
          userId: this.props.match.params.id,
          code: values.confirmCode,
        },
      },
    });
  };

  render() {
    const { history } = this.props;
    return (
      <AppForm>
        <Mutation mutation={CONFIRM_USER} onCompleted={() => history.push('/')}>
          {(confirmUser, { data, loading, error }) => (
            <React.Fragment>
              <Typography variant="h4">Xác thực tài khoản</Typography>
              <Typography variant="h5">
                Vui lòng nhập mã xác thực được gửi đến email hoặc số điện thoại của bạn
              </Typography>
              <Form
                onSubmit={this.onSubmit({ confirmUser })}
                subscription={{ submitting: true }}
                validate={values => {
                  let errors = {};
                  errors = required(['confirmCode'], values, messages);
                  return errors;
                }}
              >
                {({ handleSubmit, submitting }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <Field
                      autoFocus
                      component={RFTextField}
                      margin="normal"
                      label="Mã xác thực"
                      name="confirmCode"
                      type="text"
                      fullWidth
                    />
                    <Divider />
                    <FormButton variant="outlined" color="primary">
                      {submitting ? 'Thực hiện...' : 'Xác thực'}
                    </FormButton>
                    <Button color="primary">Quay về</Button>
                  </form>
                )}
              </Form>
            </React.Fragment>
          )}
        </Mutation>
      </AppForm>
    );
  }
}
export default ConfirmPage;
