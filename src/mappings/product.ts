const productTransformRule = {
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
    run: function(features: any) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      const productFeatures = features?.reduce((acc: any, feature: any) => {
        const key = feature.split('/')[0]
        const value = feature.split('/')[1]
        if (acc[key]) {
          acc[key].push(value)
        } else {
          acc[key] = [value]
        }
        return acc;
      }, {})

      return Object.keys(productFeatures).map((key: string) => ({
        "desc": key,
        "value": productFeatures[key]
      }))
    },
    on: "features"
  }]
}

export { productTransformRule }
