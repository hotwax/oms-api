import api from "@/api";
import { hasError } from "@/util";
import { Response, Shipment } from "@/types";
import { shipmentTransformRule } from "@/mappings/shipment";
import { DataTransform } from "node-json-transform";

async function fetchShipments(payload: any): Promise <Shipment[] | Response> {
  let response = {} as Shipment[] | Response

  const query = {
    "inputFields": {
      "destinationFacilityId": payload.facilityId,
      "statusId": "PURCH_SHIP_SHIPPED",
      "shipmentTypeId_fld0_value": "INCOMING_SHIPMENT",
      "shipmentTypeId_fld0_op": "equals",
      "shipmentTypeId_fld0_grp": "1",
      "parentTypeId_fld0_value": "INCOMING_SHIPMENT",
      "parentTypeId_fld0_op": "equals",
      "parentTypeId_fld0_grp": "2",
    },
    "entityName": "ShipmentAndTypeAndItemCount",
    "fieldList" : [ "shipmentId","primaryShipGroupSeqId","partyIdFrom","partyIdTo","estimatedArrivalDate","destinationFacilityId","statusId", "shipmentItemCount" ],
    "noConditionFind": "Y",
    "viewSize": payload.viewSize,
    "viewIndex": payload.viewIndex,
  } as any

  if(payload.queryString){
    query.inputFields["shipmentId"] = payload.queryString;
    query.inputFields["shipmentId_op"] = "contains";
    query.inputFields["shipmentId_ic"] = "Y";
  }

  try {
    const resp = await api({
      url: '/performFind',
      method: 'post',
      data: query,
      cache: true
    }) as any

    if (resp.status === 200 && resp.data.docs?.length > 0 && !hasError(resp)) {

      const shipmentTransform: any =  new (DataTransform as any)(resp.data.docs, shipmentTransformRule)
      const shipments: Array<Shipment> = shipmentTransform.transform()
      response = shipments;
    } else {
      response = [];
    }
  } catch(err) {
    response = {
      code: 'error',
      message: 'Something went wrong',
      serverResponse: err
    }
  }

  return response;
}

export { fetchShipments }
