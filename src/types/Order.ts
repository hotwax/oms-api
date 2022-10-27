import { ContactMech, Enumeration, Party, Status, Uom } from "./index"

export interface Order {
  orderId: string;
  orderName?: string;
  entryDate?: string;
  placedDate?: string;
  approvedDate?: string;
  completedDate?: string;
  statusId?: string;
  processingStatusId?: string;
  orderRevision?: number;
  currencyUomId?: string;
  billingAccountId?: string;
  productStoreId?: string;
  salesChannelEnumId?: string;
  externalId?: string;
  externalRevision?: string;
  originId?: string;
  originUrl?: string;
  syncStatusId?: string; 
  systemMessageRemoteId?: string;
  enteredByPartyId?: string;
  parentOrderId?: string;
  lastOrderedDate?: string;
  recurAutoInvoice?: string;
  remainingSubTotal?: number;
  grandTotal?: number;
  status?: Status;
  currencyUom?: Uom;
  salesChannel?: Enumeration;
  parts?: Array<OrderPart>;
  communicationEvents?: Array<{
    orderId: string;
    communicationEventId: string;
  }>;
}


export interface OrderItem {
  orderId: string;
  orderItemSeqId: string;
  orderPartSeqId?: string;
  parentItemSeqId?: string;
  itemTypeEnumId?: string;
  productId?: string;
  productFeatureId?: string;
  otherPartyProductId?: string;
  productParameterSetId?: string;
  itemDescription?: string;
  comments?: string;
  quantity?: number;
  quantityUomId?: string;
  quantityCancelled?: number;
  selectedAmount?: number;
  priority?: number;
  requiredByDate?: string;
  unitAmount?: number;
  unitListPrice?: number;
  isModifiedPrice?: string;
  standardCost?: number;
  externalItemSeqId?: string;
  fromAssetId?: string;
  productPriceId?: string;
  productCategoryId?: string;
  isPromo?: string;
  promoQuantity?: number;
  promoTimesUsed?: number;
  storePromotionId?: string;
  promoCodeId?: string;
  promoCodeText?: string;
  subscriptionId?: string;
  finAccountId?: string;
  finAccountTransId?: string;
  overrideGlAccountId?: string;
  salesOpportunityId?: string;
  sourceReferenceId?: string;
  sourcePercentage?: number;
  amountAlreadyIncluded?: number;
  exemptAmount?: number;
  customerReferenceId?: string;
  taxAuthorityId?: string;
  itemType?: Enumeration;
  product?: {
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
  };
  quantityUom?: Uom;
  reservations?: Array<{
    assetReservationId: string;
    assetId?: string;
    productId?: string;
    orderId?: string;
    orderItemSeqId?: string;
    reservationOrderEnumId?: string;
    quantity?: number;
    quantityNotAvailable?: number;
    quantityNotIssued?: number;
    reservedDate?: string;
    originalPromisedDate?: string;
    currentPromisedDate?: string;
    priority?: number;
    sequenceNum?: number;
  }>;
  issuances?: Array<{
    assetIssuanceId: string;
    assetId?: string;
    assetReservationId?: string;
    orderId?: string;
    orderItemSeqId?: string;
    shipmentId?: string;
    shipmentItemSourceId?: string;
    productId?: string;
    invoiceId?: string;
    invoiceItemSeqId?: string;
    returnId?: string;
    returnItemSeqId?: string;
    workEffortId?: string;
    facilityId?: string;
    assetMaintenanceId?: string;
    issuedByUserId?: string;
    issuedDate?: string;
    quantity?: number;
    quantityCancelled?: number;
    acctgTransResultEnumId?: string;
  }>;
  receipts?: Array<{
    assetReceiptId: string;
    assetId?: string;
    productId?: string;
    orderId?: string;
    orderItemSeqId?: string;
    shipmentId?: string;
    shipmentItemSourceId?: string;
    shipmentPackageSeqId?: string;
    invoiceId?: string;
    invoiceItemSeqId?: string;
    returnId?: string;
    returnItemSeqId?: string;
    workEffortId?: string;
    receivedByUserId?: string;
    receivedDate?: string;
    itemDescription?: string;
    quantityAccepted?: number;
    quantityRejected?: number;
    rejectionReasonEnumId?: string;
    acctgTransResultEnumId?: string;
  }>;
  shipmentSources?: Array<{
    shipmentItemSourceId: string;
    shipmentId?: string;
    productId?: string;
    binLocationNumber?: number;
    orderId?: string;
    orderItemSeqId?: string;
    returnId?: string;
    returnItemSeqId?: string;
    statusId?: string;
    quantity?: number;
    quantityNotHandled?: number;
    quantityPicked?: number;
    invoiceId?: string;
    invoiceItemSeqId?: string;
  }>;
  billings?: Array<{
    orderItemBillingId: string;
    orderId?: string;
    orderItemSeqId?: string;
    invoiceId?: string;
    invoiceItemSeqId?: string;
    assetIssuanceId?: string;
    assetReceiptId?: string;
    shipmentId?: string;
    quantity?: number;
    amount?: number;
  }>;
}

export interface OrderPart {
  orderId: string;
  orderPartSeqId: string;
  parentPartSeqId?: string;
  partName?: string;
  statusId?: string;
  vendorPartyId?: string;
  customerPartyId?: string;
  otherPartyOrderId?: string;
  otherPartyOrderDate?: string;
  facilityId?: string;
  carrierPartyId?: string;
  shipmentMethodEnumId?: string;
  postalContactMechId?: string;
  telecomContactMechId?: string;
  trackingNumber?: string;
  shippingInstructions?: string;
  maySplit?: string;
  signatureRequiredEnumId?: string;
  giftMessage?: string;
  isGift?: string;
  isNewCustomer?: string;
  partTotal?: number;
  priority?: number;
  shipAfterDate?: string;
  shipBeforeDate?: string;
  estimatedShipDate?: string;
  estimatedDeliveryDate?: string;
  estimatedPickUpDate?: string;
  validFromDate?: string;
  validThruDate?: string;
  autoCancelDate?: string;
  dontCancelSetDate?: string;
  dontCancelSetUserId?: string;
  disablePromotions?: string;
  disableShippingCalc?: string; 
  disableTaxCalc?: string;
  reservationAutoEnumId?: string;
  status?: Status;
  items?: Array<OrderItem>;
  parties?: Array<{
    orderId: string;
    orderPartSeqId: string;
    partyId: string;
    roleTypeId: string;
    sequenceNum?: number;
    party?: Party;
    roleType?: {
      roleTypeId: string;
      parentTypeId?: string;
      description?: string;
    };
  }>;
  contactMechs?: Array<{
    orderId: string;
    orderPartSeqId: string;
    contactMechPurposeId?: string;
    contactMechId?: string;
    contactMech?: ContactMech;
  }>;
  vendor?: Party;
  customer?: Party;
  carrier?: Party;
  shipmentMethod?: Enumeration;
  postal?: ContactMech;
  telecom?: ContactMech;
  facility?: {
    facilityId: string;
    pseudoId?: string;
    facilityTypeEnumId?: string;
    parentFacilityId?: string;
    statusId?: string;
    ownerPartyId?: string;
    facilityName?: string;
    facilitySize?: number;
    facilitySizeUomId?: string;
    openedDate?: string;
    closedDate?: string;
    description?: string;
    geoId?: string;
    geoPointId?: string;
    countyGeoId?: string;
    stateGeoId?: string;
    assetAllowOtherOwner?: string;
    assetAllowIssueOverQoh?: string;
    assetInventoryLocRequire?: string;
    defaultDaysToShip?: number;
    externalId?: string;
    originId?: string;
  };
  payments?: Array<{
    paymentId: string;
    paymentTypeEnumId?: string;
    fromPartyId?: string;
    toPartyId?: string;
    paymentInstrumentEnumId?: string;
    paymentMethodId?: string;
    toPaymentMethodId?: string;
    paymentGatewayConfigId?: string;
    orderId?: string;
    orderPartSeqId?: string;
    orderItemSeqId?: string;
    statusId?: string;
    effectiveDate?: string;
    settlementDate?: string;
    dueDate?: string;
    paymentAuthCode?: string;
    paymentRefNum?: string;
    comments?: string;
    memo?: string;
    distGroupEnumId?: string;
    amount?: number;
    amountUomId?: string;
    appliedTotal?: number;
    unappliedTotal?: number;
    forInvoiceId?: string;
    refundForPaymentId?: string;
    finAccountId?: string;
    finAccountAuthId?: string;
    finAccountTransId?: string;
    overrideGlAccountId?: string;
    overrideOrgPartyId?: string;
    partyRelationshipId?: string;
    timePeriodId?: string;
    originalCurrencyAmount?: number;
    originalCurrencyUomId?: string;
    presentFlag?: string;
    swipedFlag?: string;
    processAttempt?: number;
    needsNsfRetry?: string;
    acctgTransResultEnumId?: string;
    reconcileStatusId?: string;
    paymentMethodFileId?: string;
  }>;
}