import { Enumeration, Party, Status, Uom } from "./index";
export interface ShipmentItemSource {
    shipmentItemSourceId: string;
    orderId: string;
    orderItemSeqId: string;
    returnId: string;
    returnItemSeqId: string;
    statusId: string;
    invoiceId: string;
    invoiceItemSeqId: string;
}
export interface Shipment {
    shipmentId: string;
    shipmentTypeEnumId: string;
    statusId: string;
    fromPartyId: string;
    toPartyId: string;
    binLocationNumber: number;
    productStoreId: string;
    priority: number;
    entryDate: number;
    shipAfterDate: number;
    shipBeforeDate: number;
    estimatedReadyDate: number;
    estimatedShipDate: number;
    estimatedArrivalDate: number;
    latestCancelDate: number;
    packedDate: number;
    pickContainerId: string;
    estimatedShipCost: number;
    costUomId: string;
    addtlShippingCharge: number;
    addtlShippingChargeDesc: string;
    signatureRequiredEnumId: string;
    handlingInstructions: string;
    otherPartyOrderId: string;
    systemMessageRemoteId: string;
    externalId: string;
    originId: string;
    type: Enumeration;
    status: Status;
    fromParty: Party;
    toParty: Party;
    costUom: Uom;
    contents: Array<{
        shipmentContentId: string;
        shipmentContentTypeEnumId: string;
        shipmentId: string;
        productId: string;
        shipmentPackageSeqId: string;
        shipmentRouteSegmentSeqId: string;
        contentLocation: string;
        description: string;
        contentDate: number;
        userId: string;
    }>;
    items: Array<{
        shipmentId: string;
        productId: string;
        quantity: number;
        itemSource: ShipmentItemSource;
    }>;
    packages: Array<{
        shipmentId: string;
        shipmentPackageSeqId: string;
        shipmentBoxTypeId: string;
        weight: number;
        weightUomId: string;
        gatewayPackageId: string;
    }>;
    shipmentItemCount: number;
    destinationFacilityId: string;
}
