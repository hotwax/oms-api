export const productTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    variants: "variantProductIds",
    parent: {
      "productName": "parentProductName",
      "id": "groupId"
    },
    images: {
      mainImageUrl: "mainImageUrl",
      additionalImageUrls: "additionalImageUrls"
    },
    features: "productFeatures",
    brandName: "brandName",
    sku: "sku"
  },
  operate: [{
    run: function(productFeatures: any) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      return productFeatures?.map((feature: any) => ({
        "feature": {
          "productFeatureTypeEnumId": feature.split('/')[0],
          "description": feature.split('/')[1]
        }
      }))
    },
    on: "features"
  }]
}
