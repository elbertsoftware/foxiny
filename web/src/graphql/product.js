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

export { GET_PRODUCT };
