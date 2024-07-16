import { useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/loader';
import { useFetchProductsQuery } from '../../redux/slices/product.slice';
import { IProduct } from '../../models/product/product.model';
import ProductCard from '../../components/product/productList';
import SideBar from '../../components/sidebar/SideBar';
import HamburgerButton from '../../components/hamburguerButton/HamburguerButton';
import { RootState } from '../../redux/store';
import { selectFilters } from '../../redux/slices/filter.slice';

const Home = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const filters = useSelector((state: RootState) => selectFilters(state));
	const {
		data: productData,
		error: productError,
		isLoading: productIsLoading,
	} = useFetchProductsQuery({ limit: 30, page: 1 });

	if (productIsLoading) return <Loader />;
	if (productError) return <div>Error</div>;

	const products: IProduct[] = productData;

	const filteredProducts = products.filter((product: IProduct) => {
		const matchesProductType =
			filters.productType.length === 0 ||
			filters.productType.includes(product.category._id);
		const matchesGender =
			filters.gender.length === 0 ||
			filters.gender.includes(product.gender);
		const matchesBrand =
			filters.brand.length === 0 ||
			filters.brand.includes(product.brand._id);
		const matchesSize =
			filters.size.length === 0 ||
			product.inventory.some((item) =>
				filters.size.includes(item.size._id)
			);

		return (
			matchesProductType && matchesGender && matchesBrand && matchesSize
		);
	});

	const sortedProducts = filteredProducts.sort((a, b) => {
		switch (filters.sort) {
			case 'Más relevantes':
				return 0;
			case 'Menos relevantes':
				return 0;
			case 'Precio más alto':
				return b.price - a.price;
			case 'Precio más bajo':
				return a.price - b.price;
			default:
				return 0;
		}
	});

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

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
							{sortedProducts.length === 1
								? sortedProducts.length + ' Resultado'
								: sortedProducts.length + ' Resultados'}
						</h2>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
						{sortedProducts.map((product) => (
							<div key={product._id} className='max-w-xl mx-auto'>
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
