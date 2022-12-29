import { ContactMech } from './ContactMech';
import { Enumeration } from './Enumeration';
import { Geo } from './Geo';
import { Order, OrderItem, OrderPart } from './Order';
import { Party } from './Party';
import { Product } from './Product';
import { Status } from './Status';
import { Uom } from './Uom';
import { Shipment } from './Shipment';
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
  OrderPart,
  Party,
  Product,
  Shipment,
  Status,
  Uom,
  User,
  Response,
  events
}