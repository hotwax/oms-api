import api from "../../api";
import { hasError } from "../../util";

const fetchGoodIdentificationTypes = async (parentTypeId = "HC_GOOD_ID_TYPE"): Promise <any>  => {
  try {
    const resp: any = await api({
      url: "oms/goodIdentificationTypes",
      method: "get",
      params: {
        parentTypeId,
        pageSize: 50
      }
    });

    return Promise.resolve(resp.data)
  } catch(error) {
    return Promise.reject({
      code: 'error',
      message: 'Failed to fetch good identification types',
      serverResponse: error
    })
  }
}

export default {
  fetchGoodIdentificationTypes
}