import api, { client } from "../../api";
import { userProfileTransformRule } from "../../mappings/user";
import { RequestPayload, Response, User } from "../../types";
import { hasError, jsonParse } from "../../util";
import { transform } from 'node-json-transform';

async function getProfile(): Promise<User | Response> {
  try {
    const resp = await api({
      url: "user-profile", 
      method: "get",
    }) as any;

    if (resp.status === 200 && !hasError(resp)) {
      const user: User = transform(resp.data, userProfileTransformRule)

      return Promise.resolve(user);
    } else {
      return Promise.reject({
        code: 'error',
        message: 'Failed to fetch user profile information',
        serverResponse: resp.data
      })
    }
  } catch(err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function setProductIdentificationPref(eComStoreId: string, productIdentificationPref: any): Promise<any> {

  let fromDate;

  const payload = {
    "inputFields": {
      "productStoreId": eComStoreId,
      "settingTypeEnumId": "PRDT_IDEN_PREF"
    },
    "filterByDate": 'Y',
    "entityName": "ProductStoreSetting",
    "fieldList": ["fromDate", "productStoreId"],
    "viewSize": 1
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload,
      cache: true
    }) as any;
    if(!hasError(resp)) {
      fromDate = resp.data.docs[0].fromDate
    }
  } catch(err) {
    console.error(err)
  }

  // when fromDate is not found then reject the call with a message
  if(!fromDate) {
    return Promise.reject('fromDate information is missing');
  }

  const params = {
    "fromDate": fromDate,
    "productStoreId": eComStoreId,
    "settingTypeEnumId": "PRDT_IDEN_PREF",
    "settingValue": JSON.stringify(productIdentificationPref)
  }

  try {
    const resp = await api({
      url: "service/updateProductStoreSetting",
      method: "post",
      data: params
    }) as any;

    if(!hasError(resp)) {
      return Promise.resolve(productIdentificationPref)
    } else {
      return Promise.reject({
        code: 'error',
        message: 'Failed to set product identification pref',
        serverResponse: resp.data
      })
    }
  } catch(err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function createProductIdentificationPref(eComStoreId: string): Promise<any> {
  const prefValue = {
    primaryId: 'productId',
    secondaryId: ''
  }

  const params = {
    "fromDate": Date.now(),
    "productStoreId": eComStoreId,
    "settingTypeEnumId": "PRDT_IDEN_PREF",
    "settingValue": JSON.stringify(prefValue)
  }

  try {
    await api({
      url: "service/createProductStoreSetting",
      method: "post",
      data: params
    });
  } catch(err) {
    console.error(err)
  }

  // not checking for resp success and fail case as every time we need to update the state with the
  // default value when creating a pref
  return prefValue;
}

async function getProductIdentificationPref(eComStoreId: string): Promise<any> {

  const productIdentifications = {
    'primaryId': 'productId',
    'secondaryId': ''
  }

  const payload = {
    "inputFields": {
      "productStoreId": eComStoreId,
      "settingTypeEnumId": "PRDT_IDEN_PREF"
    },
    "filterByDate": 'Y',
    "entityName": "ProductStoreSetting",
    "fieldList": ["settingValue", "fromDate"],
    "viewSize": 1
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload,
      cache: true
    }) as any;

    if(!hasError(resp) && resp.data.docs[0].settingValue) {
      const respValue = JSON.parse(resp.data.docs[0].settingValue)
      productIdentifications['primaryId'] = respValue['primaryId']
      productIdentifications['secondaryId'] = respValue['secondaryId']
    } else if(resp.data.error === "No record found") {  // TODO: remove this check once we have the data always available by default
      await createProductIdentificationPref(eComStoreId)
    }
  } catch(err) {
    console.error(err)
  }

  return productIdentifications
}


// TODO: need to add support for logout endpoint in moqui, currently no such endpoint is available
async function logout(): Promise<any> {
  return Promise.resolve({})
}

async function getUserPreference(token: any, baseURL: string, userPrefTypeId: string): Promise<any> {
  try {
    const resp = await client({
      url: "service/getUserPreference",
      method: "post",
      data: { userPrefTypeId },
      baseURL,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (hasError(resp)) {
      throw resp.data
    }
    return Promise.resolve(jsonParse(resp.data.userPrefValue));
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function setUserPreference(payload: any): Promise<any> {
  try {
    const resp: any = await api({
      url: "service/setUserPreference",
      method: "post",
      data: payload
    });

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

const setUserLocale = async (payload: any): Promise<any> => {
  try {
    const resp: any = await api({
      url: "setUserLocale",
      method: "post",
      data: payload
    })

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data
    }
  } catch (error) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: error
    })
  }
}

const setUserTimeZone = async (payload: any): Promise<any> => {
  // TODO: add api support when available, currently we do not have an api to update userTimeZone
  return Promise.resolve({})
}

const getAvailableTimeZones = async (): Promise <any>  => {
  try {
    const resp: any = await api({
      url: "admin/user/getAvailableTimeZones",
      method: "get",
      cache: true
    });

    if (!hasError(resp)) {
      return Promise.resolve(resp.data.timeZones)
    } else {
      throw resp.data
    }
  } catch (error) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: error
    })
  }
}

async function getEComStoresByFacility(token: any, baseURL: string, vSize = 100, facilityId?: string): Promise<Response> {

  if (!facilityId) {
    return Promise.reject({
      code: 'error',
      message: 'FacilityId is missing',
      serverResponse: 'FacilityId is missing'
    });
  }

  const filters = {
    facilityId: facilityId
  } as any;

  const params = {
    "inputFields": {
      "storeName_op": "not-empty",
      ...filters
    },
    "viewSize": vSize,
    "fieldList": ["productStoreId", "storeName"],
    "entityName": "ProductStoreFacilityDetail",
    "distinct": "Y",
    "noConditionFind": "Y",
    "filterByDate": 'Y',
  };

  try {
    const resp = await client({
      url: `admin/facilities`,
      method: "get",
      baseURL,
      params,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (resp.status === 200 && !hasError(resp)) {
      return Promise.resolve(resp.data.docs);
    } else {
      throw resp.data
    }
  } catch(error) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
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
          "api_key": token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    if(!hasError(resp)) {
      // Filtering facilities on which thruDate is set, as we are unable to pass thruDate check in the api payload
      // Considering that the facilities will always have a thruDate of the past.
      const facilities = resp.data.filter((facility: any) => !facility.thruDate)

      if(!facilities.length) {
        throw "Failed to fetch facilities for group"
      }

      return Promise.resolve(facilities)
    } else {
      throw "Failed to fetch facilities for group"
    }
  } catch(err) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch facilities for group",
      serverResponse: resp.data
    })
  }
}

async function fetchFacilitiesByParty(partyId: string, baseURL?: string, token?: string, payload?: any): Promise <Array<any> | Response> {
  let params: RequestPayload = {
    url: `inventory-cycle-count/user/${partyId}/facilities`,
    method: "GET"
  }

  if(payload) {
    params["params"] = payload
  }

  let resp = {} as any;

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "api_key": token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }
    if(!hasError(resp)) {
      // Filtering facilities on which thruDate is set, as we are unable to pass thruDate check in the api payload
      // Considering that the facilities will always have a thruDate of the past.
      const facilities = resp.data.filter((facility: any) => !facility.thruDate)

      if(!facilities.length) {
        throw "Failed to fetch user associated facilities"
      }

      return Promise.resolve(facilities)
    } else {
      throw "Failed to fetch user associated facilities"
    }
  } catch(err) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch user associated facilities",
      serverResponse: resp.data
    })
  }
}

async function fetchFacilities(token?: string, baseURL?: string, partyId?: string, facilityGroupId?: string, isAdminUser?: boolean, payload?: Object): Promise <any> {
  let facilityIds: Array<string> = [];
  let filters: any = {};

  // Fetch the facilities associated with party
  if(partyId) {
    let resp = {} as any
    try {
      resp = await fetchFacilitiesByParty(partyId, baseURL, token)

      if(resp.code === "error") {
        throw "Failed to fetch user associated facilities"
      }

      facilityIds = resp.map((facility: any) => facility.facilityId);
    } catch(err) {
      return Promise.reject({
        code: "error",
        message: "Failed to fetch user associated facilities",
        serverResponse: resp.data
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

  // Fetch the facilities associated with party
  if(facilityGroupId) {
    let resp = {} as any
    try {
      resp = await fetchFacilitiesByGroup(facilityGroupId, baseURL, token, filters)

      if(resp.code === "error") {
        throw "Failed to fetch user associated facilities"
      }

      facilityIds = resp.map((facility: any) => facility.facilityId);
    } catch(err) {
      return Promise.reject({
        code: "error",
        message: "Failed to fetch user associated facilities",
        serverResponse: resp.data
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

  let resp = {} as any;
  let facilities: Array<any> = []

  try {
    if(token && baseURL) {
      params = {
        ...params,
        baseURL,
        headers: {
          "api_key": token,
          "Content-Type": "application/json"
        }
      }
  
      resp = await client(params);
    } else {
      resp = await api(params);
    }

    if(!hasError(resp)) {
      facilities = resp.data
    } else {
      throw "Failed to fetch facilities"
    }
  } catch(err) {
    return Promise.reject({
      code: "error",
      message: "Failed to fetch facilities",
      serverResponse: resp.data
    })
  }

  return Promise.resolve(facilities)
}

export default {
  fetchFacilities,
  fetchFacilitiesByParty,
  fetchFacilitiesByGroup,
  getAvailableTimeZones,
  setUserTimeZone
}