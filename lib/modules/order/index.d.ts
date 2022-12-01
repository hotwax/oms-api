import { Order, Response } from '@/types';
export declare function getOrderDetails(orderId: string): Promise<Order | Response>;
export declare function updateOrderStatus(payload: {
    orderId: string;
    statusId: string;
    setItemStatus: string;
}): Promise<Response>;
