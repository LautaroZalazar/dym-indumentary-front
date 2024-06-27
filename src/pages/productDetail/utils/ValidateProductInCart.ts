const ValidateProductInCart = (productToCart: any) => {
	let cart = localStorage.getItem('cart');
	let parsedCart = cart ? JSON.parse(cart) : [];

	const existingProductIndex = parsedCart.findIndex(
		(item: any) =>
			item.colorId === productToCart.color._id &&
			item.sizeId === productToCart.size._id &&
			item.productId === productToCart.product._id
	);

	if (existingProductIndex !== -1) {
		parsedCart[existingProductIndex].quantity = productToCart.quantity;
	} else {
		parsedCart.push(productToCart);
	}

	localStorage.setItem('cart', JSON.stringify(parsedCart));
};

export default ValidateProductInCart;
