import api, { client } from "../../api";
import { userProfileTransformRule } from "../../mappings/user";
import { Response, User } from "../../types";
import { hasError } from "../../util";
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
        serverResponse: 'Something went wrong'
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
      return Promise.reject(resp)
    }
  } catch(err) {
   return Promise.reject(err)
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
    return Promise.reject(err)
  }
}

async function getUserFacilities(token: any, baseURL: string, partyId: string, facilityGroupId: any, isAdminUser = false): Promise<any> {
  
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
      params.fieldList = ["facilityId", "facilityName", "sequenceNum"];
      params.fromDateName = "FGMFromDate";
      params.thruDateName = "FGMThruDate";
      params.orderBy = "sequenceNum ASC | facilityName ASC";
      params.inputFields["facilityGroupId"] = facilityGroupId;
    } else {
      params.entityName = "FacilityAndParty";
      params.fieldList = ["facilityId", "facilityName"];
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
        serverResponse: 'Something went wrong'
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
    return Promise.resolve(resp.data.userPrefValue ? JSON.parse(resp.data.userPrefValue) : {});
  } catch (err) {
    return Promise.reject(err)
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
    return Promise.reject(err)
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
    return Promise.reject(error)
  }
}

export {
  getUserFacilities,
  getUserPreference,
  getProductIdentificationPref,
  getProfile,
  logout,
  setProductIdentificationPref,
  setUserPreference,
  setUserLocale
}