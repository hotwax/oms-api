import api from "@/api";
import { hasError } from "@/util";
import { Response, Shipment } from "@/types";
import { shipmentTransformRule } from "@/mappings/shipment";
import { DataTransform } from "node-json-transform";

async function fetchShipments(query: any): Promise <Shipment[] | Response> {
  let response = {} as Shipment[] | Response

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
