import React, { useState, useEffect } from 'react';
import { Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Form } from 'react-final-form';
import { compose, graphql, Query } from 'react-apollo';
import { toast } from 'react-toastify';
import SellerBusinessInfo from '../../../../SellerDeclaration/components/SellerBusinessInfo/SellerBusinessInfo';
import SetValueFunction from '../../../../../../../utils/context/SetValueFunc';
import {
  LAST_APPROVAL_PROCESS,
  CREATE_RETAILER_APPROVAL_PROCESS,
  APPROVE_RETAILER_INFO,
  DISAPPROVE_RETAILER_INFO,
} from '../../../../../../../utils/graphql/approvement';
import Loading from '../../../../../../../components/Loading/Loading';

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

let oldData;

const messages = {
  checkSocialIDMedia0: 'Ảnh CMND đầu tiên',
  checkSocialIDMedia1: 'Ảnh CMND thứ hai',
};

const ApproveSeller = ({ history, match, location, ...props }) => {
  const classes = useStyles();
  // From graphql
  const { createRetailerApprovalProcess, approveRetailerInfo, disapproveRetailerInfo } = props;

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
        const result = await createRetailerApprovalProcess({
          variables: {
            data: {
              retailerId: match.params.id,
              data,
            },
          },
        });
        toast.success('Lưu tiến trình xét duyệt thành công.');
        window.location.reload();
      } catch (error) {
        toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
      }
    }
    // In case of disapproved
    if (isSubmited === 2) {
      try {
        // Generate messages to inform
        const reasonMessage = arrayKeyOfValues.reduce((previous, current, index) => {
          console.log(previous);
          if (values.reviewValues[current] != null) {
            return previous + `${messages[current]}: ${values.reviewValues[current]}<br />`;
          }
          return previous;
        }, '');
        console.log(reasonMessage);
        const resultAfterDisapproval = await disapproveRetailerInfo({
          variables: {
            data: {
              retailerId: match.params.id,
              data,
              note: reasonMessage,
            },
          },
        });
        if (resultAfterDisapproval.data.disapproveRetailer) {
          setTimeout(() => {
            window.location.reload();
            history.push(`/sellers/support/case-detail/${match.params.id}`);
          }, 10);
        }
      } catch (error) {
        toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra!');
      }
    }
    // In case of surely approving the seller info
    if (isSubmited === 3) {
      // Kiểm tra đã đủ số field cần duyệt chưa. Ở đây xét duyệt 2 tấm ảnh (2 field) và giá trị của các field === null (Quy ước = null nghĩa là đã verified)
      if (arrayKeyOfValues.length === 2 && checkAllValuesIsNull(values.reviewValues)) {
        // Approve cho seller
        const resultAfterApproval = await approveRetailerInfo({
          variables: {
            data: {
              retailerId: match.params.id,
              data,
            },
          },
        });
        if (resultAfterApproval.data.approveRetailer) {
          toast.success('Duyệt thành công tài khoản bán hàng.');
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

  useEffect(() => {
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
            <Button onClick={() => setIsSubmited(2)} color="primary">
              Từ chối
            </Button>
            <Button onClick={() => setIsSubmited(3)} variant="contained" color="secondary">
              Duyệt
            </Button>
          </div>
        </Paper>
      </div>
      <Query
        query={LAST_APPROVAL_PROCESS}
        variables={{
          query: {
            retailerId: match.params.id,
          },
        }}
      >
        {({ data, loading }) => {
          if (loading) return <Loading />;
          const processData =
            data.lastRetailerApprovalProcess.length > 0 && data.lastRetailerApprovalProcess[0].data.reviewValues;
          oldData = processData;
          return (
            <Form
              onSubmit={onSubmit}
              initialValues={{ reviewValues: processData }}
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
                    <pre>{JSON.stringify(values, 0, 2)}</pre>
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
  graphql(DISAPPROVE_RETAILER_INFO, { name: 'disapproveRetailerInfo' }),
)(ApproveSeller);
