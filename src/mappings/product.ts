import { enumTypes } from "../types"

export const productsTransformRule = {
  item: {
    productId: "productId",
    pseudoId: "internalName",
    productName: "productName",
    salesIntroductionDate: "introductionDate",
    toAssocs: "variantProductIds",
    contents: {
      mainImageUrl: "mainImageUrl",
      additionalImageUrls: "additionalImageUrls"
    },
    features: {
      productFeatures: "productFeatures"
    },
    categories: "productCategoryNames",
    identifications: {
      productSku: "sku"
    }
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
  }, {
    run: function(identifications: any) {
      if (Object.keys(identifications).length) {
        return Object.keys(identifications).map((identificationKey: string) => ({
          productIdTypeEnumId: enumTypes[identificationKey],
          idValue: identifications[identificationKey]
        }))
      }
    },
    on: "identifications"
  }, {
    run: function(contents: any) {
      if (Object.keys(contents).length) {
        return Object.keys(contents).map((contentKey: string) => ({
          productContentTypeEnumId: enumTypes[contentKey],
          contentLocation: contents[contentKey]
        }))
      }
    },
    on: "contents"
  }],
  defaults: {
    "productContentId": "mainImage"
  }
}
