import api from "../../api";
import { hasError } from "../../util";

async function omsGetNotificationEnumIds(enumTypeId: string): Promise<any> {
  const payload = {
    "inputFields": {
      enumTypeId
    },
    "entityName": "Enumeration",
    "fieldList": ["description", "enumId", "enumTypeId", "enumName"],
    "viewSize": 200
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsGetNotificationUserPrefTypeIds(applicationId: string, userLoginId: string, filterConditions = {}): Promise<any> {
  const payload = {
    "inputFields": {
      "userPrefGroupTypeId": applicationId,
      userLoginId,
      ...filterConditions
    },
    "entityName": "UserPreference",
    "fieldList": ["userPrefTypeId", "userPrefGroupTypeId"],
    "viewSize": 200
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsStoreClientRegistrationToken(registrationToken: string, deviceId: string, applicationId: string): Promise<any> {
  const payload = {
    registrationToken,
    deviceId,
    applicationId
  }

  try {
    const resp = await api({
      url: "service/storeClientRegistrationToken",
      method: "post",
      data: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsRemoveClientRegistrationToken(deviceId: string, applicationId: string): Promise<any> {
  const payload = {
    deviceId,
    applicationId
  }

  try {
    const resp = await api({
      url: "service/removeClientRegistrationToken",
      method: "post",
      data: payload
    }) as any


    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsSubscribeTopic(topicName: string, applicationId: string): Promise<any> {
  const payload = {
    topicName,
    applicationId
  }

  try {
    const resp = await api({
      url: "service/subscribeTopic",
      method: "post",
      data: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function omsUnsubscribeTopic(topicName: string, applicationId: string): Promise<any> {
  const payload = {
    topicName,
    applicationId
  }

  try {
    const resp = await api({
      url: "service/unsubscribeTopic",
      method: "post",
      data: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data)
    } else {
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

export {
  omsGetNotificationEnumIds,
  omsGetNotificationUserPrefTypeIds,
  omsRemoveClientRegistrationToken,
  omsStoreClientRegistrationToken,
  omsSubscribeTopic,
  omsUnsubscribeTopic
}
