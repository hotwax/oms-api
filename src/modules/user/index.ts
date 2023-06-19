import api from "../../api";
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
        message: 'Something went wrong',
        serverResponse: 'Failed to fetch user profile information'
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

export {
  getProductIdentificationPref,
  getProfile,
  setProductIdentificationPref
}
