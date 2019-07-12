//@flow

const restructureCatalog = (catalog, languageCode) => {
  const friendlyCatalog = catalog.map(item => ({
    id: item.id,
    name:
      item.trans_name.length > 0 &&
      item.trans_name.find(x => x.language.languageCode === languageCode)
        ? item.trans_name.find(x => x.language.languageCode === languageCode)
            .name
        : item.name,
    parentId: item.parentId.map(parent => parent.id),
    children: item.children.map(child => child.id),
    productTemplate: item.productTemplate ? item.productTemplate : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return friendlyCatalog;
};

const resturectureBrand = (brand, languageCode) => {
  const friendlyBrand = brand.map(item => ({
    id: item.id,
    brandName:
      item.trans_brandName.length > 0 &&
      item.trans_brandName.find(x => x.language.languageCode === languageCode)
        ? item.trans_brandName.find(
            x => x.language.languageCode === languageCode,
          ).brandName
        : item.brandName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return friendlyBrand;
};

export { restructureCatalog, resturectureBrand };

/**
 * Catalog class
 * Created by TAP from FOXINY with ❤
 */
class Catalog {
  /**
   * Object declaration
   * @param {String} id id of item
   * @param {Array} children array of item
   * @param {Array} parent array of item
   * @param {String} name name of item
   */
  constructor(id, children, parent, name) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.children = children;
  }

  /**
   * get category by id in catalog tree
   * @param {String} id id of item
   * @param {Object} node a node of catalog
   * @param {Array} done contains traversed ids
   */
  getCategoryById(id, node = this, done = []) {
    if (node.id === id) {
      return node;
    } else {
      done.push(node.id);
      let r;
      if (node.parent.length > 0) {
        for (let cata of node.parent) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              return r;
            }
          }
        }
      }
      if (node.children.length > 0) {
        for (let cata of node.children) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              return r;
            }
          }
        }
      }
    }
    return;
  }

  getCategoryByName(name, result = []) {
    if (node.name === name) {
      return [...result, node];
    } else {
      done.push(node.id);
      if (node.parent.length > 0) {
        for (let cata of node.parent) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              result = [...result, r];
            }
          }
        }
      }
      if (node.children.length > 0) {
        for (let cata of node.children) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              result = [...result, r];
            }
          }
        }
      }
    }
    return result;
  }

  getRoot() {
    if (node.name === "ROOT") {
      return node;
    } else {
      done.push(node.id);
      let r;
      if (node.parent.length > 0) {
        for (let cata of node.parent) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              return r;
            }
          }
        }
      }
      if (node.children.length > 0) {
        for (let cata of node.children) {
          if (!done.includes(cata.id)) {
            r = cata.getCategoryById(id, cata, done);
            if (r) {
              return r;
            }
          }
        }
      }
    }
    return;
  }

  /**
   * build an tree array from flattened array
   * @param {Array} list an flattened array of item
   */
  static buildTree(list) {
    let mapParent = {},
      mapChildren = {},
      node,
      root = [];
    let newList = list.map(item => new Catalog(item.id, [], [], item.name));
    list.forEach((item, index) => {
      item.parentId.forEach(id => {
        mapParent[id] = id;
      });
      item.children.forEach(id => {
        mapChildren[id] = id;
      });
    });
    newList.forEach((item, index) => {
      node = newList[index];
      if (list[index].parentId.length !== 0) {
        list[index].parentId.forEach(id => {
          newList.find(item => item.id === mapParent[id]).children.push(node);
        });
      } else {
        root.push(node);
      }
      if (list[index].children.length !== 0) {
        list[index].children.forEach(id => {
          newList.find(item => item.id === mapChildren[id]).parent.push(node);
        });
      }
    });

    return root.pop();
  }
}
