import api, { client } from "../../api";
import { RequestPayload, Response } from "../../types";
import { hasError } from "../../util";

const setUserTimeZone = async (): Promise<any> => {
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

async function updateUserPreference(userId: string, preferenceKey: string, preferenceValue: string): Promise<any> {
  try {
    const resp = await client({
      url: "admin/user/preferences",
      method: "PUT",
      data: {
        userId,
        preferenceKey,
        preferenceValue,
      },
    });
    if(hasError(resp)) throw "Error updating user preference";
    return Promise.resolve(resp.data)
  } catch(error: any) {
    return Promise.reject(error)
  }
}

export default {
  fetchFacilities,
  fetchFacilitiesByParty,
  fetchFacilitiesByGroup,
  getAvailableTimeZones,
  setUserTimeZone,
  updateUserPreference
}