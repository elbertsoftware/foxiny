import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { Typography, withStyles } from '@material-ui/core';
import AvatarEditor from 'react-avatar-editor';
import { toast } from 'react-toastify';
import Loading from '../../App/Loading';

const UPLOAD_AVATAR = gql`
  mutation($file: Upload!) {
    uploadAvatar(file: $file) {
      id
      url
      enabled
    }
  }
`;

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

class UserUploadAvatar extends React.Component {
  state = {
    image: {},
    isRejected: false,
    loading: false,
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  onDropAccepted = async ([file]) => {
    this.setState({ isRejected: false, image: file });
  };

  onClickSave = async () => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
      fetch(canvasScaled)
        .then(res => res.blob())
        .then(async blob => {
          try {
            const {
              data: {
                uploadAvatar: { url },
              },
            } = await this.props.uploadAvatar({
              variables: {
                file: blob,
              },
            });
            if (url) {
              this.setState({ loading: true });
              window.location.reload();
            }
          } catch (error) {
            toast.error(error.message.replace('GraphQL error:', '') || 'Có lỗi xảy ra. Vui lòng thử lại !');
          }
        });
    }
  };

  onDropRejected = () => {
    this.setState({ isRejected: true });
  };

  setEditorRef = editor => (this.editor = editor);

  render() {
    const { classes } = this.props;
    const { image, isRejected, loading } = this.state;
    return (
      <React.Fragment>
        {!image.name ? (
          <Dropzone
            accept="image/jpeg, image/png, image/svg, image/gif"
            onDropAccepted={this.onDropAccepted}
            onDropRejected={this.onDropRejected}
            maxSize={1000000}
          >
            {({ getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept }) => {
              const dropzoneClass = classNames({
                [classes.baseStyle]: true,
                [classes.activeStyle]: isDragActive,
                [classes.rejectStyle]: isDragReject,
              });
              return (
                <div {...getRootProps()} className={dropzoneClass}>
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
        ) : (
          <React.Fragment>
            <AvatarEditor
              ref={this.setEditorRef}
              width={200}
              height={200}
              border={[200, 100]}
              borderRadius={100}
              image={image}
            />
            {loading && <Loading />}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

UserUploadAvatar.propTypes = {
  classes: PropTypes.object,
};

export default compose(
  graphql(UPLOAD_AVATAR, { name: 'uploadAvatar' }),
  withStyles(styles),
)(UserUploadAvatar);
