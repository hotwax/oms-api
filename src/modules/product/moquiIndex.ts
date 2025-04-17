import api from "../../api";
import { hasError } from "../../util";

const fetchGoodIdentificationTypes = async (parentTypeId = "HC_GOOD_ID_TYPE"): Promise <any>  => {
  try {
    const resp: any = await api({
      url: "oms/goodIdentificationTypes",
      method: "get",
      params: {
        parentTypeId
      }
    });

    if(!hasError(resp)) {
      return Promise.resolve(resp.data)
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

export default {
  fetchGoodIdentificationTypes
}