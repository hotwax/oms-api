import api from "../../api";
import { hasError } from "../../util";

async function getNotificationEnumIds(enumTypeId: string): Promise<any> {
  const payload = {
    "inputFields": {
      enumTypeId
    },
    "entityName": "Enumeration",
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data.docs)
    } else {
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
  }
}

async function getNotificationUserPrefTypeIds(applicationId: string): Promise<any> {
  const payload = {
    "inputFields": {
      "userPrefGroupTypeId": applicationId
    },
    "entityName": "UserPreference",
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "get",
      params: payload
    }) as any

    if (!hasError(resp)) {
      return Promise.resolve(resp.data.docs)
    } else if (resp.data.error === 'No record found') {
      // the API fails if no record is found, hence externally
      // handling the case
      return Promise.resolve([])
    } else {
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
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
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
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
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
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
      return Promise.resolve(resp)
    } else {
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
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
      return Promise.resolve(resp)
    } else {
      return Promise.reject(resp)
    }
  } catch (err) {
    console.error(err)
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
