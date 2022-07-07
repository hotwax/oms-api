import api from "../../api";
import { Product, Response } from "../types";
import { hasError } from "../util";
import { DataTransform } from 'node-json-transform'
import { productsTransformRule } from "../mappings/product";

export async function fetchProducts(params: any): Promise<any | Response> {
  let response = {} as Product[] | Response

  const payload = {
    "json": {
      "params": {
        "rows": params.viewSize,
        "start": params.viewIndex
      },
      "query": "*:*",
      "filter": `docType: PRODUCT`
    } as any
  }

  // checking that if the params has filters, and then adding the filter values in the payload filter
  // for each key present in the params filters
  if (params.filters) {
    Object.keys(params.filters).map((key: any) => {

      if ((params.filters[key]).constructor === Array) {
        // TODO: need to check how to handle the condition when we want to do AND on values
        payload.json.filter += ` AND ${key}: (${params.filters[key].join(' OR ')})`
      } else {
        payload.json.filter += ` AND ${key}: ${params.filters[key]}`
      }
    })
  }

  if (params.queryString) {
    // TODO: need to check how to handle the case when we want to make exact search match
    payload.json.query = `(*${params.queryString}*)`
    payload.json.params['qf'] = "productId productName internalName"
    payload.json.params['defType'] = "edismax"
  }

  try {
    const resp = await api({
      url: "solr-query",
      method: "post",
      data: payload,
      cache: true
    }) as any;

    if (resp.status == 200 && !hasError(resp) && resp.data?.response?.numFound > 0) {

      const productsTransform: any =  new (DataTransform as any)(resp.data.response.docs, productsTransformRule)
      const product: Array<Product> = productsTransform.transform()
      return {
        products: product,
        totalProductsCount: resp.data?.response?.numFound
      }
    } else {
      response = {
        code: 'error',
        message: `Unable to fetch product details`,
        serverResponse: resp
      }
    }
  } catch (err) {
    response = {
      code: 'error',
      message: `Something went wrong`,
      serverResponse: err
    }
  }

  return response;
}

export async function fetchProduct(productId: string): Promise<Product | Response> {
  let response = {} as Product | Response

  const payload = {
    "filters": ['productId: (' + productId + ')'],
    "viewSize": productId.length
  }

  try {
    const resp = await api({
      url: "searchProducts",
      method: "post",
      data: payload,
      cache: true
    }) as any;

    if (resp.status == 200 && !hasError(resp) && resp.data?.response?.numFound > 0) {

      const productsTransform: any =  new (DataTransform as any)({ ...resp.data.response.docs[0] }, productsTransformRule)
      const product: Product = productsTransform.transform()
      return product
    } else {
      response = {
        code: 'error',
        message: `Unable to fetch product details`,
        serverResponse: resp
      }
    }
  } catch (err) {
    response = {
      code: 'error',
      message: `Something went wrong`,
      serverResponse: err
    }
  }

  return response;
}

export async function findProductFeatureTypeDetails (ids: Array<string>): Promise<any | Response> {
  let response = {} as any | Response

  const payload = {
    'inputFields': {
      'productFeatureId': ids,
      'productFeatureId_op': 'in'
    },
    'entityName': 'ProductFeatureAndType',
    'noConditionFind': 'Y',
    'viewSize': ids.length
  }

  try {
    const resp = await api({
      url: "performFind",
      method: "post",
      data: payload
    }) as any;

    if (resp.status == 200 && !hasError(resp) && resp.data?.docs?.length > 0) {
      // TODO: add tranformation rule and return the transformed result
      response = resp.data.docs;
    } else {
      response = {
        code: 'error',
        message: `Unable to fetch product feature type details`,
        serverResponse: resp
      }
    }

  } catch (err) {
    response = {
      code: 'error',
      message: `Something went wrong`,
      serverResponse: err
    }
  }

  return response
}
