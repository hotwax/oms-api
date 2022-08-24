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
    run: function run(features) {
      // Used productFeatures that contains values in the format(featureId/featureValue)
      if (features) {
        var productFeatures = features === null || features === void 0 ? void 0 : features.reduce(function (acc, feature) {
          var key = feature.split('/')[0];
          var value = feature.split('/')[1];

          if (acc[key]) {
            acc[key].push(value);
          } else {
            acc[key] = [value];
          }

          return acc;
        }, {});
        return Object.keys(productFeatures).map(function (key) {
          return {
            "desc": key,
            "value": productFeatures[key]
          };
        });
      }
    },
    on: "features"
  }]
};
exports.productTransformRule = productTransformRule;