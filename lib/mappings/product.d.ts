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
        run: (features: any) => {
            desc: string;
            value: any;
        }[] | undefined;
        on: string;
    }[];
};
export { productTransformRule };
