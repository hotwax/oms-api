import { Response, Shipment } from "@/types";
declare function fetchShipments(payload: any): Promise<Shipment[] | Response>;
export { fetchShipments };
