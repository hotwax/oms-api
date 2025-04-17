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

    if (!hasError(resp)) {
      return resp.data;
    } else {
      throw resp.data
    }
  } catch (error) {
    return []
  }
}

export default {
  fetchGoodIdentificationTypes
}