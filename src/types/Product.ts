import { Enumeration, Geo, Status, Party, Uom } from "./index"

export interface ProductAssoc {
  productId?: string;
  toProductId?: string;
  productAssocTypeEnumId?: string;
  fromDate?: string;
  thruDate?: string;
  sequenceNum?: number;
  reason?: string;
  quantity?: number;
  scrapFactor?: number;
  instruction?: string;
  routingWorkEffortId?: string;
  type?: Enumeration;
  toProduct?: Product;
}

export interface Product {
  productId: string;
  pseudoId?: string;
  productTypeEnumId?: string;
  productClassEnumId?: string;
  assetTypeEnumId?: string;
  assetClassEnumId?: string;
  statusId?: string;
  ownerPartyId?: string;
  productName?: string;
  description?: string;
  comments?: string;
  salesIntroductionDate?: string;
  salesDiscontinuationDate?: string;
  salesDiscWhenNotAvail?: string;
  supportDiscontinuationDate?: string;
  requireInventory?: string;
  chargeShipping?: string;
  signatureRequiredEnumId?: string;
  shippingInsuranceReqd?: string;
  inShippingBox?: string;
  defaultShipmentBoxTypeId?: string;
  taxable?: string;
  taxCode?: string;
  returnable?: string;
  amountUomId?: string;
  amountFixed?: number;
  amountRequire?: string;
  originGeoId?: string;
  type?: Enumeration;
  class?: Enumeration;
  assetType?: Enumeration;
  assetClass?: Enumeration;
  status?: Status;
  originGeo?: Geo;
  defaultBoxType?: {
    shipmentBoxTypeId?: string;
    pseudoId?: string;
    description?: string;
    dimensionUomId?: string;
    boxLength?: number;
    boxWidth?: number;
    boxHeight?: number;
    weightUomId?: string;
    boxWeight?: number;
    defaultGrossWeight?: number;
    capacityUomId?: string;
    boxCapacity?: number;
    gatewayBoxId?: string;
  };
  amountUom?: Uom;
  assocs?: Array<ProductAssoc>;
  toAssocs?: Array<ProductAssoc>;
  contents?: Array<{
    productContentId?: string;
    productId?: string;
    contentLocation?: string;
    productContentTypeEnumId?: string;
    locale?: string;
    productFeatureId?: string;
    productStoreId?: string;
    fromDate?: string;
    thruDate?: string;
    description?: string;
    sequenceNum?: number;
    userId?: string;
  }>;
  dimensions?: Array<{
    productId?: string;
    dimensionTypeId?: string;
    value?: number;
    valueUomId?: string;
  }>;
  geos?: Array<{
    productId?: string;
    geoId?: string;
    productGeoPurposeEnumId?: string;
    description?: string;
    geo?: Geo;
  }>;
  identifications?: Array<{
    productId?: string;
    productIdTypeEnumId?: string;
    idValue?: string;
  }>;
  parties?: Array<{
    productId?: string;
    partyId?: string;
    roleTypeId?: string;
    fromDate?: string;
    thruDate?: string;
    sequenceNum?: number;
    comments?: string;
    otherPartyItemName?: string;
    otherPartyItemId?: string;
    party?: Party;
    role?: {
      roleTypeId?: string;
      parentTypeId?: string;
      description?: string;
    };
  }>;
  prices?: Array<{
    productPriceId?: string;
    productId?: string;
    productStoreId?: string;
    vendorPartyId?: string;
    customerPartyId?: string;
    priceTypeEnumId?: string;
    pricePurposeEnumId?: string;
    fromDate?: string;
    thruDate?: string;
    minQuantity?: number;
    price?: number;
    priceUomId?: string;
    termUomId?: string;
    taxInPrice?: string;
    taxAmount?: number;
    taxPercentage?: number;
    taxAuthorityId?: string;
    agreementId?: string;
    agreementItemSeqId?: string;
    otherPartyItemName?: string;
    otherPartyItemId?: string;
    comments?: string;
    quantityIncrement?: number;
    quantityIncluded?: number;
    quantityUomId?: string;
    preferredOrderEnumId?: string;
    supplierRatingTypeEnumId?: string;
    standardLeadTimeDays?: number;
    canDropShip?: string;
  }>;
  categories?: Array<{
    productCategoryId?: string;
    productId?: string;
    fromDate?: string;
    thruDate?: string;
    comments?: string;
    sequenceNum?: number;
    quantity?: number;
    category: {
      pseudoId: string;
      ownerPartyId: string;
      productCategoryTypeEnumId: string;
      categoryName: string;
    };
  }>;
  features?: Array<{
    productFeatureId?: string;
    desc?: string;
    value?: string;
  }>;
  images?: {
    [x: string]: string;
  };
  sku?: string;
  parent?: {
    [x: string]: string;
  };
  variants?: Array<string>;
  brandName?: string;
}
