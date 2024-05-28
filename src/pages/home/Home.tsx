import Loader from "../../components/loader";
import { useFetchProductsQuery } from "../../redux/slices/product.slice";
import { Product } from "../../models/product/product.model";
import ProductCard from "../../components/product/productList";

const Home = () => {
  const { data, error, isLoading } = useFetchProductsQuery(null);

  if (isLoading) return <Loader />;

  if (error) return <div>Error</div>;

  const products: Product[] = data;

  return (
    <div className="flex flex-col items-center md:flex-row flex-wrap md:justify-center">
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
};
export default Home;
