import { useParams } from 'react-router-dom';
import { useFetchProductQuery } from '../../redux/slices/product.slice';
import { useEffect, useState } from 'react';
import ImageSlider from '../../components/ImageSlider';
import Loader from '../../components/loader';
import Button from '../../components/button';
import { IProductInventory } from '../../models/product/product-inventory.model';
import { ISelectedProduct } from '../productDetail/models/selectedProduct.model'

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
		<section className='flex justify-center items-center overflow-hidden md:h-screen bg-dymBlack pb-20 pt-6 md:p-0'>
			<div className='container px-5 mx-auto'>
				<div className='lg:w-4/5 mx-auto flex flex-wrap md:flex-nowrap'>
					<ImageSlider images={data.image} />
					<div className='lg:w-1/2 w-full lg:py-6 mt-6 lg:mt-0'>
						<div>
							<h1 className='text-dymAntiPop text-3xl font-medium'>
								{data.name}
							</h1>
						</div>
						<div className='h-3/5'>
							<div className='overflow-auto max-h-64'>
								<p className='text-dymAntiPop md:mt-4 leading-relaxed'>
									{data.description}
								</p>
							</div>
						</div>
						<div className='md:flex md:flex-col md:py-6 justify-end'>
							<div className='flex mt-6 items-start flex-col justify-start pb-5 border-b-2 border-gray-200 mb-5'>
								<div className='flex'>
									<span>Color</span>
									{renderColorOptions()}
								</div>
								<div className='flex items-center mt-4'>
									<div className='relative space-x-4'>
										<span>Talle</span>
										<select
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													size: e.target.value,
												})
											}
											className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10'>
											{renderSizeOptions()}
										</select>
										<span>Cantidad</span>
										<select
											onChange={(e) =>
												setSelectedProduct({
													...selectedProduct,
													quantity: e.target.value,
												})
											}
											className='w-20 rounded overflow-y-auto border appearance-none border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 pr-10'>
											{renderQuantityOptions()}
										</select>
									</div>
								</div>
							</div>
							<div className='flex'>
								<span className='title-font md:mr-2 font-medium text-2xl text-dymAntiPop'>
									${data.price * Number(selectedProduct.quantity) }
								</span>
								<div className='flex ml-auto'>
									<Button
										primary={true}
										name='Agregar al carrito'
										disabled={false}
										onClick={handleClick}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductDetail;
