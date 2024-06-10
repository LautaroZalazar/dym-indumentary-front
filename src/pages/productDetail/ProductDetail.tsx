import { useParams } from 'react-router-dom';
import { useFetchProductQuery } from '../../redux/slices/product.slice';
import { useEffect, useState } from 'react';
import ImageSlider from './components/ImageSlider';
import Loader from '../../components/loader';
import Button from '../../components/button';
import { IProductInventory } from '../../models/product/product-inventory.model';
import { ISelectedProduct } from '../productDetail/models/selectedProduct.model';

const ProductDetail = () => {
	const { id } = useParams();
	const { data, error, isLoading } = useFetchProductQuery(id);

	const [productInventory, setProductInventory] = useState<
		IProductInventory[]
	>([]);
	const [filteredStock, setFilteredStock] = useState<number | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct>({
		color: '',
		quantity: '',
		size: '',
	});

	useEffect(() => {
		if (data && data.inventory.length > 0) {
			const initialSize = data.inventory[0].size.name;
			const initialColor = data.inventory[0].stock[0].color.hex;
			setSelectedProduct({
				size: initialSize,
				color: initialColor,
				quantity: '1',
			});
		}
	}, [data]);

	useEffect(() => {
		if (selectedProduct.size) {
			const filteredInventory = data?.inventory?.filter(
				(i: any) => i.size.name === selectedProduct.size
			);
			setProductInventory(filteredInventory);

			if (filteredInventory && filteredInventory.length > 0) {
				const firstColor = filteredInventory[0].stock[0].color.hex;
				setSelectedProduct((prevState) => ({
					...prevState,
					color: firstColor,
				}));
			}
		} else {
			setProductInventory(data?.inventory);
		}
	}, [selectedProduct.size, data]);

	useEffect(() => {
		const stock = productInventory?.flatMap((i) =>
			i.stock?.filter((e) => e.color.hex === selectedProduct.color)
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

	if (isLoading) return <Loader />;
	if (error) return <div>Error</div>;

	const handleClick = () => alert('Producto agregado al carrito');

	const handleColorClick = (color: string) =>
		setSelectedProduct({ ...selectedProduct, color });

	const renderColorOptions = () =>
		productInventory?.flatMap((i) =>
			i.stock?.map((e) => (
				<button
					key={e.color.hex}
					className={`border-2 ml-2 rounded-full w-6 h-6 focus:outline-none`}
					style={{
						backgroundColor:
							selectedProduct.color === e.color.hex
								? e.color.hex
								: 'transparent',
						borderColor: e.color.hex,
					}}
					onClick={() => handleColorClick(e.color.hex)}
				/>
			))
		);

	const renderSizeOptions = () =>
		data.inventory?.map((e: any) => (
			<option key={e.size.name} value={e.size.name}>
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
		// <section className='flex justify-center items-center overflow-hidden md:h-screen bg-dymBlack pb-20 pt-6 md:p-0'>
		// 	<div className='container mx-auto'>
		// 		<div className='flex flex-wrap md:flex-nowrap p-5 lg:p-0'>
		// 			<div className='lg:w-2/4 w-full size-max'>
		// 				<ImageSlider images={data.image} />
		// 			</div>
		// 			<div className='lg:w-2/5 w-full lg:py-6 mt-6 lg:mt-0'>
		// 				<div>
		// 					<h1 className='text-dymAntiPop text-3xl font-medium'>
		// 						{data.name}
		// 					</h1>
		// 				</div>
		// 				<div className='h-3/5'>
		// 					<div className='overflow-auto max-h-64'>
		// 						<p className='text-dymAntiPop md:mt-4 leading-relaxed'>
		// 							{data.description}
		// 						</p>
		// 					</div>
		// 				</div>
		// 				<div className='md:flex md:flex-col md:py-6 justify-end'>
		// 					<div className='flex mt-6 items-start flex-col justify-start pb-5 border-b-2 border-gray-200 mb-5'>
		// 						<div className='flex'>
		// 							<span>Color</span>
		// 							{renderColorOptions()}
		// 						</div>
		// 						<div className='flex items-center mt-4'>
		// 							<div className='relative space-x-4'>
		// 								<span>Talle</span>
		// 								<select
		// 									onChange={(e) =>
		// 										setSelectedProduct({
		// 											...selectedProduct,
		// 											size: e.target.value,
		// 										})
		// 									}
		// 									className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10'>
		// 									{renderSizeOptions()}
		// 								</select>
		// 								<span>Cantidad</span>
		// 								<select
		// 									onChange={(e) =>
		// 										setSelectedProduct({
		// 											...selectedProduct,
		// 											quantity: e.target.value,
		// 										})
		// 									}
		// 									className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10'>
		// 									{renderQuantityOptions()}
		// 								</select>
		// 							</div>
		// 						</div>
		// 					</div>
		// 					<div className='flex'>
		// 						<span className='title-font md:mr-2 font-medium text-2xl text-dymAntiPop'>
		// 							$
		// 							{data.price *
		// 								Number(selectedProduct.quantity)}
		// 						</span>
		// 						<div className='flex ml-auto'>
		// 							<Button
		// 								primary={true}
		// 								name='Agregar al carrito'
		// 								disabled={false}
		// 								onClick={handleClick}
		// 							/>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </section>
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
					onChange={(e) =>
					  setSelectedProduct({
						...selectedProduct,
						size: e.target.value,
					  })
					}
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
					onClick={handleClick}
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
