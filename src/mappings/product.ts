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
    identifications: {
      productId: "productId",
      primaryIdentification: "",
      secondaryIdentification: ""
    }
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
      const product = context.find((product: any) => product.productId == val.productId)
      return [{
        'productIdTypeEnumId': 'PRIMARY_IDNT',
        'idValue': product[primaryIdentification]
      }, {
        'productIdTypeEnumId': 'SECONDARY_IDNT',
        'idValue': product[secondaryIdentification]
      }]
    },
    on: "identifications"
  }]
}

export { productTransformRule }
