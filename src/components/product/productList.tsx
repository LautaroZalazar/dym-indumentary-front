import React from 'react';
import { NavLink } from 'react-router-dom';
import { ProductCardProps } from '../../models/productCard.interface';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const brandName = product.brand.name.charAt(0).toUpperCase() + product.brand.name.slice(1);
	const productName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
	const price = `$${product.price.toLocaleString('es-AR')}`;

	return (
		<div className='group flex flex-row md:flex-col rounded-xl overflow-hidden border border-zinc-800 hover:border-dymOrange/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-black/50 h-40 w-80 md:h-auto md:w-full bg-zinc-900'>
			{/* Image container */}
			<div className='relative overflow-hidden w-2/5 flex-shrink-0 md:w-full md:h-72'>
				<img
					src={product.image?.[0]?.url ?? ''}
					alt={productName}
					className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
				/>

				{/* Brand badge — desktop only */}
				<div className='hidden md:block absolute top-3 left-3'>
					<span className='bg-black/70 backdrop-blur-sm text-dymOrange text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md'>
						{brandName}
					</span>
				</div>

				{/* Price badge — desktop only */}
				<div className='hidden md:block absolute top-3 right-3'>
					<span className='bg-dymOrange text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-lg'>
						{price}
					</span>
				</div>

				{/* Hover overlay — desktop only */}
				<div className='hidden md:flex absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex-col justify-end p-4'>
					<h2 className='text-white font-semibold text-base mb-3 leading-tight line-clamp-2'>
						{productName}
					</h2>
					<NavLink
						to={`/detail/${product._id}`}
						className='w-full rounded-lg py-2.5 text-sm font-semibold bg-dymOrange text-white hover:bg-orange-500 active:scale-95 transition-all duration-200 text-center block'>
						Ver detalle →
					</NavLink>
				</div>
			</div>

			{/* Mobile info — always visible, hidden on desktop */}
			<div className='md:hidden p-4 flex flex-col justify-between flex-1'>
				<div>
					<p className='text-xs font-semibold text-dymOrange uppercase tracking-widest mb-1'>
						{brandName}
					</p>
					<h2 className='text-sm font-semibold text-white/90 leading-snug line-clamp-2'>
						{productName}
					</h2>
					<p className='text-base font-bold text-white mt-1'>
						{price}
					</p>
				</div>
				<NavLink
					to={`/detail/${product._id}`}
					className='mt-2 w-full rounded-lg py-1.5 px-3 text-xs font-semibold bg-dymOrange text-white hover:bg-orange-500 active:scale-95 transition-all duration-200 text-center block'>
					Ver detalle
				</NavLink>
			</div>
		</div>
	);
};

export default ProductCard;
