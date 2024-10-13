import { useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACK_URL;

const useMergeCarts = () => {
	const [isMerging, setIsMerging] = useState(false);

	const mergeCarts = async (userCartId: string) => {
		setIsMerging(true);
		const user = localStorage.getItem('user')
		const localCartData = localStorage.getItem('cart');
		if (localCartData) {
			const localCart = JSON.parse(localCartData);
			if (localCart.length > 0) {
				try {
					const productsToBack = localCart.map((item: any) => ({
						productId: item.product._id,
						colorId: item.color._id,
						sizeId: item.size._id,
						quantity: item.quantity,
					}));

					await axios.post(
						`${baseUrl}/v1/cart`,
						{
							products: productsToBack,
							cartId: userCartId,
						},
						{
							headers: {
								'Content-Type': 'application/json; charset=UTF-8',
								'Authorization': `Bearer ${user && JSON.parse(user).user.token}`,
							},
						}
					);

					localStorage.removeItem('cart');
				} catch (error: any) {
					throw new Error(error)
				}
			} else localStorage.removeItem('cart');
		}
		setIsMerging(false);
	};

	return { mergeCarts, isMerging };
};

export default useMergeCarts;
