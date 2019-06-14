import gql from 'graphql-tag';

const APPROVE_RETAILER_INFO = gql`
  mutation approveRetailer($retailerId: String!) {
    approveRetailer(retailerId: $retailerId) {
      id
      businessName
      approved
    }
  }
`;

const CREATE_RETAILER_APPROVAL_PROCESS = gql`
  mutation createRetailerApprovalProcess($data: CreateRetailerApprovalProcessInput!) {
    createRetailerApprovalProcess(data: $data) {
      id
      processData
    }
  }
`;

const LAST_APPROVAL_PROCESS = gql`
  query lastRetailerApprovalProcess($query: String!) {
    lastRetailerApprovalProcess(query: $query) {
      id
      createdBy {
        id
        name
      }
      processData
    }
  }
`;

export { CREATE_RETAILER_APPROVAL_PROCESS, APPROVE_RETAILER_INFO, LAST_APPROVAL_PROCESS };
