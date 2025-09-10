import api, { client } from "../../api";
import { userProfileTransformRule } from "../../mappings/user";
import { Response, User } from "../../types";
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

async function omsSetProductIdentificationPref(eComStoreId: string, productIdentificationPref: any): Promise<any> {

  let isSettingExists = false;

  const payload = {
    "inputFields": {
      "productStoreId": eComStoreId,
      "settingTypeEnumId": "PRDT_IDEN_PREF"
    },
    "entityName": "ProductStoreSetting",
    "fieldList": ["productStoreId", "settingTypeEnumId"],
    "viewSize": 1
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload,
      cache: true
    }) as any;
    if(!hasError(resp) && resp.data.docs?.length) {
      isSettingExists = true
    }
  } catch(err) {
    console.error(err)
  }

  // when fromDate is not found then reject the call with a message
  if(!isSettingExists) {
    return Promise.reject('product store setting is missing');
  }

  const params = {
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

async function omsCreateProductIdentificationPref(eComStoreId: string): Promise<any> {
  const prefValue = {
    primaryId: 'productId',
    secondaryId: ''
  }

  const params = {
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

async function omsGetProductIdentificationPref(eComStoreId: string): Promise<any> {

  const productIdentifications = {
    'primaryId': 'productId',
    'secondaryId': ''
  }

  const payload = {
    "inputFields": {
      "productStoreId": eComStoreId,
      "settingTypeEnumId": "PRDT_IDEN_PREF"
    },
    "entityName": "ProductStoreSetting",
    "fieldList": ["settingValue", "settingTypeEnumId"],
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
      await omsCreateProductIdentificationPref(eComStoreId)
    }
  } catch(err) {
    console.error(err)
  }

  return productIdentifications
}


async function logout(): Promise<any> {
  try {
    const resp: any = await api({
      url: "logout",
      method: "get"
    });

    if(resp.status != 200) {
      throw resp.data;
    }

    return Promise.resolve(resp.data)
  } catch(err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsGetUserFacilities(token: any, baseURL: string, partyId: string, facilityGroupId: any, isAdminUser = false, payload?: any): Promise<any> {
  try {
    const params = {
      "inputFields": {} as any,
      "filterByDate": "Y",
      "viewSize": 200,
      "distinct": "Y",
      "noConditionFind" : "Y",
    } as any
    
    if (facilityGroupId) {
      params.entityName = "FacilityGroupAndParty";
      params.fieldList = ["facilityId", "facilityName", "sequenceNum", "facilityTypeId"];
      params.fromDateName = "FGMFromDate";
      params.thruDateName = "FGMThruDate";
      params.orderBy = "sequenceNum ASC | facilityName ASC";
      params.inputFields["facilityGroupId"] = facilityGroupId;
    } else {
      params.entityName = "FacilityAndParty";
      params.fieldList = ["facilityId", "facilityName", "facilityTypeId"];
      params.inputFields["facilityParentTypeId"] = "VIRTUAL_FACILITY";
      params.inputFields["facilityParentTypeId_op"] = "notEqual";
      params.orderBy = "facilityName ASC";
    }
    if (!isAdminUser) {
      params.inputFields["partyId"] = partyId;
    }
    let resp = {} as any;
    resp = await client({
      url: "performFind",
      method: "get",
      baseURL,
      params,
      headers: {
        Authorization:  'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });
    if (resp.status === 200 && !hasError(resp)) {
      return Promise.resolve(resp.data.docs);
    } else {
      return Promise.reject({
        code: 'error',
        message: 'Failed to fetch user facilities',
        serverResponse: resp.data
      })
    }
  } catch(error: any) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: error
    })

  }
}

async function omsGetUserPreference(token: any, baseURL: string, userPrefTypeId: string): Promise<any> {
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

async function omsSetUserPreference(payload: any): Promise<any> {
  try {
    const resp: any = await api({
      url: "service/setUserPreference",
      method: "post",
      data: {
        userPrefTypeId: payload.userPrefTypeId,
        userPrefValue: payload.userPrefValue,
      }
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

const omsSetUserLocale = async (payload: any): Promise<any> => {
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

const omsSetUserTimeZone = async (payload: any): Promise<any> => {
  try {
    const resp: any = await api({
      url: "setUserTimeZone",
      method: "post",
      data: payload
    });

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

const omsGetAvailableTimeZones = async (): Promise <any>  => {
  try {
    const resp: any = await api({
      url: "getAvailableTimeZones",
      method: "get",
      cache: true
    });

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

async function omsGetEComStoresByFacility(token: any, baseURL: string, vSize = 100, facilityId?: string): Promise<Response> {

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
    "fieldList": ["productStoreId", "storeName", "productIdentifierEnumId"],
    "entityName": "ProductStoreFacilityDetail",
    "distinct": "Y",
    "noConditionFind": "Y",
    "filterByDate": 'Y',
  };

  try {
    const resp = await client({
      url: "performFind",
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

async function omsGetEComStores(token: any, baseURL: string, vSize = 100): Promise<any> {
  const params = {
    "viewSize": vSize,
    "fieldList": ["productStoreId", "storeName", "productIdentifierEnumId"],
    "entityName": "ProductStore",
    "distinct": "Y",
    "noConditionFind": "Y"
  };

  try {
    const resp = await client({
      url: "performFind",
      method: "get",
      baseURL,
      params,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }) as any;
    if(!hasError(resp)) {
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

export {
  getProfile,
  logout,
  omsGetAvailableTimeZones,
  omsGetUserFacilities,
  omsGetEComStoresByFacility,
  omsGetEComStores,
  omsGetProductIdentificationPref,
  omsGetUserPreference,
  omsSetProductIdentificationPref,
  omsSetUserPreference,
  omsSetUserLocale,
  omsSetUserTimeZone
}
