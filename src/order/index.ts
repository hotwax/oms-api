import api from '../api'
import { Order, OrderItem, OrderPart, Response } from '../types'
import { hasError } from '../util'
import { DataTransform } from 'node-json-transform'

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

      const orderShipGroup = group.doclist.docs.reduce((shipGroups: any, orderItem: any) => {
        const group = shipGroups.find((group: any) => group.orderPartSeqId === orderItem.shipGroupSeqId)

        const orderItemTransform: any =  new (DataTransform as any)(orderItem, {
          item: {
            orderId: "orderId",
            orderItemSeqId: "orderItemSeqId",
            orderPartSeqId: "shipGroupSeqId",
            productId: "productId",
            quantity: "quantity",
            unitAmount: "unitPrice",
            unitListPrice: "unitListPrice"
          }
        });
        const item: OrderItem = orderItemTransform.transform()
        if (group) {
          group.items.push(item)
        } else {
          const orderPartTransform: any =  new (DataTransform as any)(orderItem, {
            item: {
              orderId: "orderId",
              orderPartSeqId: "shipGroupSeqId",
              partName: "orderName",
              statusId: "orderItemStatusId",  // TODO: map it with part status id
              customerPartyId: "customerPartyId",
              facilityId: "facilityId",
              carrierPartyId: "carrierPartyId",
              shipmentMethodEnumId: "shipmentMethodTypeId"
            }
          });

          const part: OrderPart = orderPartTransform.transform()
          part["items"] = [item]
          shipGroups.push(part)
        }

        return shipGroups
      }, [])

      const dataTransform: any =  new (DataTransform as any)(orderDetails, {
        item: {
          orderId: "orderId",
          orderName: "orderName",
          statusId: "orderStatusId",
          placedDate: "orderDate",
          currencyUomId: "currencyUomId"
        }
      });

      const order: Order = dataTransform.transform()

      order.parts = orderShipGroup

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
