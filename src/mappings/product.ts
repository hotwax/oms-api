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
    identifications: "goodIdentifications",
    brandName: "brandName",
    sku: "sku"
  },
  operate: [{
    run: function(features: any) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      if (features) {
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
      }
    },
    on: "features"
  }, {
    run: function(identifications: Array<string>) {
      // used goodIdentifications that contains values in the format(id/value OR id/child-id/value)
      if (identifications?.length) {
        return identifications.map((identification: string) => {
          // using lastIndexOf `/` as some of the identifiers are in the format `ABC/abc/123` and thus to handle check for `ABC/abc`
          const index = identification.lastIndexOf('/')
          const key = identification.slice(0, index);
          const value = identification.slice(index + 1)
          return {
            productIdTypeEnumId: key,
            idValue: value
          }
        })
      }

      return []
    },
    on: "identifications"
  }]
}

export { productTransformRule }
