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
			<div className='lg:hidden fixed top-1 left-1 z-50'>
				<HamburgerButton
					isOpen={isSidebarOpen}
					onClick={toggleSidebar}
				/>
			</div>

			<div className='flex'>
				<SideBar isOpen={isSidebarOpen} />

				<div className='flex-grow p-2 pt-12 pb-12 md:pb-0'>
					<div className='h-12 flex static justify-center items-center text-cemter'>
						<h2 className='text-sm font-bold'>
							{productData.totalCount === 1
								? productData.totalCount + ' Resultado'
								: productData.totalCount + ' Resultados'}
						</h2>
					</div>
					<div
						className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto'
						style={{ maxHeight: 'calc(100vh - 110px)' }}
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
				</div>
			</div>
		</div>
	);
};

export default Home;
