import { useParams } from 'react-router-dom';
import { useFetchProductQuery } from '../../redux/slices/product.slice';
import { useFetchPublicVariantsQuery } from '../../redux/slices/variant.slice';
import { useEffect, useMemo, useState } from 'react';
import ImageSlider from './components/ImageSlider';
import Loader from '../../components/loader';
import { ISelectedProduct } from '../productDetail/models/selectedProduct.model';
import { useAddProductToCartMutation } from '../../redux/slices/cart.slice';
import ValidateProductToCart from './utils/ValidateProductInCart';
import { useGetUserByIdQuery } from '../../redux/slices/user.slice';
import { useMessage } from '../../hooks/alertMessage';
import { IPublicVariant } from '../../models/variant/variant.model';
import { ISize } from '../../models/product/size.model';
import { IColor } from '../../models/product/color.model';

const ProductDetail = () => {
	const { id } = useParams();
	const { data, error, isLoading } = useFetchProductQuery(id);
	const { data: variants, isLoading: variantsLoading } =
		useFetchPublicVariantsQuery(id ?? '', { skip: !id });
	const { data: userData, isLoading: dataIsLoading } =
		useGetUserByIdQuery(null);
	const [addProductCart] = useAddProductToCartMutation();
	const [selectedProduct, setSelectedProduct] = useState<ISelectedProduct>({
		color: { _id: '', hex: '' },
		quantity: '',
		size: { _id: '', name: '' },
	});
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const { MessageComponent, showMessage } = useMessage();

	const sizesAvailable: ISize[] = useMemo(() => {
		if (!variants) return [];
		const map = new Map<string, ISize>();
		variants.forEach((v: IPublicVariant) => {
			if (v.quantity > 0 && !map.has(v.size._id)) {
				map.set(v.size._id, { _id: v.size._id, name: v.size.name });
			}
		});
		return Array.from(map.values());
	}, [variants]);

	const colorsForSelectedSize: IColor[] = useMemo(() => {
		if (!variants || !selectedProduct.size._id) return [];
		const map = new Map<string, IColor>();
		variants.forEach((v: IPublicVariant) => {
			if (v.size._id === selectedProduct.size._id && v.quantity > 0) {
				if (!map.has(v.color._id)) map.set(v.color._id, v.color);
			}
		});
		return Array.from(map.values());
	}, [variants, selectedProduct.size._id]);

	const currentVariant = useMemo(() => {
		if (!variants) return null;
		return (
			variants.find(
				(v: IPublicVariant) =>
					v.size._id === selectedProduct.size._id &&
					v.color._id === selectedProduct.color._id,
			) ?? null
		);
	}, [variants, selectedProduct.size._id, selectedProduct.color._id]);

	const filteredStock = currentVariant ? Math.min(currentVariant.quantity, 10) : 0;

	useEffect(() => {
		if (sizesAvailable.length > 0 && !selectedProduct.size._id) {
			const firstSize = sizesAvailable[0];
			const firstVariant = variants?.find(
				(v) => v.size._id === firstSize._id && v.quantity > 0,
			);
			setSelectedProduct({
				size: firstSize,
				color: firstVariant
					? firstVariant.color
					: { _id: '', hex: '', name: '' },
				quantity: '1',
			});
		}
	}, [sizesAvailable, variants]);

	useEffect(() => {
		if (
			selectedProduct.size._id &&
			colorsForSelectedSize.length > 0 &&
			!colorsForSelectedSize.find((c) => c._id === selectedProduct.color._id)
		) {
			setSelectedProduct((prev) => ({
				...prev,
				color: colorsForSelectedSize[0],
			}));
		}
	}, [colorsForSelectedSize, selectedProduct.size._id]);

	if (isLoading || dataIsLoading || variantsLoading) return <Loader />;
	if (error) return <div>Error</div>;

	const handleAddProductCart = async (e: any) => {
		e.preventDefault();
		const productToCartForBackend = {
			colorId: selectedProduct.color._id,
			quantity: Number(selectedProduct.quantity),
			sizeId: selectedProduct.size._id,
			productId: id,
		};

		const productToCartForLocalStorage = {
			product: {
				name: data.name,
				price: data.price,
				image: data.image,
				_id: id,
			},
			color: selectedProduct.color,
			size: selectedProduct.size,
			quantity: Number(selectedProduct.quantity),
		};
		try {
			if (localStorage.getItem('user')) {
				await addProductCart({
					products: [productToCartForBackend],
					cartId: userData.cart._id,
				});
			} else {
				ValidateProductToCart(productToCartForLocalStorage);
			}
			showMessage(
				'success',
				`Se agregó "${data.name}" al carrito`,
				3000
			);
		} catch (error: any) {
			showMessage(
				'error',
				`Error al agregar "${data.name}" al carrito`,
				3000
			);
			throw new Error(error.message);
		}
	};

	const handleColorClick = (color: IColor) => {
		setSelectedProduct({
			...selectedProduct,
			color,
		});
	};

	const renderColorOptions = () =>
		colorsForSelectedSize.map((color) => {
			const isSelected = selectedProduct.color._id === color._id;
			return (
				<button
					key={color._id}
					title={color.name}
					className={`rounded-full w-8 h-8 focus:outline-none transition-all duration-200 ${
						isSelected
							? 'ring-2 ring-dymOrange ring-offset-2 ring-offset-dymBlack scale-110 shadow-md'
							: 'ring-1 ring-zinc-600 hover:ring-zinc-400 hover:ring-offset-2 hover:ring-offset-dymBlack hover:scale-105'
					}`}
					style={{ backgroundColor: color.hex }}
					onClick={() => handleColorClick(color)}
				/>
			);
		});

	const renderSizeOptions = () =>
		sizesAvailable.map((size) => (
			<option key={size._id} value={size._id} data-name={size.name}>
				{size.name}
			</option>
		));

	const renderQuantityOptions = () =>
		Array.from({ length: filteredStock || 0 }, (_, i) => i + 1).map(
			(quantity) => (
				<option key={quantity} value={quantity}>
					{quantity}
				</option>
			),
		);

	const toggleDescription = () => {
		setIsDescriptionExpanded(!isDescriptionExpanded);
	};

	return (
		<div className='flex items-start md:items-center min-h-screen container mx-auto px-4 py-8 md:py-16'>
			<div className='flex w-full flex-col md:flex-row items-start md:justify-center pt-12 pb-12 md:pb-0 md:gap-12'>
				<section className='w-full md:w-[45%] mb-8 md:mb-0'>
					<ImageSlider images={data.image} />
				</section>
				<div className='flex flex-col w-full md:w-2/5 md:sticky md:top-24'>
					<section className='mb-6'>
						<h1 className='text-dymAntiPop text-4xl font-semibold mb-3 leading-tight tracking-tight'>
							{data.name.charAt(0).toUpperCase() + data.name.slice(1)}
						</h1>
						<div>
							<div
								className={`lg:max-h-32 lg:overflow-y-auto ${
									isDescriptionExpanded ? '' : 'line-clamp-2 lg:line-clamp-none'
								}`}>
								<p className='text-zinc-400 text-sm leading-relaxed pr-1'>
									{data.description.charAt(0).toUpperCase() +
										data.description.slice(1)}
								</p>
							</div>
							<button
								onClick={toggleDescription}
								className='mt-1.5 text-dymOrange text-sm hover:text-orange-400 transition-colors lg:hidden'>
								{isDescriptionExpanded ? 'Leer menos' : 'Leer más'}
							</button>
						</div>
					</section>
					<section className='flex flex-col gap-5 pb-6 border-b border-zinc-700 mb-6'>
						<div>
							<span className='text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-3'>
								Color
							</span>
							<div className='flex items-center gap-2'>
								{renderColorOptions()}
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<span className='text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2'>
									Talle
								</span>
								<select
									value={selectedProduct.size._id}
									onChange={(e) => {
										const sizeId = e.target.value;
										const sizeName =
											e.target.options[
												e.target.selectedIndex
											].getAttribute('data-name') ?? '';
										setSelectedProduct({
											...selectedProduct,
											size: { _id: sizeId, name: sizeName },
										});
									}}
									className='w-full bg-zinc-800 text-dymAntiPop rounded-lg border border-zinc-600 py-2.5 px-3 focus:outline-none focus:border-dymOrange text-sm transition-colors cursor-pointer'>
									{renderSizeOptions()}
								</select>
							</div>
							<div>
								<span className='text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2'>
									Cantidad
								</span>
								<select
									value={selectedProduct.quantity}
									onChange={(e) =>
										setSelectedProduct({
											...selectedProduct,
											quantity: e.target.value,
										})
									}
									className='w-full bg-zinc-800 text-dymAntiPop rounded-lg border border-zinc-600 py-2.5 px-3 focus:outline-none focus:border-dymOrange text-sm transition-colors cursor-pointer'>
									{renderQuantityOptions()}
								</select>
							</div>
						</div>
					</section>
					<div className='flex flex-col gap-4'>
						<div>
							<span className='text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-1'>
								Precio
							</span>
							<div className='flex items-baseline gap-3'>
								<span className='text-4xl font-bold text-dymAntiPop'>
									${(data.price * Number(selectedProduct.quantity || 0)).toLocaleString('es-AR')}
								</span>
								{Number(selectedProduct.quantity) > 1 && (
									<span className='text-sm text-zinc-500'>
										${data.price.toLocaleString('es-AR')} c/u
									</span>
								)}
							</div>
						</div>
						<button
							onClick={handleAddProductCart}
							disabled={!filteredStock}
							className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ${
								filteredStock
									? 'bg-dymOrange hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 active:scale-[0.98]'
									: 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
							}`}>
							{filteredStock ? 'Agregar al carrito' : 'Sin stock'}
						</button>
					</div>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default ProductDetail;
