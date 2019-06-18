import React, { useState, useEffect } from 'react';
import { Typography, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Form } from 'react-final-form';
import { compose, graphql, Query } from 'react-apollo';
import { toast } from 'react-toastify';
import SellerBusinessInfo from '../../SellerDeclaration/SellerBusinessInfo';
import SetValueFunction from '../../../../utils/context/SetValueFunc';
import {
  LAST_APPROVAL_PROCESS,
  CREATE_RETAILER_APPROVAL_PROCESS,
  APPROVE_RETAILER_INFO,
} from '../../../../graphql/approvement';
import Loading from '../../../App/Loading';

const useStyles = makeStyles({
  root: {
    padding: '32px 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  closeSave: {
    color: '#6E6E6E',
  },
});

const ApproveSeller = ({ match, location, ...props }) => {
  const classes = useStyles();
  // From graphql
  const { createRetailerApprovalProcess, approveRetailerInfo } = props;

  const [isSubmited, setIsSubmited] = useState(0); // 0:default, 1: Close&Save 2:Approve

  const checkAllValuesIsNull = object => {
    let result = true;
    const arrayValues = Object.values(object);
    arrayValues.forEach(value => {
      if (value != null || value != undefined) {
        result = false;
      }
    });
    return result;
  };

  const onSubmit = async values => {
    // In case of Close and Save the approval process
    if (isSubmited === 1) {
      try {
        const result = await createRetailerApprovalProcess({
          variables: {
            data: {
              retailerId: match.params.id,
              processData: values,
            },
          },
        });
        toast.success('Lưu tiến trình xét duyệt thành công.');
        window.location.reload();
      } catch (error) {
        toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
      }
    }
    // In case of surely approving the seller info
    if (isSubmited === 2) {
      // Kiểm tra đã đủ số field cần duyệt chưa. Ở đây xét duyệt 2 tấm ảnh (2 field) và giá trị của các field === null (Quy ước = null nghĩa là đã verified)
      const arrayKeyOfValues = Object.keys(values.reviewValues);
      if (arrayKeyOfValues.length === 2 && checkAllValuesIsNull(values.reviewValues)) {
        // Lưu process
        await createRetailerApprovalProcess({
          variables: {
            data: {
              retailerId: match.params.id,
              processData: values,
            },
          },
        });
        // Approve cho seller
        const resultAfterApproval = await approveRetailerInfo({
          variables: {
            retailerId: match.params.id,
          },
        });
        if (resultAfterApproval.data.approveRetailer) {
          toast.success('Duyệt thành công tài khoản bán hàng.');
        }
      } else {
        toast.warn('Vui lòng duyệt đầy đủ thông tin.');
      }
    }
    // set submitted to default value: 0
    setIsSubmited(0);
  };

  useEffect(() => {
    console.log(match.params.id);
    if (isSubmited !== 0) {
      document.getElementById('approvalForm').dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }, [isSubmited]);

  return (
    <Paper className={classes.root} elevation={0} square>
      <div className={classes.actions}>
        <Paper elevation={0} className={classes.actionContainer}>
          <div className={classes.decoration}>
            <Button className={classes.closeSave} onClick={() => setIsSubmited(1)} color="primary">
              Đóng và Lưu
            </Button>
            <Button color="primary">Từ chối</Button>
            <Button onClick={() => setIsSubmited(2)} variant="contained" color="secondary">
              Duyệt
            </Button>
          </div>
        </Paper>
      </div>
      <Query query={LAST_APPROVAL_PROCESS} variables={{ query: match.params.id }}>
        {({ data, loading }) => {
          if (loading) return <Loading />;
          return (
            <Form
              onSubmit={onSubmit}
              initialValues={data.lastRetailerApprovalProcess && data.lastRetailerApprovalProcess.processData}
              subscription={{ submitting: true, values: true }}
              mutators={{
                setValue: ([field, value], state, { changeValue }) => {
                  changeValue(state, field, () => value);
                },
              }}
            >
              {({
                handleSubmit,
                submitting,
                values,
                form: {
                  mutators: { setValue },
                },
              }) => {
                return (
                  <form id="approvalForm" onSubmit={handleSubmit} noValidate>
                    <SetValueFunction.Provider value={{ setValue, values }}>
                      <div className={classes.container}>
                        <SellerBusinessInfo seller={location.state.seller} review />
                      </div>
                    </SetValueFunction.Provider>
                  </form>
                );
              }}
            </Form>
          );
        }}
      </Query>
    </Paper>
  );
};

export default compose(
  graphql(CREATE_RETAILER_APPROVAL_PROCESS, { name: 'createRetailerApprovalProcess' }),
  graphql(APPROVE_RETAILER_INFO, { name: 'approveRetailerInfo' }),
)(ApproveSeller);
