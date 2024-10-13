import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '../../redux/slices/user.slice';
import axios from 'axios';
import Loader from '../../components/loader';
import { AUTH_HEADERS } from '../../redux/constants/custom-headers';
import ICartData from '../../pages/cart/models/cartdata.interface';

const PaymentFinished = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const paymentStatus = searchParams.get('paymentStatus');
	const { data: userData, isLoading: userIsLoading } =
		useGetUserByIdQuery(null);
	const baseUrl = import.meta.env.VITE_BACK_URL;

	const generateOrder = async (cart: ICartData, status: string) => {
		await axios.post(
			`${baseUrl}/v1/order`,
			{
				cart: JSON.stringify(cart),
				total: cart.total,
				status,
			},
			{ headers: AUTH_HEADERS }
		);
	};
	const fetchCart = async () => {
		if (userData) {
			const response = await axios.get(
				`${baseUrl}/v1/cart?id=${userData.cart._id}`,
				{ headers: AUTH_HEADERS }
			);
			const status = paymentStatus === 'true' ? 'completed' : 'cancelled';
			generateOrder(response.data, status);
			if(paymentStatus === 'true'){
			await axios.put(
				`${baseUrl}/v1/cart/clear`,
				{ cartId: response.data._id },
				{ headers: AUTH_HEADERS }
			);
		}
			setTimeout(() => {
				navigate('/')
			}, 2000);
		}
	};
	useEffect(() => {
		fetchCart();
	}, [userData]);

	if (userIsLoading) return <Loader />;

	return (
		<div className='flex justify-center w-full h-screen pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col w-full md:w-3/4 justify-center items-center h-screen bg-dymBlack p-4'>
				<section className='h-28 w-full md:w-1/2 xl:w-1/3 border border-dymOrange rounded-md'>
					<div className='h-full flex flex-col justify-center items-center p-2'>
						{paymentStatus === 'true' ? (
							<h1>Gracias por tu compra!</h1>
						) : (
							<h1>Ocurrio un error al realizar el pago</h1>
						)}
					</div>
				</section>
				<p className='p-2 opacity-20'>
					Te redireccionaremos en unos instantes
				</p>
			</div>
		</div>
	);
};

export default PaymentFinished;
