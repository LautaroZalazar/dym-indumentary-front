import Loader from '../../components/loader';
import { useFetchProductsQuery } from '../../redux/slices/product.slice';
import { IProduct } from '../../models/product/product.model';
import ProductCard from '../../components/product/productList';

const Home = () => {
	const {
		data: productData,
		error: productError,
		isLoading: productIsLoading,
	} = useFetchProductsQuery(null);


	if (productIsLoading) return <Loader />;

	if (productError) return <div>Error</div>;

	const products: IProduct[] = productData;

	return (
		<div className='flex p-6 md:w-full justify-center'>
			<div className='flex  items-center'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{products.map((product) => (
						<ProductCard product={product} key={product._id} />
					))}
				</div>
			</div>
		</div>
	);
};
export default Home;
