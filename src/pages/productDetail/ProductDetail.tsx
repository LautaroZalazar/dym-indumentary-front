import { useParams } from "react-router-dom";
import { useFetchProductQuery } from "../../redux/slices/product.slice";
import Loader from "../../components/loader";

const ProductDetail = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useFetchProductQuery(id);

  if (isLoading) return <Loader />;

  if (error) return <div>Error</div>;

  return <></>;
};

export default ProductDetail;
