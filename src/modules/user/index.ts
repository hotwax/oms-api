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
    "fieldList": ["fromDate"],
    "viewSize": 1
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: payload,
      cache: true
    }) as any;
    if(resp.status == 200 && resp.data.count > 0) {
      fromDate = resp.data.docs[0].fromDate
    }
  } catch(err) {
    console.error(err)
  }

  // when selecting none as ecom store, not updating the pref as it's not possible to save pref with empty productStoreId
  if(!eComStoreId || !fromDate) {
    return Promise.reject('eComStoreId or fromDate information is missing');
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

    if(resp.status == 200) {
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

  // when selecting none as ecom store, not fetching the pref as it returns all the entries with the pref id
  if(!eComStoreId) {
    return productIdentifications;
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
      method: "post",
      data: payload,
      cache: true
    }) as any;

    if(resp.status == 200 && resp.data.count > 0) {
      const respValue = JSON.parse(resp.data.docs[0].settingValue)
      productIdentifications['primaryId'] = respValue['primaryId']
      productIdentifications['secondaryId'] = respValue['secondaryId']
    } else if(resp.status == 200 && resp.data.error) {
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
