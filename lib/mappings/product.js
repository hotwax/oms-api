"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productTransformRule = void 0;
var productTransformRule = {
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
    run: function run(productFeatures) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      return productFeatures === null || productFeatures === void 0 ? void 0 : productFeatures.map(function (feature) {
        return {
          "feature": {
            "productFeatureTypeEnumId": feature.split('/')[0],
            "description": feature.split('/')[1]
          }
        };
      });
    },
    on: "features"
  }]
};
exports.productTransformRule = productTransformRule;