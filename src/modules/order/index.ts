import api from '../../api'
import { OPERATOR, Order, OrderItem, OrderPart, Response } from '../../types'
import { hasError } from '../../util'
import { transform } from 'node-json-transform'
import { orderDetailTranformRule, orderItemTransformRule, orderPartTransformRule } from '../../mappings/order'

export async function getOrderDetails (orderId: string): Promise<Order | Response> {
  const payload = {
    "json": {
      "params": {
        "group": true,
        "group.field": "orderId",
        "group.limit": 10000,
        "q.op": OPERATOR.AND
      } as any,
      "query": "*:*",
      "filter": `docType: ORDER ${OPERATOR.AND} orderTypeId: SALES_ORDER ${OPERATOR.AND} orderId: ${orderId}`
    }
  }

  try {
    const resp = await api({
      url: 'solr-query',
      method: 'get',
      params: payload
    }) as any

    if (resp?.status == 200 && !hasError(resp) && resp.data?.grouped?.orderId?.groups?.length > 0) {
      const group = resp.data.grouped.orderId.groups[0]
      const orderDetails = group.doclist.docs[0]

      const orderShipGroup: OrderPart[] = group.doclist.docs.reduce((shipGroups: any, orderItem: any) => {
        const group = shipGroups.find((group: any) => group.orderPartSeqId === orderItem.shipGroupSeqId)

        // transforming to order item schema
        const item: OrderItem = transform(orderItem, orderItemTransformRule)
        if (group) {
          group.items.push(item)
        } else {
          // transforming to order part schema
          const part: OrderPart = transform(orderItem, orderPartTransformRule)
          part["items"] = [item] as OrderItem[]
          shipGroups.push(part)
        }

        return shipGroups
      }, [])

      // transforming to order header schema
      const order: Order = transform(orderDetails, orderDetailTranformRule)

      order.parts = orderShipGroup as OrderPart[]

      return Promise.resolve(order)
    } else {
      return Promise.reject({
        code: 'error',
        message: `Unable to fetch order details for orderId: ${orderId}`,
        serverResponse: resp.data
      })
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}

export async function updateOrderStatus (payload: {orderId: string, statusId: string, setItemStatus: string}): Promise<Response> {

  try {
    const resp = await api({
      url: '/service/changeOrderStatus',
      method: 'post',
      data: payload
    }) as any

    if (resp?.status == 200 && !hasError(resp)) {
      return Promise.resolve({
        code: 'success',
        message: 'Order status updated',
        serverResponse: resp.data
      })
    } else {
      return Promise.reject({
        code: 'error',
        message: 'Unable to update order status',
        serverResponse: resp.data
      })
    }
  } catch (err) {
    return Promise.reject({
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    })
  }
}