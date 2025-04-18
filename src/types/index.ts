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
  User
}