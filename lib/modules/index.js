"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "fetchProducts", {
  enumerable: true,
  get: function get() {
    return _product.fetchProducts;
  }
});
Object.defineProperty(exports, "fetchProductsStock", {
  enumerable: true,
  get: function get() {
    return _stock.fetchProductsStock;
  }
});
Object.defineProperty(exports, "getOrderDetails", {
  enumerable: true,
  get: function get() {
    return _order.getOrderDetails;
  }
});
Object.defineProperty(exports, "getProfile", {
  enumerable: true,
  get: function get() {
    return _user.getProfile;
  }
});
Object.defineProperty(exports, "updateOrderStatus", {
  enumerable: true,
  get: function get() {
    return _order.updateOrderStatus;
  }
});

var _order = require("./order");

var _product = require("./product");

var _user = require("./user");

var _stock = require("./stock");