import api from '../../api'
import { Product } from '../../types/Product';

export async function getProductDetails (productId: string): Promise<any> {
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
        variants: variantsGroup // TODO: need to fetch the variant details
      }

      return product;
    }
  } catch (err) {
    console.error(err)
    return null
  }

  return null
}

