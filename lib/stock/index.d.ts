import { Stock, Response } from "@/types";
declare function fetchProductsStock(productIds: Array<string>, facilityId?: string): Promise<Array<Stock> | Response>;
export { fetchProductsStock };
