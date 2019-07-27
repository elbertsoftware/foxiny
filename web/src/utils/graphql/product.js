import gql from 'graphql-tag';

const UPLOAD_IMAGES = gql`
  mutation($files: [Upload!]!) {
    uploadProductMedias(files: $files) {
      id
    }
  }
`;

const CREATE_NEW_PRODUCT = gql`
  mutation createBrandNewProductWVariants(
    $sellerId: String!
    $data: CreateProductWithTemplateInput!
  ) {
    createBrandNewProductWVariants(sellerId: $sellerId, data: $data) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      catalog {
        id
        name
      }
      descriptions {
        fromRetailers
      }
      productMedias {
        uri
      }
      listPrice
      sellPrice
      stockQuantity
      inStock
      approved
      attributes {
        attributeName
        value
      }
    }
  }
`;

const EDIT_PRODUCT = gql`
  mutation updateProducts($sellerId: String!, $data: [UpdateProductInput!]!) {
    updateProducts(sellerId: $sellerId, data: $data) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      catalog {
        id
        name
      }
      descriptions {
        fromRetailers
      }
      productMedias {
        uri
      }
      listPrice
      sellPrice
      stockQuantity
      inStock
      approved
      attributes {
        attributeName
        value
      }
    }
  }
`;

const GET_PRODUCT = gql`
  query productsWoTemplateAfterCreated($sellerId: String!) {
    productsWoTemplateAfterCreated(sellerId: $sellerId) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      catalog {
        id
        name
      }
      descriptions {
        fromRetailers
      }
      productMedias {
        id
        uri
      }
      listPrice
      sellPrice
      stockQuantity
      inStock
      approved
      attributes {
        attributeName
        value
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query {
    catalogs {
      id
      name
      parentId
      children
      createdAt
    }
  }
`;

export {
  GET_PRODUCT,
  GET_CATEGORIES,
  CREATE_NEW_PRODUCT,
  UPLOAD_IMAGES,
  EDIT_PRODUCT,
};
