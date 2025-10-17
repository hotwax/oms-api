import { ContactMech } from './ContactMech';
import { Enumeration } from './Enumeration';
import { Geo } from './Geo';
import { Order, OrderItem, OrderPart } from './Order';
import { Party } from './Party';
import { Product } from './Product';
import { Status } from './Status';
import { Uom } from './Uom';
import { Stock } from './Stock';
import { User } from './User';

const events = {
  'UNAUTHORIZED': 'unauthorized',
  'QUEUE_TASK': 'queueTask',
  'DISMISS_LOADER': 'dismissLoader'
}

enum OPERATOR {
  AND = 'AND',
  BETWEEN = 'between',
  CONTAINS = 'contains',
  EQUALS = 'equals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_EQUAL_TO = 'greaterThanEqualTo',
  IN = 'in',
  LESS_THAN = 'lessThan',
  LESS_THAN_EQUAL_TO = 'lessThanEqualTo',
  LIKE = 'like',
  NOT = 'not',
  NOT_EMPTY = 'not-empty',
  NOT_EQUAL = 'notEqual',
  NOT_LIKE = 'notLike',
  OR = 'OR',
}

enum STATUSCOLOR {
  // ITEM
  ITEM_APPROVED = "success",
  ITEM_CANCELLED = "danger",
  ITEM_CREATED = "medium",
  ITEM_COMPLETED = "success",
  ITEM_PENDING_FULFILL = "warning",
  ITEM_PENDING_RECEIPT = "warning",
  ITEM_REJECTED = "danger",
  ITEM_REQ_CANCELATN = "warning",

  // PAYMENT
  PAYMENT_AUTHORIZED = "medium",
  PAYMENT_CANCELLED = "danger",
  PAYMENT_DECLINED = "danger",
  PAYMENT_NOT_AUTH = "warning",
  PAYMENT_NOT_RECEIVED = "warning",
  PAYMENT_RECEIVED = "success",
  PAYMENT_REFUNDED = "success",
  PAYMENT_SETTLED = "success",

  // ORDER
  ORDER_APPROVED = "success",
  ORDER_CANCELLED = "danger",
  ORDER_COMPLETED = "success",
  ORDER_CREATED = "medium",
  ORDER_HOLD = "warning",
  ORDER_REJECTED = "danger",

  // SHIPMENT
  SHIPMENT_APPROVED = "success",
  SHIPMENT_CANCELLED = "danger",
  SHIPMENT_INPUT = "medium",
  SHIPMENT_PACKED = "success",
  SHIPMENT_SHIPPED = "success",
}

interface Response {
  code: string;
  message: string;
  messageList?: Array<string>;
  serverResponse?: any;
}

interface RequestPayload {
  url: string;
  method: string;
  params?: any;
  baseURL?: string;
  headers?: any;
  data?: any;
}

export {
  ContactMech,
  Enumeration,
  events,
  Geo,
  Order,
  OrderItem,
  OrderPart,
  OPERATOR,
  Party,
  Product,
  Response,
  RequestPayload,
  Status,
  Stock,
  Uom,
  User,
  STATUSCOLOR
}