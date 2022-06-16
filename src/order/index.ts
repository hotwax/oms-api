import api from '../api'
import { Order, OrderItem, OrderPart, Response } from '../types'
import { getIdentification, hasError } from '../util'
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

      const orderShipGroup: OrderPart[] = group.doclist.docs.reduce((shipGroups: any, orderItem: any) => {
        const group = shipGroups.find((group: any) => group.orderPartSeqId === orderItem.shipGroupSeqId)

        // transforming to order item schema
        const orderItemTransform: any =  new (DataTransform as any)(orderItem, {
          item: {
            orderId: "orderId",
            orderItemSeqId: "orderItemSeqId",
            orderPartSeqId: "shipGroupSeqId",
            productId: "productId",
            quantity: "quantity",
            unitAmount: "unitPrice",
            unitListPrice: "unitListPrice",
            product: {
              productId: "productId",
              productTypeEnumId: "productTypeId",
              productName: "productName"
            }
          }
        });
        const item: OrderItem = orderItemTransform.transform()
        if (group) {
          group.items.push(item)
        } else {
          // transforming to order part schema
          const orderPartTransform: any =  new (DataTransform as any)(orderItem, {
            item: {
              orderId: "orderId",
              orderPartSeqId: "shipGroupSeqId",
              partName: "orderName",
              // TODO: mapped orderItemStatusId with part status id as we are not maintaining status at part
              // level, for item status we will use the same field and will handle the scenario of cancelled
              // item using cancelledQuantity
              statusId: "orderItemStatusId",
              customerPartyId: "customerPartyId",
              facilityId: "facilityId",
              carrierPartyId: "carrierPartyId",
              shipmentMethodEnumId: "shipmentMethodTypeId",
              customer: {
                partyId: "customerPartyId",
                person: {
                  partyId: "customerPartyId",
                  firstName: "customerPartyName", // assigning customerPartyName to firstName and then using operate on this field to get the firstName
                  lastName: "customerPartyName" // assigning customerPartyName to lastName and then using operate on this field to get the lastName
                }
              },
              facility: {
                facilityId: "facilityId",
                facilityTypeEnumId: "facilityTypeId",
                facilityName: "facilityName"
              },
              contactMechs: [{
                orderId: "orderId",
                orderPartSeqId: "shipGroupSeqId",
                contactMechId: "", // TODO: check for mech id as we are not receiving it in current resp
                contactMech: {
                  contactMechId: "",
                  infoString: "customerEmailId"
                }
              }],
              postal: {
                postalAddress: {
                  toName: "customerPartyName",
                  city: "shipToCity",
                  countryGeo: {
                    geoName: "shipToCountry"
                  },
                  stateProvinceGeo: {
                    geoName: "shipToState"
                  }
                }
              }
            },
            // as we are receiving the full name in the customerPartyName, used operate to split it into
            // firstName and lastName
            operate: [{
              run: function(val: string) {
                return val.split(" ")[0]
              },
              on: "customer.person.firstName"
            },{
              run: function(val: string) {
                return val.split(" ")[1]
              },
              on: "customer.person.lastName"
            }],
            defaults: {
              // This assign the default value (here emailId) to the specific key (here contactMechId) only
              // if the assigned property does not exist and if we have declared the contactMechId mapping
              // to an empty string then this default value won't apply
              contactMechId: 'emailId'
            }
          });

          const part: OrderPart = orderPartTransform.transform()
          part["items"] = [item] as OrderItem[]
          shipGroups.push(part)
        }

        return shipGroups
      }, [])

      // transforming to order header schema
      const dataTransform: any =  new (DataTransform as any)(orderDetails, {
        item: {
          orderId: "orderId",
          orderName: "orderName",
          statusId: "orderStatusId",
          placedDate: "orderDate",
          currencyUomId: "currencyUomId",
          salesChannelEnumId: "salesChannelEnumId",
          salesChannel: {
            enumId: "salesChannelEnumId",
            description: "salesChannelDesc"
          },
          externalId: "orderIdentifications"
        },
        operate: [{
          run: function (orderIdentifications: Array<string>) {
            // TODO: store the id (here SHOPIFY_ORD_ID) in a config file
            return getIdentification(orderIdentifications, 'SHOPIFY_ORD_ID')
          },
          on: "externalId"
        }]
      });

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
