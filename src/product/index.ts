import api from "../../api";
import { Product, Response } from "../types";
import { hasError } from "../util";
import { DataTransform } from 'node-json-transform'
import { productsTransformRule } from "../mappings/product";

export async function fetchProducts(productIds: Array<string>): Promise<Product[] | Response> {
  let response = {} as Product[] | Response

  const payload = {
    "json": {
      "params": {
        "rows": productIds.length
      },
      "query": "*:*",
      "filter": `docType: PRODUCT AND productId: (${productIds.join(' OR ')})`
    }
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
