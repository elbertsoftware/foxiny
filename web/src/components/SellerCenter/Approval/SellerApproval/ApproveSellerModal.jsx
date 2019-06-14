import React, { useState, useEffect } from 'react';
import { Dialog, Slide, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Form } from 'react-final-form';
import { compose, graphql } from 'react-apollo';
import { toast } from 'react-toastify';
import { DialogTitle, DialogContent, DialogActions } from '../../../../utils/common/Dialog';
import SellerBusinessInfo from '../../SellerDeclaration/SellerBusinessInfo';
import SetValueFunction from '../../../../utils/context/SetValueFunc';
import {
  LAST_APPROVAL_PROCESS,
  CREATE_RETAILER_APPROVAL_PROCESS,
  APPROVE_RETAILER_INFO,
} from '../../../../graphql/approvement';
import Loading from '../../../App/Loading';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const ApproveSellerModal = ({ open, handleClose, seller, ...props }) => {
  const classes = useStyles();
  // From graphql
  const { loading, lastRetailerApprovalProcess, createRetailerApprovalProcess, approveRetailerInfo } = props;

  const [isSubmited, setIsSubmited] = useState(0); // 0:default, 1: Close&Save 2:Approve

  const checkAllValuesIsNull = object => {
    let result = true;
    const arrayValues = Object.values(object);
    arrayValues.forEach(value => {
      if (value != null || value != undefined) {
        result = false;
      }
    });
    console.log(arrayValues);
    console.log(result);
    return result;
  };

  const onSubmit = async values => {
    // In case of Close and Save the approval process
    if (isSubmited === 1) {
      try {
        const result = await createRetailerApprovalProcess({
          variables: {
            data: {
              retailerId: seller.id,
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
      console.log(arrayKeyOfValues.length, checkAllValuesIsNull(values.reviewValues));
      if (arrayKeyOfValues.length === 2 && checkAllValuesIsNull(values.reviewValues)) {
        // Lưu process
        await createRetailerApprovalProcess({
          variables: {
            data: {
              retailerId: seller.id,
              processData: values,
            },
          },
        });
        // Approve cho seller
        const resultAfterApproval = await approveRetailerInfo({
          variables: {
            retailerId: seller.id,
          },
        });
        console.log(resultAfterApproval);
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
    if (isSubmited !== 0) {
      document.getElementById('approvalForm').dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }, [isSubmited]);

  if (loading) return <Loading />;

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogTitle onClose={handleClose}>
        <Typography variant="h6" color="inherit">
          Duyệt thông tin của Nhà bán
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Form
          onSubmit={onSubmit}
          initialValues={lastRetailerApprovalProcess && lastRetailerApprovalProcess.processData}
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
                    <SellerBusinessInfo seller={seller} review />
                  </div>
                  <pre>{JSON.stringify(values, 0, 2)}</pre>
                </SetValueFunction.Provider>
              </form>
            );
          }}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsSubmited(1)} color="primary">
          Đóng và Lưu
        </Button>
        <Button variant="contained" color="inherit">
          Từ chối
        </Button>
        <Button onClick={() => setIsSubmited(2)} variant="contained" color="secondary">
          Duyệt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  graphql(LAST_APPROVAL_PROCESS, {
    options: props => ({ variables: { query: 'cjwvucj76003n0840cgcr2xt6' } }),
    props: ({ data: { loading, lastRetailerApprovalProcess } }) => ({
      loading,
      lastRetailerApprovalProcess,
    }),
  }),
  graphql(CREATE_RETAILER_APPROVAL_PROCESS, { name: 'createRetailerApprovalProcess' }),
  graphql(APPROVE_RETAILER_INFO, { name: 'approveRetailerInfo' }),
)(ApproveSellerModal);
