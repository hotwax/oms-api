import { enumTypes } from "../types"

export const productTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    toAssocs: "variantProductIds",
    assocs: {
      "parentProductName": "parentProductName",
      "groupId": "groupId"
    },
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
    run: function(features: any) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      const productFeatures = features.productFeatures?.map((feature: any) => ({
        "feature": {
          "productFeatureTypeEnumId": feature.split('/')[0],
          "description": feature.split('/')[1]
        }
      }))

      if (features.brandName) {
        productFeatures.push({
          "feature": {
            "productFeatureTypeEnumId": enumTypes['brandType'],
            "description": features.brandName
          }
        })
      }

      return productFeatures
    },
    on: "features"
  }, {
    run: function(productsIds: Array<string>) {
      if (productsIds) {
        return productsIds.map(id => ({"toProductId": id}))
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
  }, {
    run: function(assocs: any) {
      if (assocs) {
        return {
          "toProductId": assocs.groupId,
          "toProduct": {
            "productName": assocs.parentProductName
          }
        }
      }
    },
    on: "assocs"
  }]
}
