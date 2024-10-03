import ProductListInCart from './ProductInCartList';
import ICartItems from './models/cartitem.interface';
import { useEffect, useState } from 'react';
import Loader from '../../components/loader';
import CartSummary from './components/CartSummary';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import EditProductModal from './components/EditProductModal';
import { useMessage } from '../../hooks/alertMessage';

const Cart = () => {
	const [userData, setUserData] = useState<any>(null);
	const [cartData, setCartData] = useState<null | any>(null);
	const [localCart, setLocalCart] = useState<ICartItems[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cartVersion, setCartVersion] = useState(0);
	const [updateModalProducts, setUpdateModalProducts] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const baseUrl = import.meta.env.VITE_BACK_URL;
	const user = localStorage.getItem('user');
	const { MessageComponent, showMessage } = useMessage();

	useEffect(() => {
		const fetchUserAndCart = async () => {
			try {
				const userResponse = await axios.get(
					`${baseUrl}/v1/user/detail`,
					{
						headers: {
							'Content-Type': 'application/json; charset=UTF-8',
							Authorization: `Bearer ${
								user && JSON.parse(user).user.token
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
									user && JSON.parse(user).user.token
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
							user && JSON.parse(user).user.token
						}`,
					},
					data: {
						cartId: cartData._id,
						productId: productId,
						sizeId: sizeId,
						colorId: colorId,
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
			showMessage(
				'success',
				`El producto se eliminó correctamente`,
				3000
			);
		} catch (error: any) {
			showMessage(
				'error',
				`Error al eliminar el producto`,
				3000
			);
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
								user && JSON.parse(user).user.token
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
			showMessage(
				'success',
				`El producto se actualizó correctamente`,
				3000
			);
		} catch (error: any) {
			showMessage(
				'error',
				`Error al actualizar el producto`,
				3000
			);
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

	const handlePayment = () => {
		setIsLoading(true);
		// Paso 1: Función para obtener el token de autorización
		async function obtenerToken() {
			const url = import.meta.env.VITE_UALA_URL;

			const body = {
				username: import.meta.env.VITE_UALA_USER_NAME,
				client_id: import.meta.env.VITE_UALA_CLIENT_ID,
				client_secret_id: import.meta.env.VITE_UALA_CLIENT_SECRET_ID,
				grant_type: 'client_credentials',
			};

			try {
				if (url) {
					const response = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
					});
					if (!response.ok) {
						throw new Error(
							'Error en la solicitud: ' + response.statusText
						);
					}

					const data = await response.json();
					return data.access_token;
				}
			} catch (error) {
				console.error('Error al obtener el token:', error);
			}
		}

		// Paso 2: Función para crear una orden de pago
		async function crearOrdenDePago(token: string) {
			const url = import.meta.env.VITE_UALA_CREATE_ORDER_URL;

			const body = {
				amount: totalPrice,
				description: 'DYM-VENTA',
				callback_success: 'http://localhost:5173/PaymentFinished?paymentStatus=true',
				callback_fail: 'http://localhost:5173/PaymentFinished?paymentStatus=false',
				external_reference: 'DYM',
			};

			try {
				if (url) {
					const response = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`, // Incluye el token de autorización
						},
						body: JSON.stringify(body),
					});

					if (!response.ok) {
						throw new Error(
							'Error en la solicitud: ' + response.statusText
						);
					}

					const data = await response?.json();
					(await data?.links?.checkout_link) &&
						(window.location = data?.links?.checkout_link);
					setIsLoading(false);
					return data;
				}
			} catch (error) {
				console.error('Error al generar la orden de pago:', error);
				setIsLoading(false);
			}
		}
		// Ejecución: Obtén el token y luego crea la orden de pago
		obtenerToken().then((token) => {
			crearOrdenDePago(token);
		});
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
							cart={cart.products || []}
							shippingCost={cart.shippingCost || 0}
							setTotalPrice={setTotalPrice}
						/>
						{userData ? (
							<button
								onClick={handlePayment}
								className='mt-6 w-full rounded-md bg-dymOrange py-1.5 font-medium text-blue-50 hover:bg-blue-600'>
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
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default Cart;
