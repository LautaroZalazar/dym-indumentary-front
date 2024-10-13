import React from 'react';
import ICartItem from '../models/cartitem.interface';
import ICartSummaryProps from '../models/cartsummaryprops.interface';
import { useEffect } from 'react';

const calculateTotal = (cart: ICartItem[]) => {
	const subtotal = cart.reduce((total, item) => {
		const { product, quantity } = item;
		return total + product.price * Number(quantity);
	}, 0);

	return { subtotal };
};

const RenderCartSummary = (
	cart: ICartItem[],
	shippingCost: number,
	setTotalPrice?: React.Dispatch<React.SetStateAction<number>>
) => {
	if (!cart || cart.length === 0) return;
	const { subtotal } = calculateTotal(cart);
	const total = subtotal + shippingCost;

	useEffect(() => {
		if (setTotalPrice) {
			setTotalPrice(total);
		}
	}, [cart, shippingCost, total]);

	return (
		<div>
			<div className='flex justify-between'>
				<p className='text-lg font-bold'>Subtotal</p>
				<div>
					<p className='mb-1 text-lg font-bold'>
						${subtotal.toFixed(2)}
					</p>
				</div>
			</div>
			<div className='flex justify-between'>
				<p className='text-lg font-bold'>Costo de envío</p>
				<div>
					<p className='mb-1 text-lg font-bold'>
						${shippingCost.toFixed(2)}
					</p>
				</div>
			</div>
			<hr className='my-4' />
			<div className='flex justify-between'>
				<p className='text-lg font-bold'>Total</p>
				<div>
					<p className='mb-1 text-lg font-bold'>
						${total.toFixed(2)}
					</p>
				</div>
			</div>
		</div>
	);
};

const CartSummary: React.FC<ICartSummaryProps> = ({ cart, shippingCost, setTotalPrice }) => {
	return <div>{RenderCartSummary(cart, shippingCost, setTotalPrice)}</div>;
};

export default CartSummary;
