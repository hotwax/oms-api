import { Order, OrderItem, OrderItemGroup } from './Order';
import { Product } from './Product'

export const events = {
  'UNAUTHORIZED': 'unauthorized',
  'QUEUE_TASK': 'queueTask',
  'DISMISS_LOADER': 'dismissLoader'
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
  OrderItemGroup,
  Product
}