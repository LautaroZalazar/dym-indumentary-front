import { useParams } from 'react-router-dom';
import { useFetchProductQuery } from '../../redux/slices/product.slice';
import { useEffect, useState } from 'react';
import ImageSlider from './components/ImageSlider';
import Loader from '../../components/loader';
import Button from '../../components/button';
import { IProductInventory } from '../../models/product/product-inventory.model';
import { ISelectedProduct } from '../productDetail/models/selectedProduct.model';
import { useAddProductToCartMutation } from '../../redux/slices/cart.slice';
import ValidateProductToCart from './utils/ValidateProductInCart';
import { useGetUserByIdQuery } from '../../redux/slices/user.slice';

const ProductDetail = () => {
	const { id } = useParams();
	const { data, error, isLoading } = useFetchProductQuery(id);
	const { data: userData, isLoading: dataIsLoading } =
		useGetUserByIdQuery(null);
	const [addProductCart] = useAddProductToCartMutation();
	const [productInventory, setProductInventory] = useState<
		IProductInventory[]
	>([]);
	const [filteredStock, setFilteredStock] = useState<number | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct>({
		color: { _id: '', hex: '' },
		quantity: '',
		size: { _id: '', name: '' },
	});

	useEffect(() => {
		if (data && data.inventory.length > 0) {
			const initialSize = data.inventory[0].size.name;
			const initialSizeId = data.inventory[0].size._id;
			const initialColor = data.inventory[0].stock[0].color.hex;
			const initialColorId = data.inventory[0].stock[0].color._id;
			setSelectedProduct({
				size: { _id: initialSizeId, name: initialSize },
				color: { _id: initialColorId, hex: initialColor },
				quantity: '1',
			});
		}
	}, [data]);

	useEffect(() => {
		if (selectedProduct.size._id) {
			const filteredInventory = data?.inventory?.filter(
				(i: any) => i.size._id === selectedProduct.size._id
			);
			setProductInventory(filteredInventory);

			if (filteredInventory && filteredInventory.length > 0) {
				const firstColor = filteredInventory[0].stock[0].color.hex;
				const firstColorId = filteredInventory[0].stock[0].color._id;
				setSelectedProduct((prevState) => ({
					...prevState,
					color: { _id: firstColorId, hex: firstColor },
				}));
			}
		} else {
			setProductInventory(data?.inventory);
		}
	}, [selectedProduct.size._id, data]);

	useEffect(() => {
		const stock = productInventory?.flatMap((i) =>
			i.stock?.filter((e) => e.color.hex === selectedProduct.color.hex)
		);
		setFilteredStock(
			stock
				? Math.min(
						stock.reduce((acc, item) => acc + item.quantity, 0),
						10
				  )
				: null
		);
	}, [selectedProduct.color, productInventory]);

	if (isLoading || dataIsLoading) return <Loader />;
	if (error) return <div>Error</div>;

	const handleAddProductCart = async (e: any) => {
		e.preventDefault();
		const productToCart = {
			colorId: selectedProduct.color._id,
			quantity: Number(selectedProduct.quantity),
			sizeId: selectedProduct.size._id,
			productId: id,
		};
		try {
			if (localStorage.getItem('user')) {
				await addProductCart({
					products: [productToCart],
					cartId: userData.cart._id,
				});
			} else {
				ValidateProductToCart(productToCart);
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const handleColorClick = (color: string, id: string) => {
		setSelectedProduct({
			...selectedProduct,
			color: { _id: id, hex: color },
		});
	};

	const renderColorOptions = () =>
		productInventory?.flatMap((i) =>
			i.stock?.map((e) => (
				<button
					key={e.color._id}
					className={`border-2 ml-2 rounded-full w-6 h-6 focus:outline-none`}
					style={{
						backgroundColor:
							selectedProduct.color.hex === e.color.hex
								? e.color.hex
								: 'transparent',
						borderColor: e.color.hex,
					}}
					onClick={() => handleColorClick(e.color.hex, e.color._id)}
				/>
			))
		);

	const renderSizeOptions = () =>
		data.inventory?.map((e: any) => (
			<option key={e.size._id} value={e.size._id} data-name={e.size.name}>
				{e.size.name}
			</option>
		));

	const renderQuantityOptions = () =>
		Array.from({ length: filteredStock || 0 }, (_, i) => i + 1).map(
			(quantity) => (
				<option key={quantity} value={quantity}>
					{quantity}
				</option>
			)
		);

	return (
		<div className='flex items-center md:h-screen container mx-auto px-4 py-8 md:py-16'>
			<div className='flex flex-col md:flex-row items-center md:items-start'>
				<section className='w-full md:w-1/2 mb-8 md:mb-0'>
					<ImageSlider images={data.image} />
				</section>
				<div className='flex flex-col w-full md:w-1/2 md:pl-8'>
					<section className='mb-8'>
						<h1 className='text-dymAntiPop text-3xl font-medium mb-4'>
							{data.name}
						</h1>
						<div className='h-auto md:h-48'>
							<div className='overflow-auto max-h-full md:max-h-48'>
								<p className='text-dymAntiPop leading-relaxed'>
									{data.description}
								</p>
							</div>
						</div>
					</section>
					<section>
						<div className='flex flex-col pb-5 border-b-2 border-gray-200 mb-5'>
							<div className='flex items-center mb-4'>
								<span className='mr-4'>Color</span>
								{renderColorOptions()}
							</div>
							<div className='flex flex-col md:flex-row flex-wrap md:items-center'>
								<span className='mr-4 mb-2'>Talle</span>
								<select
									onChange={(e) => {
										setSelectedProduct({
											...selectedProduct,
											size: {
												_id: e.target.value,
												name:
													e.target.options[
														e.target.selectedIndex
													].getAttribute(
														'data-name'
													) ?? '',
											},
										});
									}}
									className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10 mr-6 mb-2'>
									{renderSizeOptions()}
								</select>
								<span className='mr-4 mb-2'>Cantidad</span>
								<select
									onChange={(e) =>
										setSelectedProduct({
											...selectedProduct,
											quantity: e.target.value,
										})
									}
									className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10 mb-2'>
									{renderQuantityOptions()}
								</select>
							</div>
						</div>
						<div className='flex flex-row items-center justify-center w-full'>
							<span className='title-font font-medium text-2xl  text-dymAntiPop md:mb-0 md:mr-8'>
								${data.price * Number(selectedProduct.quantity)}
							</span>
							<div className='ml-auto'>
								<Button
									primary={true}
									name='Agregar al carrito'
									disabled={false}
									onClick={handleAddProductCart}
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
