const ValidateProductInCart = ( productToCart: any ) => {
	let cart = localStorage.getItem('cart');
	let parsedCart = cart ? JSON.parse(cart) : [];

	const existingProductIndex = parsedCart.findIndex(
		(item: any) =>
			item.colorId === productToCart.colorId &&
			item.sizeId === productToCart.sizeId &&
			item.productId === productToCart.productId
	);

	if (existingProductIndex !== -1) {
		parsedCart[existingProductIndex].quantity = productToCart.quantity;
	} else {
		parsedCart.push(productToCart);
	}

	localStorage.setItem('cart', JSON.stringify(parsedCart));
};

export default ValidateProductInCart;
