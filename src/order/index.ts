import api from '../../api'
import { Order, OrderItem, Response } from '../../types'
import { hasError } from '../util'

export async function getOrderDetails (orderId: string): Promise<Order | Response> {
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

  let response = {} as Order | Response

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200 && !hasError(resp) && resp.data?.grouped?.orderId?.groups?.length > 0) {
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
          productId: item.productId,
          quantity: item.quantity,
          statusId: item.orderItemStatusId
        })) as OrderItem[],
        statusId: orderDetails.orderStatusId,
        statusDesc: orderDetails.orderStatusDesc,
        identifications: orderDetails.orderIdentifications,
      }
      response = order
    } else {
      response = {
        code: 'error',
        message: `Unable to fetch order details for orderId: ${orderId}`,
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

  return response;
}

export async function updateOrderStatus (payload: {orderId: string, statusId: string, setItemStatus: string}): Promise<Response> {

  let response = {} as Response

  try {
    const resp = await api({
      url: '/service/changeOrderStatus',
      method: 'post',
      data: payload
    })

    if (resp?.status == 200 && !hasError(resp)) {
      response = {
        code: 'success',
        message: 'Order status updated',
        serverResponse: resp.data
      };
    } else {
      response = {
        code: 'error',
        message: 'Unable to update order status',
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
