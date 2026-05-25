import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import Loader from '../../components/loader';
import { useFetchProductsQuery } from '../../redux/slices/product.slice';
import { IProductData } from '../../models/product/product.model';
import ProductCard from '../../components/product/productList';
import SideBar from '../../components/sidebar/SideBar';
import HamburgerButton from '../../components/hamburguerButton/HamburguerButton';
import { IHomeProps } from './models/home-props..interface';
import { setPage } from '../../redux/slices/filter.silce';

const Home: React.FC<IHomeProps> = ({ searchTerm }) => {
	const dispatch = useDispatch()
	const { filter, sort, page } = useSelector((state: RootState) => state.filter);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
	const containerRef = useRef<HTMLDivElement>(null);
	const [allProducts, setAllProducts] = useState<IProductData[]>([]);
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const {
		data: productData,
		error: productError,
		isLoading: productIsLoading,
		refetch,
		isFetching,
	} = useFetchProductsQuery({
		limit: 30,
		page: page,
		name: debouncedSearchTerm,
		category: filter.category,
		subCategory: filter.subCategory,
		brand: filter.brand,
		size: filter.size,
		gender: filter.gender,
		sort: sort,
	});

	useEffect(() => {
		const timerId = setTimeout(() => {
			dispatch(setPage(1))
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => {
			clearTimeout(timerId);
		};
	}, [searchTerm]);

	useEffect(() => {
		if (page === 1) {
			setAllProducts([]);
		}
		refetch();
	}, [debouncedSearchTerm, filter, sort, page, refetch]);

	

	useEffect(() => {
		if (productData && productData.products) {
			setAllProducts((prevProducts) => [
				...prevProducts,
				...productData.products,
			]);
			setIsFetchingMore(false);
		}
	}, [productData]);

	const throttle = (func: () => void, delay: number) => {
		let inThrottle: boolean;
		return function () {
			if (!inThrottle) {
				func();
				inThrottle = true;
				setTimeout(() => (inThrottle = false), delay);
			}
		};
	};

	const handleScroll = throttle(() => {
		const container = containerRef.current;
		if (container) {
			const { scrollTop, scrollHeight, clientHeight } = container;
			if (
				scrollTop + clientHeight >= scrollHeight - 1000 &&
				!isFetchingMore &&
				!isFetching
			) {
				setIsFetchingMore(true);
				dispatch(setPage(page + 1))
			}
		}
	}, 200);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}, [isFetchingMore, isFetching]);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prev) => !prev);
	}, []);

	if (productIsLoading) {
		return <Loader />;
	}

	if (productError) {
		return <div>Error al cargar los productos</div>;
	}

	const hasMoreProducts = productData?.products.length === 30;

	return (
		<div className='h-screen overflow-hidden'>
			<div className='lg:hidden fixed top-3 left-2 z-50'>
				<HamburgerButton
					isOpen={isSidebarOpen}
					onClick={toggleSidebar}
				/>
			</div>

			<div className='flex'>
				<SideBar isOpen={isSidebarOpen} />

				<div className='flex-grow p-3 pt-16'>
					<div className='h-10 flex items-center px-1 mb-1'>
						<span className='text-xs font-medium text-zinc-500 uppercase tracking-wide'>
							{productData.totalCount === 1
								? `${productData.totalCount} resultado`
								: `${productData.totalCount} resultados`}
						</span>
					</div>
					{productData.totalCount === 0 ? (
						<div className='flex flex-col items-center justify-center h-[calc(100vh-166px)] md:h-[calc(100vh-126px)] gap-4 text-center px-4'>
							<svg xmlns='http://www.w3.org/2000/svg' className='w-16 h-16 text-zinc-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.2}>
								<path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z' />
							</svg>
							<p className='text-zinc-300 text-lg font-semibold'>Sin resultados</p>
							<p className='text-zinc-500 text-sm max-w-xs'>
								No encontramos productos que coincidan con los filtros seleccionados. Probá ajustando la búsqueda o eliminando algunos filtros.
							</p>
						</div>
					) : (
						<div
							className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-166px)] md:max-h-[calc(100vh-126px)] overflow-y-auto pr-2 pb-16 md:pb-0'
							ref={containerRef}>
							{allProducts.map((product: IProductData) => (
								<div
									key={product._id}
									className='max-w-xl mx-auto pb-2'>
									<ProductCard product={product} />
								</div>
							))}
							{isFetchingMore && hasMoreProducts && (
								<div className='col-span-full flex justify-center py-4'>
									<div className='w-6 h-6 border-4 border-dymOrange border-t-transparent border-solid rounded-full animate-spin'></div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
