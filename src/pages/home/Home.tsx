import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Loader from '../../components/loader';
import { useFetchProductsQuery } from '../../redux/slices/product.slice';
import { IProductData } from '../../models/product/product.model';
import ProductCard from '../../components/product/productList';
import SideBar from '../../components/sidebar/SideBar';
import HamburgerButton from '../../components/hamburguerButton/HamburguerButton';
import { IHomeProps } from './models/home-props..interface';

const Home: React.FC<IHomeProps> = ({ searchTerm }) => {
	const { filter, sort } = useSelector((state: RootState) => state.filter);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const containerRef = useRef<HTMLDivElement>(null);
	
	const {
		data: productData,
		error: productError,
		isLoading: productIsLoading,
		refetch,
	} = useFetchProductsQuery({
		limit: 30,
		page: 1,
		name: debouncedSearchTerm,
		category: filter.category,
		subCategory: filter.subCategory,
		brand: filter.brand,
		size: filter.size,
		gender: filter.gender,
		sort: sort
	});

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => {
			clearTimeout(timerId);
		};
	}, [searchTerm]);

	useEffect(() => {
		refetch();
	}, [debouncedSearchTerm, refetch]);


	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prev) => !prev);
	}, []);

	if (productIsLoading) {
		return <Loader />;
	}

	if (productError) {
		return <div>Error al cargar los productos</div>;
	}

	return (
		<div className='relative'>
			<div className='lg:hidden fixed top-1 left-1 z-50'>
				<HamburgerButton
					isOpen={isSidebarOpen}
					onClick={toggleSidebar}
				/>
			</div>

			<div className='flex'>
				<SideBar isOpen={isSidebarOpen} />

				<div className='flex-grow p-4'>
					<div className='h-12 mb-8 flex justify-center items-center'>
						<h2 className='text-sm font-bold'>
							{productData.totalCount === 1
								? productData.totalCount + ' Resultado'
								: productData.totalCount + ' Resultados'}
						</h2>
					</div>
					<div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto'
						style={{ maxHeight: 'calc(100vh - 150px)' }}
						ref={containerRef}>
						{productData.products.map((product: IProductData) => (
							<div
								key={product._id}
								className='max-w-xl mx-auto pb-2'>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
