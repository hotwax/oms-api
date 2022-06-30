export const productsTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    toAssocs: "variantProductIds",
    contents: [{
      productContentId: "main",
      productId: "productId",
      contentLocation: "mainImageUrl"
    },{
      productContentId: "",
      productId: "productId",
      contentLocation: "additionalImageUrls"
    }],
    features: {
      hierarchy: "featureHierarchy",
      features: "productFeatures",
      ids: "productFeatureIds",
      productId: "productId"
    },
    categories: "productCategoryNames"
  },
  operate: [{
    run: function(val: any) {
      return val.ids.map((id: any, index: number) => ({
        "productId": val.productId,
        "productFeatureId": id,
        "feature": {
          "productFeatureId": id,
          // TODO: find a way to handle the case of fetching the product feature enum id
          "productFeatureTypeEnumId": val.hierarchy.find((feature: any) => feature.startsWith(`1/${val.features[index].split("/")[0].toUpperCase()}`)).split("/")[1],
          "description": val.features[index].split("/")[1]
        }
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
