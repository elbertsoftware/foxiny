import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from 'react-dropzone';
import { Typography } from '@material-ui/core';

const UPLOAD_AVATAR = gql`
  mutation($file: Upload!) {
    uploadAvatar(file: $file) {
      id
      url
      enabled
    }
  }
`;

class UserUploadAvatar extends React.Component {
  state = {
    file: {},
  };

  onDrop = async ([file]) => {
    try {
      console.log(file);
      const data = await this.props.uploadAvatar({
        variables: {
          file,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drop files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default graphql(UPLOAD_AVATAR, { name: 'uploadAvatar' })(UserUploadAvatar);
