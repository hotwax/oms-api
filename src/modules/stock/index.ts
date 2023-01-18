import api from "@/api";
import { hasError } from "@/util";
import { Stock, Response, OPERATOR } from "@/types"
import { transform } from "node-json-transform";
import { stockTransformRule } from "@/mappings/stock";

// TODO: define params types
/*
Finds the inventory for multiple/single product at multiple/single/0 (zero) facility
When facilityId is not being passed then stock for all the facilities will be fetched separately
*/
async function fetchProductsStockAtFacility(params: any): Promise<Array<Stock> | Response> {
  // There is a limitation at API level to handle only 100 records
  // but as we will always fetch data for the fetched records which will be as per the viewSize
  // assuming that the value will never be 100 to show

  const query = {
    "viewSize": 1, // initializing viewSize as 1, because at least we need one record in case of success
    "fieldsToSelect": ["productId", "atp", "facilityId"]
  } as any

  Object.keys(params).map((key) => {

    const paramValue = params[key].value;
    query.filters[key] = paramValue

    if(Array.isArray(paramValue)) {
      // calculating the viewSize by multiplying the length of params value with the current view Size
      query.viewSize *= paramValue.length
      query.filters[`${key}_op`] = OPERATOR.IN
    }
  })

  // When not having facilityId in filters, then multiplying the viewSize by 10, assuming that the inventory
  // for a product will be at most available on 10 facilities
  if(!query.filters.facilityId) {
    query.viewSize *= 10
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

/*
Fetches sum of stock for products on all the facilities
*/
async function fetchProductsStock(productIds: Array<string>): Promise<Array<Stock> | Response> {
  // There is a limitation at API level to handle only 100 records
  // but as we will always fetch data for the fetched records which will be as per the viewSize
  // assuming that the value will never be 100 to show

  const query = {
    "filters": {
      "productId": productIds,
      "productId_op": OPERATOR.IN
    },
    "viewSize": productIds.length,
    "fieldsToSelect": ["productId", "atp"]
  } as any

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

export { fetchProductsStock, fetchProductsStockAtFacility }