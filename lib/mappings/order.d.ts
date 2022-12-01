export declare const orderItemTransformRule: {
    item: {
        orderId: string;
        orderItemSeqId: string;
        orderPartSeqId: string;
        productId: string;
        quantity: string;
        unitAmount: string;
        unitListPrice: string;
        product: {
            productId: string;
            pseudoId: string;
            productTypeEnumId: string;
            productName: string;
        };
    };
};
export declare const orderPartTransformRule: {
    item: {
        orderId: string;
        orderPartSeqId: string;
        partName: string;
        statusId: string;
        customerPartyId: string;
        facilityId: string;
        carrierPartyId: string;
        shipmentMethodEnumId: string;
        autoCancelDate: string;
        customer: {
            partyId: string;
            person: {
                partyId: string;
                firstName: string;
                lastName: string;
            };
        };
        facility: {
            facilityId: string;
            facilityTypeEnumId: string;
            facilityName: string;
        };
        contactMechs: {
            orderId: string;
            orderPartSeqId: string;
            contactMechId: string;
            contactMech: {
                contactMechId: string;
                infoString: string;
            };
        }[];
        postal: {
            postalAddress: {
                toName: string;
                city: string;
                countryGeo: {
                    geoName: string;
                };
                stateProvinceGeo: {
                    geoName: string;
                };
            };
        };
        status: {
            statusId: string;
            description: string;
        };
    };
    operate: {
        run: (val: string) => string;
        on: string;
    }[];
    defaults: {
        contactMechId: string;
    };
};
export declare const orderDetailTranformRule: {
    item: {
        orderId: string;
        orderName: string;
        statusId: string;
        placedDate: string;
        currencyUomId: string;
        salesChannelEnumId: string;
        salesChannel: {
            enumId: string;
            description: string;
        };
        externalId: string;
        status: {
            statusId: string;
            description: string;
        };
    };
    operate: {
        run: (orderIdentifications: Array<string>) => string;
        on: string;
    }[];
};
