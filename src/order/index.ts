import api from '../../api'
import { Order, OrderItem } from '../../types'

export async function getOrderDetails (orderId: string): Promise<Order | null> {
  const payload = {
    "json": {
      "params": {
        "group": true,
        "group.field": "orderId",
        "group.limit": 10000,
        "q.op": "AND"
      } as any,
      "query": "*:*",
      "filter": `docType: ORDER AND orderTypeId: SALES_ORDER AND orderId: ${orderId}`
    }
  }

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200 && resp.data?.grouped?.orderId?.groups?.length > 0) {
      const group = resp.data.grouped.orderId.groups[0]
      const orderDetails = group.doclist.docs[0]
      const order: Order = {
        orderId: orderDetails.orderId,
        orderName: orderDetails.orderName,
        customer: {
          id: orderDetails.customerPartyId,
          name: orderDetails.customerPartyName,
          email: orderDetails.customerEmailId
        },
        items: group.doclist.docs.map((item: any) => ({
          orderItemGroupId: item.orderItemSeqId,
          productId: item.productId,
          quantity: item.quantity,
          statusId: item.orderItemStatusId
        })) as OrderItem[],
        statusId: orderDetails.orderStatusId,
        statusDesc: orderDetails.orderStatusDesc,
        identifications: orderDetails.orderIdentifications,
      }
      return order;
    }
  } catch (err) {
    console.error(err)
    return null
  }

  return null
}

export async function updateOrderStatus (payload: {orderId: string, statusId: string, setItemStatus: string}): Promise<string> {

  try {
    const resp = await api({
      url: '/service/changeOrderStatus',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200) {
      return 'success';
    }
  } catch (err) {
    console.error(err)
    return ''
  }

  return ''
}
