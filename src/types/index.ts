import { ContactMech } from './ContactMech';
import { Enumeration } from './Enumeration';
import { Geo } from './Geo';
import { Order, OrderItem, OrderItemGroup } from './Order';
import { Party } from './Party';
import { Product } from './Product';
import { Status } from './Status';
import { Uom } from './Uom';
import { User } from './User';

const events = {
  'UNAUTHORIZED': 'unauthorized',
  'QUEUE_TASK': 'queueTask',
  'DISMISS_LOADER': 'dismissLoader'
}

interface Response {
  code: string;
  message: string;
  messageList?: Array<string>;
  serverResponse?: any;
}

export {
  ContactMech,
  Enumeration,
  Geo,
  Order,
  OrderItem,
  OrderItemGroup,
  Party,
  Product,
  Status,
  Uom,
  User,
  Response,
  events
}