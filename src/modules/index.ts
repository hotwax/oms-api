import { getOrderDetails, updateOrderStatus } from '../modules/order'
import { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent, omsFetchGoodIdentificationTypes } from '../modules/product'
import { getProfile, omsGetUserFacilities, logout, omsGetAvailableTimeZones, omsGetEComStores, omsGetEComStoresByFacility, omsGetProductIdentificationPref, omsSetProductIdentificationPref, omsSetUserPreference, omsGetUserPreference, setUserLocale, setUserTimeZone } from '../modules/user'
import { getNotificationEnumIds, getNotificationUserPrefTypeIds, removeClientRegistrationToken, storeClientRegistrationToken, subscribeTopic, unsubscribeTopic } from '../modules/notification'
import { fetchProductsStock, fetchProductsStockAtFacility } from '../modules/stock'
import { askQuery, getGitBookPage, searchQuery } from '../modules/gitbook'
import moquiIndex from './user/moquiIndex'
import productMoquiIndex from './product/moquiIndex'
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

async function getEComStores() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getEComStores(...arguments)
  } else {
    return await omsGetEComStores
  }
}

async function getEComStoresByFacility() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getEComStoresByFacility(...arguments)
  } else {
    return await omsGetEComStoresByFacility
  }
}

async function getUserPreference() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getUserPreference(...(Array.from(arguments) as [any, string, string, any]))
  } else {
    return await omsGetUserPreference
  }
}

async function getProductIdentificationPref() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getProductIdentificationPref(...(Array.from(arguments) as [any]))
  } else {
    return await omsGetProductIdentificationPref
  }
}

async function setProductIdentificationPref() {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.setProductIdentificationPref(...(Array.from(arguments) as [string, any]))
  } else {
    return await omsSetProductIdentificationPref
  }
}

const setUserPreference = async (payload: any) => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.updateUserPreference(payload)
  } else {
    return await omsSetUserPreference
  }
}

const fetchGoodIdentificationTypes = async (payload: any) => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await productMoquiIndex.fetchGoodIdentificationTypes(payload)
  } else {
    return await omsFetchGoodIdentificationTypes(payload)
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