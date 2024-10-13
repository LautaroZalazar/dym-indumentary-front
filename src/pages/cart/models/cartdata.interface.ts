import ICartItem from './cartitem.interface';

export default interface ICartData {
  products: ICartItem[];
  shippingCost: number;
  _id: string;
  total: number;
}
