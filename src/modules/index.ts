import { getOrderDetails, updateOrderStatus } from '../modules/order'
import { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent, omsFetchGoodIdentificationTypes } from '../modules/product'
import { getProfile, omsGetUserFacilities, logout, omsGetAvailableTimeZones, omsGetEComStores, omsGetEComStoresByFacility, omsGetProductIdentificationPref, omsSetProductIdentificationPref, omsSetUserPreference, omsGetUserPreference, omsSetUserLocale, omsSetUserTimeZone } from '../modules/user'
import { omsGetNotificationEnumIds, omsGetNotificationUserPrefTypeIds, omsRemoveClientRegistrationToken, omsStoreClientRegistrationToken, omsSubscribeTopic, omsUnsubscribeTopic } from '../modules/notification'
import { fetchProductsStock, fetchProductsStockAtFacility } from '../modules/stock'
import { askQuery, getGitBookPage, searchQuery } from '../modules/gitbook'
import moquiIndex from './user/moquiIndex'
import productMoquiIndex from './product/moquiIndex'
import notificationMoquiIndex from './notification/moquiIndex'
import { getConfig } from '../api'

const getAvailableTimeZones = async () => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getAvailableTimeZones()
  } else {
    return await omsGetAvailableTimeZones()
  }
}

async function getUserFacilities(token: any, baseURL: string, partyId: string, facilityGroupId: any, isAdminUser = false, payload = {}) {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.fetchFacilities(token, baseURL, partyId, facilityGroupId, isAdminUser, payload)
  } else {
    return await omsGetUserFacilities(token, baseURL, partyId, facilityGroupId, isAdminUser, payload)
  }
}

async function fetchFacilities(token: any, baseURL: string, partyId: string, facilityGroupId: any, isAdminUser = false, payload = {}) {
  return await moquiIndex.fetchFacilities(token, baseURL, partyId, facilityGroupId, isAdminUser, payload);
}

async function fetchFacilitiesByGroup(facilityGroupId: string, baseURL?: string, token?: string, payload?: any) {
  return await moquiIndex.fetchFacilitiesByGroup(facilityGroupId, baseURL, token, payload);
}

async function fetchFacilitiesByParty(partyId: string, baseURL?: string, token?: string, payload?: any) {
  return await moquiIndex.fetchFacilitiesByParty(partyId, baseURL, token, payload);
}

async function getEComStores(token: any, baseURL: string, vSize = 100) {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getEComStores(token, baseURL, vSize)
  } else {
    return await omsGetEComStores(token, baseURL, vSize)
  }
}

async function getEComStoresByFacility(token: any, baseURL: string, vSize = 100, facilityId?: string) {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getEComStoresByFacility(token, baseURL, vSize, facilityId)
  } else {
    return await omsGetEComStoresByFacility(token, baseURL, vSize, facilityId)
  }
}

async function getUserPreference(token: any, baseURL: string, userPrefTypeId: string, userId = "") {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getUserPreference(token, baseURL, userPrefTypeId, userId)
  } else {
    return await omsGetUserPreference(token, baseURL, userPrefTypeId)
  }
}

async function getProductIdentificationPref(eComStoreId: string) {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.getProductIdentificationPref(eComStoreId)
  } else {
    return await omsGetProductIdentificationPref(eComStoreId)
  }
}

async function setProductIdentificationPref(eComStoreId: string, productIdentificationPref: any) {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.setProductIdentificationPref(eComStoreId, productIdentificationPref)
  } else {
    return await omsSetProductIdentificationPref(eComStoreId, productIdentificationPref)
  }
}

const setUserPreference = async (payload: any) => {
  const apiConfig = getConfig() as any;
  if(apiConfig.systemType === "MOQUI") {
    return await moquiIndex.updateUserPreference(payload)
  } else {
    return await omsSetUserPreference(payload)
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

async function getNotificationEnumIds(enumTypeId: string) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.getNotificationEnumIds(enumTypeId);
  } else {
    return await omsGetNotificationEnumIds(enumTypeId);
  }
}

// getNotificationUserPrefTypeIds
async function getNotificationUserPrefTypeIds(applicationId: string, userLoginId: string, filterConditions = {}) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.getNotificationUserPrefTypeIds(applicationId, userLoginId, filterConditions);
  } else {
    return await omsGetNotificationUserPrefTypeIds(applicationId, userLoginId, filterConditions);
  }
}

// storeClientRegistrationToken
async function storeClientRegistrationToken(registrationToken: string, deviceId: string, applicationId: string) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.storeClientRegistrationToken(registrationToken, deviceId, applicationId);
  } else {
    return await omsStoreClientRegistrationToken(registrationToken, deviceId, applicationId);
  }
}

// removeClientRegistrationToken
async function removeClientRegistrationToken(deviceId: string, applicationId: string) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.removeClientRegistrationToken(deviceId, applicationId);
  } else {
    return await omsRemoveClientRegistrationToken(deviceId, applicationId);
  }
}

// subscribeTopic
async function subscribeTopic(topicName: string, applicationId: string) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.subscribeTopic(topicName, applicationId);
  } else {
    return await omsSubscribeTopic(topicName, applicationId);
  }
}

// unsubscribeTopic
async function unsubscribeTopic(topicName: string, applicationId: string) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await notificationMoquiIndex.unsubscribeTopic(topicName, applicationId);
  } else {
    return await omsUnsubscribeTopic(topicName, applicationId);
  }
}

async function loginShopifyAppUser(baseURL: string, payload: any) {
  return await moquiIndex.loginShopifyAppUser(baseURL, payload);
}

async function setUserTimeZone(payload: any) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await moquiIndex.setUserTimeZone(payload);
  } else {
    return await omsSetUserTimeZone(payload);
  }
}

async function setUserLocale(payload: any) {
  const apiConfig = getConfig() as any;
  if (apiConfig.systemType === "MOQUI") {
    return await moquiIndex.setUserLocale(payload);
  } else {
    return await omsSetUserLocale(payload);
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
  setUserTimeZone,
  loginShopifyAppUser
}