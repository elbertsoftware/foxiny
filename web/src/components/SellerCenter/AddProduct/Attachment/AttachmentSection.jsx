import React from 'react';
import { withStyles, Paper, Typography, AppBar, Toolbar } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';

const styles = theme => ({
  paper: {
    padding: 20,
    marginBottom: 16,
  },
  bar: {
    marginTop: 16,
    borderRadius: 5,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  warningMessages: {
    borderRadius: 5,
    padding: 20,
    backgroundColor: theme.palette.warning.main,
  },
  condition: {
    margin: '16px 0',
  },
  dropzone: {
    margin: '16px 0',
    padding: 20,
    width: 250,
    height: 150,
    borderWidth: '5px',
    borderStyle: 'dashed',
    borderColor: 'rgb(208, 208, 208)',
    borderRadius: 5,
    position: 'relative',
  },
});

const AttachmentSection = ({ classes }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.bar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h5">Tài liệu yêu cầu theo thương hiệu</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.warningMessages}>
        <div className={classes.condition}>
          <Typography gutterBottom variant="h6">
            Trường hợp seller tự sản xuất
          </Typography>
          <Typography variant="body2">
            Giấy chứng nhận đăng ký nhãn hiệu đối với sản phẩm do doanh nghiệp tự sản xuất hoặc
          </Typography>
          <Typography variant="body2">
            Công bố tiêu chuẩn, quy chuẩn ghi rõ thông tin thương nhân bán hàng là người sản xuất
          </Typography>
        </div>
        <div className={classes.condition}>
          <Typography gutterBottom variant="h6">
            Trường hợp seller tự phân phối sản phẩm
          </Typography>
          <Typography variant="body2">
            Giấy chứng nhận đại lý phân phối hoặc hợp đồng mua bán hàng hóa đói với hàng hóa do doanh nghiệp phân phôi
            hoặc mua đi bán lại hoặc
          </Typography>
          <Typography variant="body2">
            Giấy tờ thông quan có dấu thông quan tại cửa khẩu đôi với hàng hóa nhập khẩu
          </Typography>
        </div>
      </div>
      <section className="container">
        <div {...getRootProps({ className: `${classes.dropzone}` })}>
          <input {...getInputProps()} />
          <p>Kéo thả tệp đính kèm vào đây, hoặc click để duyệt file</p>
        </div>
        <aside>
          <h4>Tệp của bạn:</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    </Paper>
  );
};
export default withStyles(styles)(AttachmentSection);
