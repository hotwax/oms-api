import { getOrderDetails, updateOrderStatus } from '../modules/order'
import { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent } from '../modules/product'
import { getProductIdentificationPref, getProfile, setProductIdentificationPref } from '../modules/user'
import { fetchProductsStock, fetchProductsStockAtFacility } from '../modules/stock'

export {
  fetchProducts,
  fetchProductsGroupedBy,
  fetchProductsGroupedByParent,
  fetchProductsStock,
  fetchProductsStockAtFacility,
  getOrderDetails,
  getProductIdentificationPref,
  getProfile,
  setProductIdentificationPref,
  updateOrderStatus
}