import { Address } from "./address";
import { OrderItem } from "./order-item";

export class Order {
  id!: number;
  customerId!: number;
  orderDate!: string;
  status!: string;
  totalAmount!: number;
  orderItems!: OrderItem[];
  shippingAddress!: Address;
  billingAddress!: Address;
  customerEmail!: string;

}
