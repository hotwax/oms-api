import { Order, OrderItem, OrderItemGroup } from './Order';

export const events = {
  'UNAUTHORIZED': 'unauthorized'
}

export interface Response {
  code: string;
  message: string;
  messageList?: Array<string>;
  serverResponse?: any;
}

export {
  Order,
  OrderItem,
  OrderItemGroup
}