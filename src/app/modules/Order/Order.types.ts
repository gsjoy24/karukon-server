import { Types } from 'mongoose';

export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export type TOrderProduct = {
  _id?: string;
  product: Types.ObjectId;
  quantity: number;
  total_price: number;
};

export type TOrder = {
  _id?: string;
  order_id: string;
  customer: Types.ObjectId;
  email: string;
  mobile_number: string;
  products: TOrderProduct[];
  house_number?: string;
  street_address?: string;
  district: string;
  city: string;
  order_note?: string;
  payment_method: string;
  shipping_method: string;
  courier_address?: string;
  status: TOrderStatus;
};
