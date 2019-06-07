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

const RETAILERS = gql`
  query {
    myRetailers {
      id
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
    }
  }
`;

export { RETAILERS, REGISTER_RETAILER, UPDATE_RETAILER, UPLOAD_AVATAR_RETAILER, RESEND_RETAILER_CONFIMATION };
