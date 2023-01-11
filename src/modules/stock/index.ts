import api from "@/api";
import { hasError } from "@/util";
import { Stock, Response } from "@/types"
import { transform } from "node-json-transform";
import { stockTransformRule } from "@/mappings/stock";

async function fetchProductsStockAsPerFacility(productIds: Array<string>, facilityId?: string): Promise<Array<Stock> | Response> {
  // There is a limitation at API level to handle only 100 records
  // but as we will always fetch data for the fetched records which will be as per the viewSize
  // assuming that the value will never be 100 to show

  // When facility is not being passed stock for all the facilities will be fetched
  const query = {
    "filters": {
      "productId": productIds,
      "productId_op": "in"
    },
    "viewSize": productIds.length,
    "fieldsToSelect": ["productId", "atp", "facilityId"]
  } as any

  // support to get stock for a specific facility
  if (facilityId) {
    query.filters["facilityId"] = facilityId
    query.fieldsToSelect = ["productId", "atp"]
  }

  try {
    const resp = await api({
      url: "checkInventory",
      method: "post",
      data: query
    }) as any;

    if (resp.status === 200 && !hasError(resp) && resp.data.count > 0) {
      const productsStock: Array<Stock> = transform(resp.data.docs, stockTransformRule)

      return Promise.resolve(productsStock)
    } else {
      return Promise.reject({
        code: "error",
        message: "Unable to find the stock for products",
        serverResponse: ""
      })
    }
  } catch(err) {
    return Promise.reject({
      code: "error",
      message: "Something went wrong",
      serverResponse: err
    })
  }
}

export { fetchProductsStockAsPerFacility }