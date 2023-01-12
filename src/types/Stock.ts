import { Enumeration } from "./Enumeration";
import { Uom } from "./Uom";

export interface Stock {
  assetId?: string;
  parentAssetId?: string;
  assetTypeEnumId?: Enumeration;
  classEnumId?: Enumeration;
  statusId?: string;
  ownerPartyId?: string;
  assetPoolId?: string;
  productId?: string;
  hasQuantity?: string;
  quantityOnHandTotal?: number;
  availableToPromiseTotal?: number;
  originalQuantity?: number;
  originalQuantityUomId?: Uom;
  assetName?: string;
  comments?: string;
  serialNumber?: string;
  softIdentifier?: string;
  activationNumber?: string;
  capacity?: number;
  capacityUomId?: string;
  facilityId?: string;
  locationSeqId?: string;
  containerId?: string;
  shipmentBoxTypeId?: string;
  lotId?: string;
  geoPointId?: string;
  originId?: string;
  originFacilityId?: string;
  acquireOrderId?: string;
  acquireOrderItemSeqId?: string;
  acquireShipmentId?: string;
  acquireCost?: string;
  acquireCostUomId?: string;
}