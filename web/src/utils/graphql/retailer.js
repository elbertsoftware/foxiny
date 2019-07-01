import gql from 'graphql-tag';

const REGISTER_RETAILER = gql`
  mutation registerRetailer($data: RegisterRetailer!) {
    registerRetailer(data: $data) {
      userId
      retailerId
    }
  }
`;

const UPDATE_RETAILER = gql`
  mutation updateRetailer($retailerId: String!, $data: UpdateRetailerInput!) {
    updateRetailer(retailerId: $retailerId, data: $data) {
      id
      businessName
      businessPhone
      businessEmail
      businessAvatar {
        id
        uri
      }
      businessAddress {
        city
      }
    }
  }
`;

const UPLOAD_AVATAR_RETAILER = gql`
  mutation uploadBusinessAvatar($sellerId: String!, $file: Upload!) {
    uploadBusinessAvatar(sellerId: $sellerId, file: $file) {
      id
      uri
    }
  }
`;

const RESEND_RETAILER_CONFIMATION = gql`
  mutation resendRetailerConfirmationCode($emailOrPhone: String!) {
    resendRetailerConfirmationCode(emailOrPhone: $emailOrPhone)
  }
`;

const UPLOAD_SOCIAL_ID_MEDIA = gql`
  mutation uploadSocialIDMediaRetailer($sellerId: String!, $files: [Upload!]!) {
    uploadSocialIDMediaRetailer(sellerId: $sellerId, files: $files) {
      id
      uri
    }
  }
`;

const DELETE_SOCIAL_ID_MEDIA = gql`
  mutation deleteSocialIDMediaRetailer($sellerId: String!, $fileIds: [String!]) {
    deleteSocialIDMediaRetailer(sellerId: $sellerId, fileIds: $fileIds)
  }
`;

const UPLOAD_BUSINESS_LICENSE = gql`
  mutation uploadBusinessLicenseMediaRetailer($sellerId: String!, $files: [Upload!]!) {
    uploadBusinessLicenseMediaRetailer(sellerId: $sellerId, files: $files) {
      id
      uri
    }
  }
`;

const DELETE_BUSINESS_LICENSE = gql`
  mutation deleteBusinessLicenseMediaRetailer($sellerId: String!, $fileIds: [String!]) {
    deleteBusinessLicenseMediaRetailer(sellerId: $sellerId, fileIds: $fileIds)
  }
`;

const RETAILERS = gql`
  query {
    myRetailers {
      id
      owner {
        user {
          name
        }
      }
      businessName
      businessEmail
      businessPhone
      businessAvatar {
        id
        uri
      }
      businessAddress {
        city
      }
      socialNumberImages {
        id
        uri
      }
      enabled
    }
  }
`;

const ALL_RETAILERS = gql`
  query {
    retailers {
      id
      owner {
        user {
          name
        }
      }
      businessName
      businessEmail
      businessPhone
      businessAvatar {
        id
        uri
      }
      businessAddress {
        city
      }
      socialNumberImages {
        id
        uri
      }
      enabled
    }
  }
`;

export {
  RETAILERS,
  ALL_RETAILERS,
  REGISTER_RETAILER,
  UPDATE_RETAILER,
  UPLOAD_AVATAR_RETAILER,
  RESEND_RETAILER_CONFIMATION,
  UPLOAD_SOCIAL_ID_MEDIA,
  UPLOAD_BUSINESS_LICENSE,
  DELETE_BUSINESS_LICENSE,
  DELETE_SOCIAL_ID_MEDIA,
};
