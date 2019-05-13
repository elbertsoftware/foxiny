//@flow

/**
 * Get all attributes and attribute values from
 * @param {Object} product as a variant, contains or not contains attributes
 */
const restructureProductAttributes = product => {
  const grouped = product.map(x =>
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

  return regrouped;
};

/**
 * restructure product template to an array of product (more friendly for client)
 * @param {Object} productTemplate product template contains a template and many products (variants)
 */
const restrutureProductTemplate2FriendlyProduct = productTemplate => {
  // TODO: lacking of description from manufacturer

  const friendlyProduct = productTemplate.products.map(product => ({
    productTemplateId: productTemplate.id,
    productId: product.id,

    name: productTemplate.name,
    productName: product.productName,
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
      name: option.attribute.name,
      value: option.value.name,
    })),
  }));

  return friendlyProduct;
};

export { restructureProductAttributes, restrutureProductTemplate2FriendlyProduct };
