import api, { client } from "../../api";
import { RequestPayload, Response } from "../../types";
import { jsonParse } from "../../util";

async function setUserTimeZone(payload: any): Promise<any> {
  console.log("Payload in setUserTimeZone: ", payload);
  try {
    const resp = await api({
      url: "admin/user/profile",
      method: "POST",
      data: payload,
    }) as any;
    return Promise.resolve(resp.data);
  } catch (error: any) {
    return Promise.reject({
      code: "error",
      message: "Failed to set user time zone",
      serverResponse: error
    });
  }
}

async function setUserLocale(payload: any): Promise<any> {
  payload.locale = payload.newLocale;
  try {
    const resp = await api({
      url: "admin/user/profile",
      method: "POST",
      data: payload,
    }) as any;
    return Promise.resolve(resp.data);
  } catch (error: any) {
    return Promise.reject({
      code: "error",
      message: "Failed to set user locale",
      serverResponse: error
    });
  }
}

const getAvailableTimeZones = async (): Promise <any>  => {
  try {
    const resp: any = await api({
      url: "admin/user/getAvailableTimeZones",
      method: "get",
      cache: true
    });

    return Promise.resolve(resp.data?.timeZones)
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch available timezones",
      serverResponse: error
    })
  }
}

const loginShopifyAppUser = async (baseURL: string, payload: any): Promise <any> => {
  try {
    const resp: any = await client({
      url: "app-bridge/login",
      method: "post",
      baseURL,
      data: payload
    });
    return Promise.resolve(resp.data);
  } catch (error: any) {
    return Promise.reject({
      code: "error",
      message: "Failed to Login Shopify App User",
      serverResponse: error
    })
  }
}

async function fetchFacilitiesByGroup(facilityGroupId: string, baseURL?: string, token?: string, payload?: any): Promise <any> {
  let params: RequestPayload = {
    url: "oms/groupFacilities",
    method: "GET",
    params: {
      facilityGroupId,
      pageSize: 500,
      ...payload
    }
  }

  let resp = {} as any;

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    // Filtering facilities on which thruDate is set, as we are unable to pass thruDate check in the api payload
    // Considering that the facilities will always have a thruDate of the past.
    const facilities = resp.data.filter((facility: any) => !facility.thruDate)
    return Promise.resolve(facilities)
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch facilities for group",
      serverResponse: error
    })
  }
}

async function fetchFacilitiesByParty(partyId: string, baseURL?: string, token?: string, payload?: any): Promise <Array<any> | Response> {
  let params: RequestPayload = {
    url: `inventory-cycle-count/user/${partyId}/facilities`,
    method: "GET",
    params: {
      ...payload,
      pageSize: 500
    }
  }

  let resp = {} as any;

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    // Filtering facilities on which thruDate is set, as we are unable to pass thruDate check in the api payload
    // Considering that the facilities will always have a thruDate of the past.
    const facilities = resp.data.filter((facility: any) => !facility.thruDate)
    return Promise.resolve(facilities)
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch user associated facilities",
      serverResponse: error
    })
  }
}

async function fetchFacilities(token: string, baseURL: string, partyId: string, facilityGroupId: string, isAdminUser: boolean, payload: Object): Promise <any> {
  let facilityIds: Array<string> = [];
  let filters: any = {};
  let resp = {} as any

  // Fetch the facilities associated with party
  if(partyId && !isAdminUser) {
    try {
      resp = await fetchFacilitiesByParty(partyId, baseURL, token)

      facilityIds = resp.map((facility: any) => facility.facilityId);
      if (!facilityIds.length) {
        return Promise.reject({
          code: 'error',
          message: 'Failed to fetch user facilities',
          serverResponse: resp.data
        })
      }
    } catch(error) {
      return Promise.reject({
        code: 'error',
        message: 'Failed to fetch user facilities',
        serverResponse: error
      })
    }
  }

  if(facilityIds.length) {
    filters = {
      facilityId: facilityIds.join(","),
      facilityId_op: "in",
      pageSize: facilityIds.length
    }
  }

  // Fetch the facilities associated with group
  if(facilityGroupId) {
    try {
      resp = await fetchFacilitiesByGroup(facilityGroupId, baseURL, token, filters)

      facilityIds = resp.map((facility: any) => facility.facilityId);
      if (!facilityIds.length) {
        return Promise.reject({
          code: 'error',
          message: 'Failed to fetch user facilities',
          serverResponse: resp.data
        })
      }
    } catch(error) {
      return Promise.reject({
        code: 'error',
        message: 'Failed to fetch user facilities',
        serverResponse: error
      })
    }
  }

  if(facilityIds.length) {
    filters = {
      facilityId: facilityIds.join(","),
      facilityId_op: "in",
      pageSize: facilityIds.length
    }
  }

  let params: RequestPayload = {
    url: "oms/facilities",
    method: "GET",
    params: {
      pageSize: 500,
      ...payload,
      ...filters
    }
  }

  let facilities: Array<any> = []

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    facilities = resp.data
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch facilities",
      serverResponse: error
    })
  }

  return Promise.resolve(facilities)
}

async function getEComStores(token?: string, baseURL?: string, pageSize = 100): Promise <any> {
  let params: RequestPayload = {
    url: "oms/productStores",
    method: "GET",
    params: {
      pageSize
    }
  }

  let resp = {} as any;
  let stores: Array<any> = []

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    stores = resp.data
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch product stores",
      serverResponse: error
    })
  }

  return Promise.resolve(stores)
}

async function getEComStoresByFacility(token?: string, baseURL?: string, pageSize = 100, facilityId?: any): Promise <any> {
  let params: RequestPayload = {
    url: `oms/facilities/${facilityId}/productStores`,
    method: "GET",
    params: {
      pageSize,
      facilityId
    }
  }

  let resp = {} as any;
  let stores: Array<any> = []

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    // Filtering stores on which thruDate is set, as we are unable to pass thruDate check in the api payload
    // Considering that the stores will always have a thruDate of the past.
    stores = resp.data.filter((store: any) => !store.thruDate)
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch facility associated product stores",
      serverResponse: error
    })
  }

  if(!stores.length) return Promise.resolve(stores)

  // Fetching all stores for the store name
  let productStoresMap = {} as any;
  try {
    const productStores = await getEComStores(token, baseURL, 200);
    productStores.map((store: any) => productStoresMap[store.productStoreId] = store.storeName)
  } catch(error) {
    console.error(error);
  }

  stores.map((store: any) => store.storeName = productStoresMap[store.productStoreId])
  return Promise.resolve(stores)
}

async function getUserPreference(token: any, baseURL: string, preferenceKey: string, userId: any): Promise <any> {
  let params: RequestPayload = {
    url: "admin/user/preferences",
    method: "GET",
    params: {
      pageSize: 1,
      userId,
      preferenceKey
    }
  }

  let resp = {} as any;
  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    return Promise.resolve(resp.data[0]?.preferenceValue ? jsonParse(resp.data[0]?.preferenceValue) : "")
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to get user preference",
      serverResponse: error
    })
  }
}

async function updateUserPreference(payload: any): Promise<any> {
  try {
    const resp = await api({
      url: "admin/user/preferences",
      method: "PUT",
      data: {
        userId: payload.userId,
        preferenceKey: payload.userPrefTypeId,
        preferenceValue: payload.userPrefValue,
      },
    }) as any;
    return Promise.resolve(resp.data)
  } catch(error: any) {
    return Promise.reject({
      code: "error",
      message: "Failed to update user preference",
      serverResponse: error
    })
  }
}

async function getProductIdentificationPref(productStoreId: any): Promise<any> {
  const productIdentifications = {
    primaryId: "productId",
    secondaryId: ""
  }

  try {
    const resp = await api({
      url: `oms/productStores/${productStoreId}/settings`,
      method: "GET",
      params: {
        productStoreId,
        settingTypeEnumId: "PRDT_IDEN_PREF"
      }
    }) as any;

    const settings = resp.data
    if(settings[0]?.settingValue) {
      const respValue = JSON.parse(settings[0].settingValue)
      productIdentifications['primaryId'] = respValue['primaryId']
      productIdentifications['secondaryId'] = respValue['secondaryId']
    } else {
      await createProductIdentificationPref(productStoreId)
    }
  } catch(error: any) {
    return Promise.reject({
      code: "error",
      message: "Failed to get product identification pref",
      serverResponse: error
    })
  }

  return productIdentifications;
}

async function createProductIdentificationPref(productStoreId: string): Promise<any> {
  const prefValue = {
    primaryId: "productId",
    secondaryId: ""
  }

  try {
    await api({
      url: `oms/productStores/${productStoreId}/settings`,
      method: "POST",
      data: {
        productStoreId,
        settingTypeEnumId: "PRDT_IDEN_PREF",
        settingValue: JSON.stringify(prefValue)
      }
    });
  } catch(err) {
    console.error(err)
  }

  // not checking for resp success and fail case as every time we need to update the state with the
  // default value when creating a pref
  return prefValue;
}


async function setProductIdentificationPref(productStoreId: string, productIdentificationPref: any): Promise<any> {
  let resp = {} as any, isSettingExists = false;

  try {
    resp = await api({
      url: `oms/productStores/${productStoreId}/settings`,
      method: "GET",
      params: {
        productStoreId,
        settingTypeEnumId: "PRDT_IDEN_PREF"
      }
    });

    if(resp.data[0]?.settingTypeEnumId) isSettingExists = true
  } catch(err) {
    console.error(err)
  }

  if(!isSettingExists) {
    return Promise.reject({
      code: "error",
      message: "product store setting is missing",
      serverResponse: resp.data
    })
  }

  try {
    resp = await api({
      url: `oms/productStores/${productStoreId}/settings`,
      method: "POST",
      data: {
        productStoreId,
        settingTypeEnumId: "PRDT_IDEN_PREF",
        settingValue: JSON.stringify(productIdentificationPref)
      }
    });

    return Promise.resolve(productIdentificationPref)
  } catch(error) {
    return Promise.reject({
      code: "error",
      message: "Failed to set product identification pref",
      serverResponse: error
    })
  }
}

export default {
  fetchFacilities,
  fetchFacilitiesByParty,
  fetchFacilitiesByGroup,
  getAvailableTimeZones,
  getEComStores,
  getEComStoresByFacility,
  getProductIdentificationPref,
  getUserPreference,
  setProductIdentificationPref,
  setUserLocale,
  setUserTimeZone,
  updateUserPreference,
  loginShopifyAppUser
}