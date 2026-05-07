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

async function searchProducts(params: { keyword?: string, sort?: string, qf?: string, viewSize?: number, viewIndex?: number, filters?: any }): Promise<any> {
  const rows = params.viewSize ?? 100
  const start = rows * (params.viewIndex ?? 0)
  const keyword = params.keyword?.trim();

  const payload = {
    "json": {
      "params": {
        rows,
        start,
        "qf": "productId^20 productName^40 internalName^30 search_goodIdentifications parentProductName",
        "sort": "sort_productName asc",
        "defType": "edismax"
      },
      "query": "*:*",
      "filter": "docType: PRODUCT"
    }
  }

  let keywordString = ""

  if(keyword) {
    // When the searched keyword startWith \", we will consider that user want to make an exact search
    // otherwise we will tokenize the keyword
    if(keyword.startsWith('\"')) {
      // Using multiple replace function as replaceAll does not work due to module type
      keywordString = keyword.replace('\"', "").replace('\"', "");
    } else {
      // create string in the format, abc* OR xyz* or qwe*
      const keywordTokens = keyword.split(" ")
      const tokens: Array<string> = []

      keywordTokens.forEach((token: string) => {
        const regEx = /[`!@#$%^&*()_+\-=\\|,.<>?~]/
        if(regEx.test(token)) {
          const matchedTokens = [...new Set(token.match(regEx))]
          matchedTokens?.forEach((matchedToken: string) => {
            tokens.push(token.split(matchedToken).join(`\\\\${matchedToken}`))
          })
        } else {
          tokens.push(token)
        }
      })

      keywordString = tokens.join(`* ${OPERATOR.OR} `)
      // adding the original searched string with
      keywordString += `* ${OPERATOR.OR} \"${keyword}\"^100`
    }
  
    if(keywordString) {
      payload.json.query = `(${keywordString})`
    }
  } else {
    params.qf && (payload.json.params.qf = params.qf)
    params.sort && (payload.json.params.sort = params.sort)
  }

  if (params.filters) {
    Object.keys(params.filters).forEach((key: any) => {
      const filterValue = params.filters[key].value;

      if (Array.isArray(filterValue)) {
        const filterOperator = params.filters[key].op ? params.filters[key].op : OPERATOR.OR ;
        payload.json.filter += ` ${OPERATOR.AND} ${key}: (${filterValue.join(' ' + filterOperator + ' ')})`
      } else {
        payload.json.filter += ` ${OPERATOR.AND} ${key}: ${filterValue}`
      }
    })
  }

  if(!params.filters?.isVirtual) {
    payload.json.filter += ` ${OPERATOR.AND} isVirtual: false`
  }

  try {
    const resp = await api({
      url: "solr-query",
      method: "post",
      data: payload
    }) as any;

    if (resp.status == 200 && !hasError(resp) && resp.data?.response?.numFound > 0) {

      const product = resp.data.response.docs

      return {
        products: product,
        total: resp.data.response.numFound
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

export { fetchProducts, fetchProductsGroupedBy, fetchProductsGroupedByParent, omsFetchGoodIdentificationTypes, searchProducts }
