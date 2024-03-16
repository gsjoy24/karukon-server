export type TCoupon = {
  _id?: string;
  code: string;
  discount: number;
  expireDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
