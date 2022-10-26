import { Response, Shipment } from "@/types";
declare function fetchShipments(query: any): Promise<Shipment[] | Response>;
export { fetchShipments };
