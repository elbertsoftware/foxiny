import gql from 'graphql-tag';

const APPROVE_RETAILER_INFO = gql`
  mutation approveRetailer($data: CreateApprovalProcess!) {
    approveRetailer(data: $data)
  }
`;

const DISAPPROVE_RETAILER_INFO = gql`
  mutation disapproveRetailer($data: CreateApprovalProcess!) {
    disapproveRetailer(data: $data)
  }
`;

const CREATE_RETAILER_APPROVAL_PROCESS = gql`
  mutation createRetailerApprovalProcess($data: CreateApprovalProcess!) {
    createRetailerApprovalProcess(data: $data) {
      id
      data
    }
  }
`;

const APPROVE_PRODUCT_INFO = gql`
  mutation approveProducts($data: CreateApprovalProcess!) {
    approveProducts(data: $data)
  }
`;

const DISAPPROVE_PRODUCT_INFO = gql`
  mutation disapproveProducts($data: CreateApprovalProcess!) {
    disapproveProducts(data: $data)
  }
`;

const CREATE_PRODUCT_APPROVAL_PROCESS = gql`
  mutation createProductApprovalProcess($data: CreateApprovalProcess!) {
    createProductApprovalProcess(data: $data) {
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
        openedByUser {
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

const LIST_APPROVAL_CASES = gql`
  query {
    retailerApprovals {
      id
      subject
      status {
        id
        name
      }
      severity {
        id
        name
      }
      catergory {
        id
        name
      }
      openedByUser {
        id
        name
      }
      targetIds
      createdAt
    }
  }
`;
const LIST_PRODUCT_APPROVAL_CASES = gql`
  query {
    productApprovals {
      id
      subject
      status {
        id
        name
      }
      severity {
        id
        name
      }
      catergory {
        id
        name
      }
      openedByUser {
        id
        name
      }
      targetIds
      createdAt
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
        openedByUser {
          id
          name
          email
        }
        catergory {
          name
        }
        severity {
          name
        }
        createdAt
      }
      data
      note
    }
  }
`;

const LAST_APPROVAL_PRODUCT_PROCESS = gql`
  query lastProductApprovalProcess($query: ApprovalQueryInput!) {
    lastProductApprovalProcess(query: $query) {
      id
      supportCase {
        id
        subject
        status {
          name
        }
        openedByUser {
          id
          name
          email
        }
        catergory {
          name
        }
        severity {
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
  CREATE_PRODUCT_APPROVAL_PROCESS,
  APPROVE_PRODUCT_INFO,
  DISAPPROVE_PRODUCT_INFO,
  RETAILER_APPROVAL_PROCESS,
  LAST_APPROVAL_PROCESS,
  LAST_APPROVAL_PRODUCT_PROCESS,
  LIST_APPROVAL_CASES,
  LIST_PRODUCT_APPROVAL_CASES,
};
