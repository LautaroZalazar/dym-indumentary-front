import React from 'react';
import ICartItem from '../models/cartitem.interface';
import ICartSummaryProps from '../models/cartsummaryprops.interface';

const calculateTotal = (cart: ICartItem[]) => {
	const subtotal = cart.reduce((total, item) => {
		const { product, quantity } = item;
		return total + product.price * Number(quantity);
	}, 0);

	return { subtotal };
};

const renderCartSummary = (cart: ICartItem[], shippingCost: number) => {
	const { subtotal } = calculateTotal(cart);
	const total = subtotal + shippingCost;

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

const CartSummary: React.FC<ICartSummaryProps> = ({
	cart,
	shippingCost,
}) => {
	return <div>{renderCartSummary(cart, shippingCost)}</div>;
};

export default CartSummary;
