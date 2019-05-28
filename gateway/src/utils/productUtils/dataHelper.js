//@flow

/**
 * Get all attributes and its values from all variants
 * @param {Object} contains or not contains attributes
 */
const restructureProductAttributes = products => {
  const grouped = products.map(x =>
    x.attributes.reduce((acc, curr) => {
      acc[curr.attributeName] = acc[curr.attributeName] || [];
      acc[curr.attributeName].push(curr.value);
      return acc;
    }, {}),
  );

  let regrouped = Object.keys(grouped[0]).map(a => ({
    name: a,
    data: [],
  }));

  grouped.forEach(a => {
    Object.keys(grouped[0]).forEach((k, i) => {
      regrouped[i].data = regrouped[i].data.concat(a[k]);
    });
  });

  // remove all duplicated values
  regrouped.forEach(a => {
    a.data = a.data.filter(function(item, pos) {
      return a.data.indexOf(item) === pos;
    });
  });

  return regrouped;
};

/**
 * restructure product template to an array of product (more friendly for client)
 * @param {Object} productTemplate product template contains a template and many products (variants)
 */
const restrutureProductTemplate2FriendlyProduct = productTemplate => {
  // TODO: lacking of description from manufacturer

  const friendlyProducts = productTemplate.products.map(product => ({
    productTemplateId: productTemplate.id,
    productId: product.productRetailers[0].id,

    name: productTemplate.name,
    productName: product.productRetailers[0].productName,
    productMedias: product.productRetailers[0].productMedias,
    briefDescription: productTemplate.briefDescription,
    brand: productTemplate.brand.brandName,
    category: productTemplate.category,

    descriptions: {
      // fromManufacture
      fromRetailers: productTemplate.descriptions.filter(desc => desc.retailer).map(desc => desc.description),
    },
    sku: product.sku,
    listPrice: product.productRetailers[0].listPrice,
    sellPrice: product.productRetailers[0].sellPrice,
    stockQuantity: product.productRetailers[0].stockQuantity,
    inStock: product.productRetailers[0].inStock,
    approved: product.productRetailers[0].approved,

    attributes: product.options.map(option => ({
      attributeName: option.attribute.name,
      value: option.value.name,
    })),
    createdAt: product.productRetailers[0].createdAt,
    updatedAt: product.productRetailers[0].updatedAt,
  }));

  return friendlyProducts;
};

const restructureProductRetailer2FriendlyProduct = products => {
  const friendlyProducts = products.map(product => ({
    productTemplateId: product.product.productTemplate.id,
    productId: product.id,

    name: product.product.productTemplate.name,
    productName: product.productName,
    productMedias: product.productMedias,
    briefDescription: product.product.productTemplate.briefDescription,
    brand: product.product.productTemplate.brand.brandName,
    category: product.product.productTemplate.category,

    descriptions: {
      // fromManufacture
      fromRetailers: product.product.productTemplate.descriptions
        .filter(desc => desc.retailer)
        .map(desc => desc.description),
    },
    sku: product.product.sku,
    listPrice: product.listPrice,
    sellPrice: product.sellPrice,
    stockQuantity: product.stockQuantity,
    inStock: product.inStock,
    approved: product.approved,

    attributes: product.product.options.map(option => ({
      attributeName: option.attribute.name,
      value: option.value.name,
    })),

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  return friendlyProducts;
};

const restructureProduct2FriendlyProduct = products => {
  const friendlyProducts = products.map(product => ({
    productTemplateId: product.product.productTemplate.id,
    productId: product.id,

    name: product.product.productTemplate.name,
    productName: product.productName,
    productMedias: product.productMedias,
    briefDescription: product.product.productTemplate.briefDescription,
    brand: product.product.productTemplate.brand.brandName,
    category: product.product.productTemplate.category,

    descriptions: {
      // fromManufacture
      fromRetailers: product.product.productTemplate.descriptions
        .filter(desc => desc.retailer)
        .map(desc => desc.description),
    },
    sku: product.sku,
    listPrice: product.listPrice,
    sellPrice: product.sellPrice,
    stockQuantity: product.stockQuantity,
    inStock: product.inStock,
    enabled: product.enabled,
    approved: product.approved,

    attributes: product.product.options.map(option => ({
      attributeName: option.attribute.name,
      value: option.value.name,
    })),

    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  return friendlyProducts;
};

export {
  restructureProductAttributes,
  restrutureProductTemplate2FriendlyProduct,
  restructureProductRetailer2FriendlyProduct,
  restructureProduct2FriendlyProduct,
};
