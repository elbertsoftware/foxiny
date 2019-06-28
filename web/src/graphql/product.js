import gql from 'graphql-tag';

const GET_PRODUCT = gql`
  query productsWoTemplateAfterCreated($sellerId: String!) {
    productsWoTemplateAfterCreated(sellerId: $sellerId) {
      productTemplateId
      productId
      name
      productName
      briefDescription
      brand
      category {
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
    categories {
      id
      name
      parentId {
        id
        name
      }
      productTemplates {
        id
        name
      }
      products {
        productId
        productName
      }
      createdAt
    }
  }
`;

export { GET_PRODUCT, GET_CATEGORIES };
