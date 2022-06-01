import api from '../../api'

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
      console.log(resp);
      return resp;
    }
  } catch (err) {
    console.error(err)
    return null
  }

  return null
}

