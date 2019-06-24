import gql from 'graphql-tag';

const APPROVE_RETAILER_INFO = gql`
  mutation approveRetailer($data: ApproveRetailerInput!) {
    approveRetailer(data: $data) {
      id
      businessName
      approved
    }
  }
`;

const DISAPPROVE_RETAILER_INFO = gql`
  mutation disapproveRetailer($data: ApproveRetailerInput!) {
    disapproveRetailer(data: $data) {
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
      data
    }
  }
`;

const RETAILER_APPROVAL_PROCESS = gql`
  query retailerApprovalProcesses($query: ApprovalQueryInput!) {
    retailerApprovalProcesses(query: $query) {
      id
      supportCase {
        id
        subject
        status {
          name
        }
        openByUser {
          id
          name
          email
        }
        catergory {
          name
        }
        createdAt
      }
      respondedBy {
        id
        name
      }
      data
    }
  }
`;

const LAST_APPROVAL_PROCESS = gql`
  query lastRetailerApprovalProcess($query: ApprovalQueryInput!) {
    lastRetailerApprovalProcess(query: $query) {
      id
      supportCase {
        id
        subject
        status {
          name
        }
        openByUser {
          id
          name
          email
        }
        catergory {
          name
        }
        createdAt
      }
      data
      note
    }
  }
`;

export {
  CREATE_RETAILER_APPROVAL_PROCESS,
  APPROVE_RETAILER_INFO,
  DISAPPROVE_RETAILER_INFO,
  RETAILER_APPROVAL_PROCESS,
  LAST_APPROVAL_PROCESS,
};
