/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { Typography, makeStyles, Link } from "@material-ui/core";

const messages = {
  checkSocialIDMedia0: "Ảnh CMND đầu tiên",
  checkSocialIDMedia1: "Ảnh CMND thứ hai"
};
const useStyles = makeStyles(({ spacing }) => ({
  bottomSpace: {
    marginBottom: spacing(2)
  }
}));
const GenerateInformMessages = ({
  note,
  processData,
  categoryName,
  ...props
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography className={classes.bottomSpace}>Xin chào,</Typography>
      <Typography className={classes.bottomSpace}>
        Cảm ơn bạn vì đã sử dụng dịch vụ của chúng tôi.
      </Typography>
      {note ? (
        <React.Fragment>
          <Typography className={classes.bottomSpace}>
            {categoryName === "CREATE_PRODUCT_APPROVAL"
              ? "Chúng tôi thấy rằng bạn đã thêm thông tin sản phẩm đăng bán, nhưng chúng tôi cần bạn kiểm tra lại vì những lý do sau:"
              : `Chúng tôi thấy rằng bạn đã cập nhật thông tin cho tài khoản bán
            hàng, nhưng chúng tôi cần bạn xác thực trở lại một lần nữa vì những
            lý do sau`}
          </Typography>
          {note.split("<br />").map(ele => (
            <Typography variant="subtitle2" className={classes.bottomSpace}>
              <strong>{ele}</strong>
            </Typography>
          ))}
        </React.Fragment>
      ) : (
        <Typography className={classes.bottomSpace}>
          {categoryName === "CREATE_PRODUCT_APPROVAL"
            ? "Thông tin về sản phẩm đăng bán của bạn đã được xét duyệt thành công."
            : `Tài khoản bán hàng của bạn đã được xét duyệt. Bây giờ bạn có thể đăng
          bán sản phẩm và thực hiện mọi giao dịch cùng với Foxiny.`}
        </Typography>
      )}
      <Typography className={classes.bottomSpace}>
        Vui lòng kiểm tra lại những thông tin trên trong mục{" "}
        {categoryName === "CREATE_PRODUCT_APPROVAL" ? (
          <Link href="/sellers/list-products">Thông tin sản phẩm</Link>
        ) : (
          <Link href="/sellers/seller-declaration">Thông tin nhà bán</Link>
        )}{" "}
        và tiến hành cập nhật lại để chúng tôi có thể hoàn tất việc xét duyệt
        tài khoản bán hàng của bạn.
      </Typography>
      <Typography className={classes.bottomSpace}>Xin cảm ơn.</Typography>
    </React.Fragment>
  );
};

export { GenerateInformMessages, messages };
