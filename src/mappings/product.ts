import { enumTypes } from "../types"

export const productsTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    toAssocs: "variantProductIds",
    images: {
      mainImageUrl: "mainImageUrl",
      additionalImageUrls: "additionalImageUrls"
    },
    features: {
      productFeatures: "productFeatures"
    },
    categories: "productCategoryNames",
    sku: "sku"
  },
  operate: [{
    run: function(val: any) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      return val.productFeatures?.map((feature: any) => ({
        "feature": {
          "productFeatureTypeEnumId": feature.split('/')[0],
          "description": feature.split('/')[1]
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
  }]
}
