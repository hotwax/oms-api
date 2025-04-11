import { getOrderDetails, updateOrderStatus } from '../modules/order'
import { fetchGoodIdentificationTypes, fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent } from '../modules/product'
import { getEComStoresByFacility, getEComStores, omsGetAvailableTimeZones, getProductIdentificationPref, getProfile, omsGetUserFacilities, getUserPreference, logout, setProductIdentificationPref, setUserLocale, setUserTimeZone, omsSetUserPreference} from '../modules/user'
import { getNotificationEnumIds, getNotificationUserPrefTypeIds, removeClientRegistrationToken, storeClientRegistrationToken, subscribeTopic, unsubscribeTopic } from '../modules/notification'
import { fetchProductsStock, fetchProductsStockAtFacility } from '../modules/stock'
import { askQuery, getGitBookPage, searchQuery } from '../modules/gitbook'
import moquiIndex from './user/moquiIndex'
import { getConfig } from '../api'

const getAvailableTimeZones = async () => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getAvailableTimeZones()
  } else {
    return await omsGetAvailableTimeZones()
  }
}

async function getUserFacilities() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.fetchFacilities(...arguments)
  } else {
    return await omsGetUserFacilities
  }
}

const fetchFacilities = async() => {
  return await moquiIndex.fetchFacilities();
}

async function fetchFacilitiesByGroup() {
  return await moquiIndex.fetchFacilitiesByGroup(...(Array.from(arguments) as [string, string, string, any]));
}

async function fetchFacilitiesByParty() {
  return await moquiIndex.fetchFacilitiesByParty(...(Array.from(arguments) as [string, string, string, any]));
}

const setUserPreference = async () => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.updateUserPreference
  } else {
    return await omsSetUserPreference
  }
}

export {
  askQuery,
  fetchFacilities,
  fetchFacilitiesByGroup,
  fetchFacilitiesByParty,
  fetchGoodIdentificationTypes,
  fetchProducts,
  fetchProductsGroupedBy,
  fetchProductsGroupedByParent,
  fetchProductsStock,
  fetchProductsStockAtFacility,
  getAvailableTimeZones,
  getEComStoresByFacility,
  getEComStores,
  getGitBookPage,
  getNotificationEnumIds,
  getNotificationUserPrefTypeIds,
  getOrderDetails,
  getProductIdentificationPref,
  getProfile,
  removeClientRegistrationToken,
  logout,
  searchQuery,
  setProductIdentificationPref,
  storeClientRegistrationToken,
  subscribeTopic,
  unsubscribeTopic,
  getUserFacilities,
  updateOrderStatus,
  getUserPreference,
  setUserPreference,
  setUserLocale,
  setUserTimeZone
}