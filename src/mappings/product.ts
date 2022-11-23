import { primaryIdentification, secondaryIdentification } from "@/product"

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
    sku: "sku",
    primaryId: "productId", // passed productId here to make productId available when operating on product to get the primaryId
    secondaryId: "productId"
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
    run: function(val: any, context: any) {
      const product = context.find((product: any) => product.productId == val)
      return product[primaryIdentification]
    },
    on: "primaryId"
  }, {
    run: function(val: any, context: any) {
      const product = context.find((product: any) => product.productId == val)
      return product[secondaryIdentification]
    },
    on: "secondaryId"
  }]
}

export { productTransformRule }
