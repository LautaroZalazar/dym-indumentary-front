import ICartItems from './cartitem.interface';

export default interface ICartSummaryProps {
	cart: ICartItems[];
	shippingCost: number;
	setTotalPrice: React.Dispatch<React.SetStateAction<number>>
}
