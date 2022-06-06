import api from '../../api'
import { Product, Response } from '../../types'
import { hasError } from '../util'

export async function getProductDetails (productId: string): Promise<Product | Response> {
  const query = {
    "json": {
      "params": {
        "group": true,
        "group.field": `groupId`,
        "group.limit": 10000,
        "group.ngroups": true,
        "rows":10
      } as any,
      "query": "*:*",
      "filter": `docType: PRODUCT AND productId: ${productId}`
    }
  }

  let response = {} as Product | Response

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'post',
      data: query
    })

    if (resp?.status == 200 && !hasError(resp) && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const productDetails = resp.data.grouped.groupId.groups[0].doclist.docs[0]
      let getVariantsDetail = undefined

      // fetching variant information only when the current fetched product is a virtual product
      if (productDetails.isVirtual === "true") {
        getVariantsDetail = await getVariant(productDetails.variantProductIds)
      }

      const product: Product = {
        id: productDetails.productId,
        name: productDetails.productName,
        description: productDetails.description,
        brand: productDetails.brandName,
        price: productDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
        sku: productDetails.sku,
        identifications: productDetails.goodIdentifications,
        /** An array containing assets like images and videos */
        assets: productDetails.additionalImageUrls,
        mainImage: productDetails.mainImageUrl,
        parentProductId: productDetails.parentProductName,
        type: productDetails.productTypeId, // TODO: need to fetch the type description
        category: productDetails.productCategoryNames,
        feature: productDetails.productFeatures,
        variants: getVariantsDetail,
        isVirtual: productDetails.isVirtual,
        isVariant: productDetails.isVariant
      }

      return product;
    } else {
      response = {
        code: 'error',
        message: `Unable to fetch product details for productId: ${productId}`,
        serverResponse: resp
      }
    }
  } catch (err) {
    console.error(err)
    response = {
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    }
  }

  return response
}

export async function findProducts(payload: any): Promise<object> {
  const query = {
    "json": {
      "params": {
        "group": true,
        "group.field": `groupId`,
        "group.limit": 10000,
        "group.ngroups": true,
        "rows": payload.rows,
        "start": payload.start
      } as any,
      "query": "*:*",
      "filter": `docType: PRODUCT`
    }
  }

  let response = {} as Product | Response

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'post',
      data: query
    })

    if (resp?.status == 200 && !hasError(resp) && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const groups = resp.data.grouped.groupId.groups

      const products = groups.map((group: any) => {
        if (group.groupValue !== null) {
          const productDetails = group.doclist.docs[0]

          const variants: Array<Product> = group.doclist.docs.map((variant: any) => ({
            id: variant.productId,
            name: variant.productName, 
            description: variant.description,
            brand: variant.brandName,
            price: variant.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
            sku: variant.sku,
            identifications: variant.goodIdentifications,
            /** An array containing assets like images and videos */
            assets: variant.additionalImageUrls,
            mainImage: variant.mainImageUrl,
            parentProductId: variant.parentProductName,
            type: variant.productTypeId, // TODO: need to fetch the type description
            category: variant.productCategoryNames,
            feature: variant.productFeatures,
            isVirtual: variant.isVirtual,
            isVariant: variant.isVariant
          }))
    
          const product: Product = {
            id: productDetails.productId,
            name: productDetails.productName, 
            description: productDetails.description,
            brand: productDetails.brandName,
            price: productDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
            sku: productDetails.sku,
            identifications: productDetails.goodIdentifications,
            /** An array containing assets like images and videos */
            assets: productDetails.additionalImageUrls,
            mainImage: productDetails.mainImageUrl,
            parentProductId: productDetails.parentProductName,
            type: productDetails.productTypeId, // TODO: need to fetch the type description
            category: productDetails.productCategoryNames,
            feature: productDetails.productFeatures,
            variants: variants, // TODO: need to fetch the variant details
            isVirtual: productDetails.isVirtual,
            isVariant: productDetails.isVariant
          }        
          return product;
        }
      })

      return { products: products, totalVirtual: resp.data.grouped.groupId.ngroups, totalVariant: resp.data.grouped.groupId.matches }
    } else {
      response = {
        code: 'error',
        message: 'Unable to fetch product details',
        serverResponse: resp
      }
    }
  } catch (err) {
    console.error(err)
    response = {
      code: 'error',
      message: 'something went wrong',
      serverResponse: err
    }
  }

  return response
}

async function getVariant(variantProductIds: Array<string>): Promise<Array<Product> | Response> {
  let response = {} as Array<Product> | Response

  const payload: object = {
    "json": {
      "params": {
        "group": true,
        "group.field": `groupId`,
        "group.limit": 10000,
        "group.ngroups": true,
        "rows":10
      } as any,
      "query": "*:*",
      "filter": `docType: PRODUCT AND productId: (${variantProductIds.join(" OR ")})`
    }
  }

  try {
    const resp: any = await api({
      url: 'solr-query',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200 && !hasError(resp) && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const variantProducts = resp.data.grouped.groupId.groups[0].doclist.docs

      const variants: Array<Product> = variantProducts.map((variantProductDetails: any) => ({
        id: variantProductDetails.productId,
        name: variantProductDetails.productName, 
        description: variantProductDetails.description,
        brand: variantProductDetails.brandName,
        price: variantProductDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
        sku: variantProductDetails.sku,
        identifications: variantProductDetails.goodIdentifications,
        /** An array containing assets like images and videos */
        assets: variantProductDetails.additionalImageUrls,
        mainImage: variantProductDetails.mainImageUrl,
        parentProductId: variantProductDetails.parentProductName,
        type: variantProductDetails.productTypeId, // TODO: need to fetch the type description
        category: variantProductDetails.productCategoryNames,
        feature: variantProductDetails.productFeatures,
        isVirtual: variantProductDetails.isVirtual,
        isVariant: variantProductDetails.isVariant
      }));
      return variants
    } else {
      response = {
        code: 'error',
        message: 'Unable to fetch product details',
        serverResponse: resp
      }
    }
  } catch (err) {
    console.error(err);
    response = {
      code: 'error',
      message: 'Unable to fetch product details',
      serverResponse: err
    }
  }    
  return response
}
