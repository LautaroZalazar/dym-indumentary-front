import ProductListInCart from './ProductInCartList';
import ICartItems from './models/cartitem.interface';
import { useEffect, useState } from 'react';
import Loader from '../../components/loader';
import CartSummary from './components/CartSummary';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import EditProductModal from './components/EditProductModal';

const Cart = () => {
	const [userData, setUserData] = useState<any>(null);
	const [cartData, setCartData] = useState<null | any>(null);
	const [localCart, setLocalCart] = useState<ICartItems[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cartVersion, setCartVersion] = useState(0);
	const [updateModalProducts, setUpdateModalProducts] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const baseUrl = import.meta.env.VITE_BACK_URL;
	const user = localStorage.getItem('user');

	useEffect(() => {
		const fetchUserAndCart = async () => {
			try {
				const userResponse = await axios.get(
					`${baseUrl}/v1/user/detail`,
					{
						headers: {
							'Content-Type': 'application/json; charset=UTF-8',
							Authorization: `Bearer ${
								user && JSON.parse(user).token
							}`,
						},
					}
				);
				setUserData(userResponse.data);

				if (
					userResponse.data &&
					userResponse.data.cart &&
					userResponse.data.cart._id
				) {
					const cartResponse = await axios.get(
						`${baseUrl}/v1/cart?id=${userResponse.data.cart._id}`,
						{
							headers: {
								'Content-Type':
									'application/json; charset=UTF-8',
								Authorization: `Bearer ${
									user && JSON.parse(user).token
								}`,
							},
						}
					);
					setCartData(cartResponse.data);
				}
			} catch (error: any) {
				const localCartData = localStorage.getItem('cart');
				if (localCartData) {
					setLocalCart(JSON.parse(localCartData));
				}
				throw new Error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserAndCart();
	}, [cartVersion]);

	const handleRemoveItem = async (
		productId: string,
		sizeId: string,
		colorId: string
	) => {
		try {
			if (user && cartData) {
				await axios.delete(`${baseUrl}/v1/cart`, {
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
						Authorization: `Bearer ${
							user && JSON.parse(user).token
						}`,
					},
					data: {
						cartId: cartData._id,
						productId: productId,
					},
				});
			} else {
				const updatedCart = localCart.filter(
					(product) =>
						!(
							product.product._id === productId &&
							product.size._id === sizeId &&
							product.color._id === colorId
						)
				);
				setLocalCart(updatedCart);
				localStorage.setItem('cart', JSON.stringify(updatedCart));
			}
			setCartVersion((prevVersion) => prevVersion + 1);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	const updateProduct = async (
		productId: string,
		quantity: number,
		colorId: string,
		sizeId: string,
		newColor: string,
		newSize: string
	) => {
		if (quantity < 1) return;

		try {
			if (cartData) {
				const productIndex = cartData.products.findIndex(
					(p: any) =>
						p.product._id === productId &&
						p.color._id === colorId &&
						p.size._id === sizeId
				);
				const newCart = cartData.products.map((p: any) => {
					return {
						productId: p.product._id,
						colorId: p.color._id,
						sizeId: p.size._id,
						quantity: p.quantity,
					};
				});
				newCart[productIndex] = {
					productId,
					quantity,
					colorId: newColor ? newColor : colorId,
					sizeId: newSize ? newSize : sizeId,
				};
				await axios.put(
					`${baseUrl}/v1/cart`,
					{
						cartId: cartData._id,
						products: newCart,
					},
					{
						headers: {
							'Content-Type': 'application/json; charset=UTF-8',
							Authorization: `Bearer ${
								user && JSON.parse(user).token
							}`,
						},
					}
				);
			} else {
				const updatedCart = localCart.map((product) =>
					product.product._id === productId &&
					product.color._id === colorId &&
					product.size._id === sizeId
						? { ...product, quantity: quantity }
						: product
				);
				setLocalCart(updatedCart);
				localStorage.setItem('cart', JSON.stringify(updatedCart));
			}
			setCartVersion((prevVersion) => prevVersion + 1);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	if (isLoading) return <Loader />;

	const cart =
		userData && cartData
			? cartData
			: { products: localCart, shippingCost: 0 };

	const openModal = (product: any) => {
		setUpdateModalProducts(product);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setUpdateModalProducts(null);
	};

	return (
		<div className='md:h-screen py-10'>
			<h1 className='mb-10 text-center text-2xl font-bold'>Mi Carrito</h1>
			{cart.products.length > 0 ? (
				<div className='mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0'>
					<div className='rounded-lg md:w-2/3 md:overflow-auto overflow-hidden md:max-h-[90vh]'>
						<ProductListInCart
							product={cart.products}
							removeItem={handleRemoveItem}
							updateProduct={updateProduct}
							openModal={openModal}
						/>
					</div>
					<div className='mt-6 h-full rounded-lg border border-dymOrange p-6 shadow-md md:mt-0 md:w-1/3'>
						<CartSummary
							cart={cart.products}
							shippingCost={cart.shippingCost}
						/>
						{userData ? (
							<button className='mt-6 w-full rounded-md bg-dymOrange py-1.5 font-medium text-blue-50 hover:bg-blue-600'>
								Comprar ahora
							</button>
						) : (
							<NavLink to={'/auth'}>
								<button className='mt-6 w-full rounded-md bg-dymOrange py-1.5 font-medium text-blue-50 hover:bg-blue-600'>
									Inicia sesión para poder comprar
								</button>
							</NavLink>
						)}
					</div>
				</div>
			) : (
				<div className='flex justify-center w-full'>
					<h1 className='rounded-lg border border-dymOrange p-6'>
						Tu carrito está vacío
					</h1>
				</div>
			)}
			{isModalOpen && (
				<EditProductModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					onClose={closeModal}
					product={updateModalProducts}
					updateProduct={updateProduct}
				/>
			)}
		</div>
	);
};

export default Cart;
