import api from '../api'
import { Order, OrderItem, OrderPart, Response } from '../types'
import { getIdentification, hasError } from '../util'
import { DataTransform } from 'node-json-transform'
import { orderDetailTranformRule, orderItemTransformRule, orderPartTransformRule } from '../mappings/order.js'

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

      const orderShipGroup: OrderPart[] = group.doclist.docs.reduce((shipGroups: any, orderItem: any) => {
        const group = shipGroups.find((group: any) => group.orderPartSeqId === orderItem.shipGroupSeqId)

        // transforming to order item schema
        const orderItemTransform: any =  new (DataTransform as any)(orderItem, orderItemTransformRule);
        const item: OrderItem = orderItemTransform.transform()
        if (group) {
          group.items.push(item)
        } else {
          // transforming to order part schema
          const orderPartTransform: any =  new (DataTransform as any)(orderItem, orderPartTransformRule);

          const part: OrderPart = orderPartTransform.transform()
          part["items"] = [item] as OrderItem[]
          shipGroups.push(part)
        }

        return shipGroups
      }, [])

      // transforming to order header schema
      const dataTransform: any =  new (DataTransform as any)(orderDetails, orderDetailTranformRule);

      const order: Order = dataTransform.transform()

      order.parts = orderShipGroup as OrderPart[]

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
