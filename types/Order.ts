export interface Order {
  orderId: String;
  orderName: String;
  customer: any;
  /** An array containing the items purchased in this order */
  items?: Array<OrderItem>;
  /** An array containing the groups of items purchased in this order */
  itemGroups?: Array<OrderItemGroup>;
  total?: number;
  // TODO: use the status type that will contain id and description
  statusId: string;
  statusDesc?: string;
  identifications?: any;
  notes?: Array<any>;
}
export interface OrderItem {
  orderItemGroupId?: String;
  orderItemId?: String;
  productId?: String;
  quantity?: number;
  price?: number;
  amount?: number;
  statusId?: String;
}
export interface OrderItemGroup {
  orderItemGroupId?: String;
  shippingAddress?: any;
  billingAddress?: any;
  shippingMethod?: any;
  carrier?: any;
  identifications?: Array<any>;
  facility?: any;
}