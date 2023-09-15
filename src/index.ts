import { events, Product, Response, Stock, Order, OrderItem, OrderPart, OPERATOR, User } from './types'
import api, { client, getConfig, init, initialise, resetConfig, updateToken, updateInstanceUrl } from './api'
import { hasError, isError } from './util'

import { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent, fetchProductsStock, fetchProductsStockAtFacility, getOrderDetails, getProductIdentificationPref, getProfile, logout, setProductIdentificationPref, getUserFacilities, updateOrderStatus } from './modules'

export {
  api,
  client,
  getOrderDetails,
  updateOrderStatus,
  fetchProducts,
  fetchProductsGroupedBy,
  fetchProductsGroupedByParent,
  getConfig,
  logout,
  hasError,
  init,
  initialise,
  isError,
  resetConfig,
  updateToken,
  updateInstanceUrl,
  fetchProductsStock,
  fetchProductsStockAtFacility,
  getProductIdentificationPref,
  getProfile,
  setProductIdentificationPref,
  getUserFacilities,
  events,
  Product,
  Response,
  Stock,
  Order,
  OrderItem,
  OrderPart,
  OPERATOR,
  User
}