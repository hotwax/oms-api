import { getIdentification } from '../util'

export const orderItemTransformRule = {
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
      pseudoId: "internalName",
      productTypeEnumId: "productTypeId",
      productName: "productName"
    }
  }
}

export const orderPartTransformRule = {
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
    autoCancelDate: "autoCancelDate",
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
    },
    status: {
      statusId: "orderItemStatusId",
      description: "orderItemStatusDesc"
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
    // if the assigned property to the key does not exist and if we have declared the key mapping
    // to an empty string then this default value won't apply
    contactMechId: 'emailId'
  }
}

export const orderDetailTranformRule = {
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
    externalId: "orderIdentifications",
    status: {
      statusId: "orderStatusId",
      description: "orderStatusDesc"
    }
  },
  operate: [{
    run: function (orderIdentifications: Array<string>) {
      // TODO: store the id (here SHOPIFY_ORD_ID) in a config file
      return getIdentification(orderIdentifications, 'SHOPIFY_ORD_ID')
    },
    on: "externalId"
  }]
}