declare const productTransformRule: {
    item: {
        productId: string;
        pseudoId: string;
        productName: string;
        salesIntroductionDate: string;
        variants: string;
        parent: {
            productName: string;
            id: string;
        };
        images: {
            mainImageUrl: string;
            additionalImageUrls: string;
        };
        features: string;
        brandName: string;
        sku: string;
    };
    operate: {
        run: (productFeatures: any) => any;
        on: string;
    }[];
};
export { productTransformRule };
