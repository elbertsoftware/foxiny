/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Typography, makeStyles, Link } from '@material-ui/core';

const messages = {
  checkSocialIDMedia0: 'Ảnh CMND đầu tiên',
  checkSocialIDMedia1: 'Ảnh CMND thứ hai',
};
const useStyles = makeStyles(({ spacing }) => ({
  bottomSpace: {
    marginBottom: spacing(2),
  },
}));
const GenerateInformMessages = ({ approved, processData, ...props }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.bottomSpace}>Xin chào,</Typography>
      <Typography className={classes.bottomSpace}>Cảm ơn bạn vì đã sử dụng dịch vụ của chúng tôi.</Typography>
      {!approved ? (
        <React.Fragment>
          <Typography className={classes.bottomSpace}>
            Chúng tôi thấy rằng bạn đã cập nhật thông tin cho tài khoản bán hàng, nhưng chúng tôi cần bạn xác thực trở
            lại một lần nữa vì những lý do sau:
          </Typography>

          {Object.keys(processData.reviewValues).map(key => {
            const message = processData.reviewValues[key];
            if (message == null) return null;
            return (
              <Typography variant="subtitle2" className={classes.bottomSpace}>
                <strong>{messages[key]}: </strong>
                {processData.reviewValues[key]}
              </Typography>
            );
          })}
        </React.Fragment>
      ) : (
        <Typography className={classes.bottomSpace}>
          Tài khoản bán hàng của bạn đã được xét duyệt. Bây giờ bạn có thể đăng bán sản phẩm và thực hiện mọi giao dịch
          cùng với Foxiny.
        </Typography>
      )}
      <Typography className={classes.bottomSpace}>
        Vui lòng kiểm tra lại những thông tin trên trong mục{' '}
        <Link href="/sellers/seller-declaration">Thông tin nhà bán</Link> và tiến hành cập nhật lại để chúng tôi có thể
        hoàn tất việc xét duyệt tài khoản bán hàng của bạn.
      </Typography>
      <Typography className={classes.bottomSpace}>Xin cảm ơn.</Typography>
    </>
  );
};

export default GenerateInformMessages;
