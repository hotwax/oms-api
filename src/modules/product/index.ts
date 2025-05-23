import api from "../../api";
import { OPERATOR, Product, Response } from "../../types";
import { hasError, isError } from "../../util";
import { transform } from 'node-json-transform'
import { productTransformRule } from "../../mappings/product";

async function fetchProducts(params: any): Promise<any | Response> {

  const payload = {
    "json": {
      "params": {
        "rows": params.viewSize,
        "start": params.viewIndex
      },
      "query": "*:*",
      "filter": "docType: PRODUCT"
    } as any
  }

  const queryFields = params.queryFields ? params.queryFields : "productId productName internalName";

  // checking that if the params has filters, and then adding the filter values in the payload filter
  // for each key present in the params filters
  if (params.filters) {
    Object.keys(params.filters).map((key: any) => {
      const filterValue = params.filters[key].value;

      if (Array.isArray(filterValue)) {
        const filterOperator = params.filters[key].op ? params.filters[key].op : OPERATOR.OR ;
        payload.json.filter += ` ${OPERATOR.AND} ${key}: (${filterValue.join(' ' + filterOperator + ' ')})`
      } else {
        payload.json.filter += ` ${OPERATOR.AND} ${key}: ${filterValue}`
      }
    })
  }

  if (params.queryString) {
    // TODO: need to check how to handle the case when we want to make exact search match
    payload.json.query = `(*${params.queryString}*)`
    payload.json.params['qf'] = queryFields
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

      const product: Array<Product> = transform(resp.data.response.docs, productTransformRule)

      return {
        products: product,
        total: resp.data?.response?.numFound
      }
    } else {
      return {
        products: {},
        total: 0
      }
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function fetchProductsGroupedBy(params: any): Promise<any | Response> {

  const payload = {
    "json": {
      "params": {
        "group": true,
        "group.field": params.groupField,
        "group.limit": params.groupLimit ? params.groupLimit : 10000,
        "group.ngroups": params.ngroups ? params.ngroups : true,
        "rows": params.viewSize,
        "start": params.viewIndex,
        "q.op": OPERATOR.AND
      },
      "query": "*:*",
      "filter": "docType: PRODUCT"
    } as any
  }

  const queryFields = params.queryFields ? params.queryFields : "productId productName internalName";

  // checking that if the params has filters, and then adding the filter values in the payload filter
  // for each key present in the params filters
  if (params.filters) {
    Object.keys(params.filters).map((key: any) => {
      const filterValue = params.filters[key].value;

      if (Array.isArray(filterValue)) {
        const filterOperator = params.filters[key].op ? params.filters[key].op : OPERATOR.OR ;
        payload.json.filter += ` ${OPERATOR.AND} ${key}: (${filterValue.join(' ' + filterOperator + ' ')})`
      } else {
        payload.json.filter += ` ${OPERATOR.AND} ${key}: ${filterValue}`
      }
    })
  }

  if (params.queryString) {
    // TODO: need to check how to handle the case when we want to make exact search match
    payload.json.query = `(*${params.queryString}*)`
    payload.json.params['qf'] = queryFields
    payload.json.params['defType'] = "edismax"
  }

  try {
    const resp = await api({
      url: "solr-query",
      method: "get",
      params: payload,
      cache: true
    }) as any;

    if (resp.status == 200 && !hasError(resp) && resp.data?.grouped?.groupId.ngroups > 0) {

      const products = resp.data.grouped.groupId.groups.map((group: any) => {
        const variants: Array<Product> = transform(group.doclist.docs, productTransformRule)
        return {
          groupValue: group.groupValue,
          variants
        }
      })

      return {
        products,
        matches: resp.data?.grouped?.groupId.matches,
        ngroups: resp.data?.grouped?.groupId.ngroups
      }
    } else {
      return {
        products: {},
        matches: 0,
        ngroups: 0
      }
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

async function fetchProductsGroupedByParent(params: any): Promise<Product[] | Response> {

  const payload = {
    ...params,
    "groupField": "groupId",
    "groupLimit": 10000,
    "ngroups": true
  }

  return await fetchProductsGroupedBy(payload);
}

async function omsFetchGoodIdentificationTypes(parentTypeId: string = "HC_GOOD_ID_TYPE"): Promise<any> {
  const payload = {
    "inputFields": {
      "parentTypeId": parentTypeId,
    },
    "fieldList": ["goodIdentificationTypeId", "description"],
    "viewSize": 50,
    "entityName": "GoodIdentificationType",
    "noConditionFind": "Y"
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
      throw resp.data;
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

export { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent, omsFetchGoodIdentificationTypes }
