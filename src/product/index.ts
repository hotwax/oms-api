import api from '../../api'
import { Product, Response } from '../../types'

async function getProductDetails (productId: string): Promise<Product | Response> {
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

    if (resp?.status == 200 && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const group = resp.data.grouped.groupId.groups[0]
      const productDetails = group.doclist.docs[0]
      const imageUrls = productDetails.additionalImageUrls
      imageUrls.push(productDetails.mainImageUrl)
      const getVariantsDetail = await getVariant(productDetails.variantProductIds)

      const product: Product = {
        id: productDetails.productId,
        name: productDetails.productName, 
        description: productDetails.description,
        brand: productDetails.brandName,
        price: productDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
        sku: productDetails.sku,
        identifications: productDetails.goodIdentifications,
        /** An array containing assets like images and videos */
        assets: imageUrls,
        mainImage: productDetails.mainImageUrl,
        parentProductId: productDetails.parentProductName,
        type: productDetails.productTypeId, // TODO: need to fetch the type description
        category: productDetails.productCategoryNames,
        feature: productDetails.productFeatures,
        variants: getVariantsDetail, // TODO: need to fetch the variant details
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

async function findProducts(payload: any): Promise<object> {
  const query = {
      "json": {
        "params": {
          "group": true,
          "group.field": `groupId`,
          "group.limit": 10000,
          "group.ngroups": true,
          "rows": payload.json.params.rows,
          "start": payload.json.params.start
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

    if (resp?.status == 200 && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const groups = resp.data.grouped.groupId.groups

      const products = groups.map((group: any) => {
        if (group.groupValue !== null) {
          const productDetails = group.doclist.docs[0]

          const imageUrls = productDetails.additionalImageUrls
          imageUrls.push(productDetails.mainImageUrl)
  
          const variantsGroup: Array<any> = group.doclist.docs.map((variant: any) => {
            variant = {
              id: variant.productId,
              name: variant.productName, 
              description: variant.description,
              brand: variant.brandName,
              price: variant.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
              sku: variant.sku,
              identifications: variant.goodIdentifications,
              /** An array containing assets like images and videos */
              assets: imageUrls,
              mainImage: variant.mainImageUrl,
              parentProductId: variant.parentProductName,
              type: variant.productTypeId, // TODO: need to fetch the type description
              category: variant.productCategoryNames,
              feature: variant.productFeatures,
              isVirtual: productDetails.isVirtual,
              isVariant: productDetails.isVariant
            }
            return variant
          })
    
          const product: Product = {
            id: productDetails.productId,
            name: productDetails.productName, 
            description: productDetails.description,
            brand: productDetails.brandName,
            price: productDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
            sku: productDetails.sku,
            identifications: productDetails.goodIdentifications,
            /** An array containing assets like images and videos */
            assets: imageUrls,
            mainImage: productDetails.mainImageUrl,
            parentProductId: productDetails.parentProductName,
            type: productDetails.productTypeId, // TODO: need to fetch the type description
            category: productDetails.productCategoryNames,
            feature: productDetails.productFeatures,
            variants: variantsGroup, // TODO: need to fetch the variant details
            isVirtual: productDetails.isVirtual,
            isVariant: productDetails.isVariant
          }        
          return product;
        } else return null
      })  

      return { products: products, totalVirtual: resp.data.grouped.groupId.ngroups, totalVariant: resp.data.grouped.groupId.matches }
    }
  } catch (err) {
    console.error(err)
    return response = {
      code: 'error',
      message: 'something went wrong',
      serverResponse: err
    }
  }

  return response
}

async function getVariant(variantProductIds: Array<string>): Promise<Array<any>> {
  let variants: Array<Product> = []

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

    if (resp?.status == 200 && resp.data?.grouped?.groupId?.groups?.length > 0) {
      const variantProductGroup = resp.data.grouped.groupId.groups[0]
      const variantProducts = variantProductGroup.doclist.docs

      variantProducts.map((variantProductDetails: any) => {
        const urls = variantProductDetails.additionalImageUrls
        urls.push(variantProductDetails.mainImageUrl)

        const details: Product = {
          id: variantProductDetails.productId,
          name: variantProductDetails.productName, 
          description: variantProductDetails.description,
          brand: variantProductDetails.brandName,
          price: variantProductDetails.BASE_PRICE_PURCHASE_USD_NN_STORE_GROUP_price,
          sku: variantProductDetails.sku,
          identifications: variantProductDetails.goodIdentifications,
          /** An array containing assets like images and videos */
          assets: urls,
          mainImage: variantProductDetails.mainImageUrl,
          parentProductId: variantProductDetails.parentProductName,
          type: variantProductDetails.productTypeId, // TODO: need to fetch the type description
          category: variantProductDetails.productCategoryNames,
          feature: variantProductDetails.productFeatures,
          isVirtual: variantProductDetails.isVirtual,
          isVariant: variantProductDetails.isVariant
        }
        variants.push(details)
      });
    }
  } catch (err) {
    console.log(err);
  }    
  return variants
}

export {
  getProductDetails,
  findProducts,
}