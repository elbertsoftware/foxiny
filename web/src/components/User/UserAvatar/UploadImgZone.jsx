import React, { useState, useEffect } from 'react';
import { withStyles, Typography } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

const styles = () => ({
  baseStyle: {
    padding: 20,
    width: 600,
    height: 400,
    borderWidth: '5px',
    borderStyle: 'dashed',
    borderColor: 'rgb(208, 208, 208)',
    borderRadius: 5,
    margin: 'auto',
    position: 'relative',
  },
  activeStyle: {
    borderStyle: 'solid',
    borderColor: '#ffbb93',
    backgroundColor: '#eee',
  },
  rejectStyle: {
    borderStyle: 'solid',
    borderColor: '#c66',
    backgroundColor: '#eee',
  },
  bottomTypo: {
    position: 'absolute',
    bottom: 15,
    left: 20,
  },
});

const UploadImgZone = ({ classes, style, images, setImages, ...others }) => {
  // getImages: The callback function passed from upper component to set images for parent component
  const [isRejected, setIsRejected] = useState(false);
  const onDropAccepted = async files => {
    let listFiles = [];
    if (images.length > 0) {
      const listAddedPreview = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
      listFiles = listFiles.concat(images, listAddedPreview);
      console.log(listFiles);
      // setFiles(listFiles);
      setImages(listFiles);
      return;
    }
    const fileList = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setImages(fileList);
    setIsRejected(false);
  };
  const onDropRejected = () => {
    setIsRejected(true);
  };
  useEffect(
    () => () => {
      // Return a function to clean up when unmounting, similar to componentWillUnmount
      // Make sure to revoke the data uris to avoid memory leaks
      images.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [],
  );
  return (
    <React.Fragment>
      <Dropzone
        accept="image/jpeg, image/png, image/svg, image/gif"
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        maxSize={1000000}
        {...others}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept }) => {
          const dropzoneClass = classNames({
            [classes.baseStyle]: true,
            [classes.activeStyle]: isDragActive,
            [classes.rejectStyle]: isDragReject,
          });
          return (
            <div {...getRootProps()} className={style ? `${dropzoneClass} ${style}` : dropzoneClass}>
              <input {...getInputProps()} />
              <Typography className="title" gutterBottom color="primary" align="center" variant="h2">
                {isDragAccept ? 'Thả' : 'Kéo'} tệp vào đây
              </Typography>
              <Typography align="center">(Chỉ hỗ trợ định dạng .JPEG, .PNG, .SVG, .GIF)</Typography>
              {(isDragReject || (isRejected && !isDragAccept)) && (
                <Typography className={classes.bottomTypo} variant="body2" color="error">
                  Tệp chứa định dạng không hợp lệ hoặc dung lượng vượt quá 1MB...
                </Typography>
              )}
            </div>
          );
        }}
      </Dropzone>
    </React.Fragment>
  );
};
export default withStyles(styles)(UploadImgZone);
