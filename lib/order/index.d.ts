import { Order, Response } from '@/types';
declare function getOrderDetails(orderId: string): Promise<Order | Response>;
declare function updateOrderStatus(payload: {
    orderId: string;
    statusId: string;
    setItemStatus: string;
}): Promise<Response>;
export { getOrderDetails, updateOrderStatus };
