export const productsTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    toAssocs: "variantProductIds",
    contents: [{
      productId: "productId",
      contentLocation: "mainImageUrl"
    },{
      productContentId: "",
      productId: "productId",
      contentLocation: "additionalImageUrls"
    }],
    features: {
      productFeatureIds: "productFeatureIds",
      productId: "productId"
    },
    categories: "productCategoryNames",
    identifications: [{
      productId: "productId",
      productIdTypeEnumId: "PidtSku",
      idValue: "sku"
    }]
  },
  operate: [{
    run: function(val: any) {
      // We are storing the productFeatureIds and then we will use another method to fetch the product
      // type value and description
      return val.productFeatureIds?.map((id: any) => ({
        "productId": val.productId,
        "productFeatureId": id
      }))
    },
    on: "features"
  }, {
    run: function(val: Array<string>) {
      if (val) {
        return val.map(id => ({"toProductId": id}))
      }
    },
    on: "toAssocs"
  }, {
    run: function(categories: Array<string>) {
      if (categories) {
        return categories.map(category => ({"category": { "categoryName": category }}))
      }
    },
    on: "categories"
  }],
  defaults: {
    "productContentId": "mainImage"
  }
}
