import api from '../../api'
import { Product } from '../../types/Product';

export async function getProductDetails (productId: string): Promise<any> {
  const payload = {
    "json": {
      "query": "*:*",
      "filter": `docType: PRODUCT AND productId: ${productId}`
    }
  }

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200) {

      const productDetails = resp.data.response.docs[0];
      const imageUrls = productDetails.additionalImageUrls
      imageUrls.push(productDetails.mainImageUrl)

      const product: Product = {
        productId: productDetails.productId,
        productName: productDetails.productName, 
        description: productDetails.description,
        brand: productDetails.brandName,
        sku: productDetails.sku,
        identifications: productDetails.goodIdentifications, 
        /** An array containing assets like images and videos */
        assets: imageUrls,
        mainImage: productDetails.mainImageUrl,
        parentProductId: productDetails.parentProductName,
        type: productDetails.productTypeId, // TODO: need to fetch the type description
        category: productDetails.productCategoryNames,
        feature: productDetails.productFeatures,
        variants: productDetails.variantProductId // TODO: need to fetch the variant details
      }

      return product;
    }
  } catch (err) {
    console.error(err)
    return null
  }

  return null
}

