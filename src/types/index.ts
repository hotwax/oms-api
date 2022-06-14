import { CommunicationEvent } from "./CommunicationEvent";
import { ContactMech } from "./ContactMech";
import { Enumeration } from "./Enumeration";
import { Geo } from "./Geo";
import { Order, OrderItem, OrderPart } from "./Order";
import { Party, PartyIdentification } from "./Party";
import { Status } from "./Status";
import { Uom } from "./Uom";

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
  CommunicationEvent,
  ContactMech,
  Enumeration,
  Geo,
  PartyIdentification,
  Order,
  OrderItem,
  OrderPart,
  Party,
  Status,
  Uom
}
