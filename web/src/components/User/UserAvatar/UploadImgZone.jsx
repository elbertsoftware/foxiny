import React from 'react';
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

const UploadImgZone = ({ classes, style, onDropAccepted, onDropRejected, isRejected, ...others }) => {
  return (
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
            <Typography gutterBottom color="primary" align="center" variant="h2">
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
  );
};
export default withStyles(styles)(UploadImgZone);
