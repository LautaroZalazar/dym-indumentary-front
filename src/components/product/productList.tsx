import React from 'react';
import { NavLink } from 'react-router-dom';
import { ProductCardProps } from '../../models/productCard.interface';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

	return (
		<div className='flex flex-row md:flex-col border overflow-hidden shadow-sm md:h-full h-40 w-80 md:w-full'>
			<div className='relative w-full'>
				<img
					src={product.image[0]}
					alt={product.name}
					className='w-full md:h-96 h-full object-cover md:object-fit'
				/>
			</div>
			<div className='bg-dymAntiPop p-4 text-dymBlack w-full'>
				<p className='text-md font-bold'>{product.brand.name.charAt(0).toUpperCase() +
								product.brand.name.slice(1)}</p>
				<h2 className='text-lg font-semibold'>
				{product.name.charAt(0).toUpperCase() +
								product.name.slice(1)}
					<p className='text-xl font-bold'>${product.price}</p>
				</h2>
				<div className='flex justify-center mt-2'>
					<NavLink
						to={`/detail/${product._id}`}
						className='rounded-lg py-1 px-2 font-medium bg-dymOrange text-dymBlack shadow-md'>
						Ver detalle
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
