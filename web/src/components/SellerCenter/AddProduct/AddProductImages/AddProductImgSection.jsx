import React, { useCallback, useState, useContext, useEffect } from 'react';
import {
  Paper,
  AppBar,
  Toolbar,
  Typography,
  withStyles,
  Link,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button,
} from '@material-ui/core';
import OpenContext from '../../../../utils/context/OpenContextAddProduct';
import UploadImgZone from '../../../User/UserAvatar/UploadFileZone';

const styles = () => ({
  root: {
    marginBottom: 16,
    height: 400,
  },
  bar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  gridContainer: {
    height: 240,
  },
  content: {
    padding: 10,
  },
  styleDropzone: {
    width: '100%',
    height: '100%',
  },
  card: {
    maxWidth: 220,
  },
  media: {
    height: 200,
  },
});

const AddProductImgSection = ({ classes, files, productName, setImages, setIndexProduct }) => {
  // Use Context
  const openContext = useContext(OpenContext);

  // const [files, setFiles] = useState([]);
  const [isRejected, setRejected] = useState(false);
  const onDropAccepted = acceptedFiles => {
    setRejected(false);
    let listFiles = [];
    if (files && files.length > 0) {
      const listAddedPreview = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
      listFiles = listFiles.concat(files, listAddedPreview);
      console.log(listFiles);
      // setFiles(listFiles);
      setImages(listFiles);
      return;
    }
    const fileList = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setImages(fileList);
  };

  const onDropRejected = useCallback(() => {
    setRejected(true);
  });
  const handleDelete = preview => {
    const filesAfterDelete = files.filter(file => file.preview !== preview);
    setImages(filesAfterDelete);
  };
  const handleOpenModal = () => {
    openContext.setOpen();
    // Determine which product is being triggered
    setIndexProduct();
  };
  useEffect(
    () => () => {
      // Return a function to clean up when unmounting, similar to componentWillUnmount
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [],
  );
  return (
    <Paper className={classes.root}>
      <AppBar className={classes.bar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h5">{productName}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <Typography onClick={handleOpenModal} gutterBottom component={Link} color="secondary" variant="h6">
          Sao chép hình ảnh cho sản phẩm khác
        </Typography>
        <Typography gutterBottom variant="subtitle2">
          Kéo thả hình ảnh vào ô bên dưới. Chọn Đặt đại diện để làm Ảnh đại diện cho sản phẩm ở các trang tìm kiếm và
          liệt kê.
        </Typography>
        <Grid alignContent="stretch" container className={classes.gridContainer}>
          {files && files.length === 0 ? (
            <Grid item xs={12}>
              <UploadImgZone
                onDropAccepted={onDropAccepted}
                onDropRejected={onDropRejected}
                isRejected={isRejected}
                style={classes.styleDropzone}
              />
            </Grid>
          ) : (
            <React.Fragment>
              {files.map(file => (
                <Grid key={file.preview} item xs>
                  <Card elevation={0} className={classes.card}>
                    <CardMedia
                      className={classes.media}
                      image={file.preview}
                      src={file.preview}
                      title="Product-Image-Preview"
                    />
                    <CardActions>
                      <Button size="small" variant="contained" color="secondary">
                        Đặt đại diện
                      </Button>
                      <Button onClick={() => handleDelete(file.preview)} size="small" color="primary">
                        Xóa
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              <Grid item xs>
                <UploadImgZone
                  onDropAccepted={onDropAccepted}
                  onDropRejected={onDropRejected}
                  isRejected={isRejected}
                  style={classes.styleDropzone}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(AddProductImgSection);
