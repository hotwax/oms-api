import api from "../../api";
import { hasError } from "../../util";

async function getNotificationEnumIds(enumTypeId: string): Promise<any> {
  const payload = {
    "inputFields": {
      enumTypeId
    },
    "entityName": "Enumeration",
    "fieldList": ["description", "enumId", "enumTypeId", "enumName"],
    "viewSize": 20
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
    return Promise.reject(err)
  }
}

async function getNotificationUserPrefTypeIds(applicationId: string, userLoginId: string): Promise<any> {
  const payload = {
    "inputFields": {
      "userPrefGroupTypeId": applicationId,
      userLoginId
    },
    "entityName": "UserPreference",
    "fieldList": ["userPrefTypeId", "userPrefGroupTypeId"],
    "viewSize": 20
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
    return Promise.reject(err)
  }
}

async function storeClientRegistrationToken(registrationToken: string, deviceId: string, applicationId: string): Promise<any> {
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
    return Promise.reject(err)
  }
}

async function removeClientRegistrationToken(deviceId: string, applicationId: string): Promise<any> {
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
    return Promise.reject(err)
  }
}

async function subscribeTopic(topicName: string, applicationId: string): Promise<any> {
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
    return Promise.reject(err)
  }
}

async function unsubscribeTopic(topicName: string, applicationId: string): Promise<any> {
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
    return Promise.reject(err)
  }
}

export {
  getNotificationEnumIds,
  getNotificationUserPrefTypeIds,
  removeClientRegistrationToken,
  storeClientRegistrationToken,
  subscribeTopic,
  unsubscribeTopic
}
