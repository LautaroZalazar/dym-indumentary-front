import React from "react";
import { Product } from "../../models/product/product.model";
import { NavLink } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-dymAntiPop shadow-md rounded-lg h-40 w-72 my-2 md:mx-8 md:w-1/3 flex flex-row">
      <div className="w-1/2 flex justify-center items-center">
        <img src={product.image[0]} alt={product.name} />
      </div>
      <div className="overflow-auto flex flex-col justify-evenly w-1/2">
        <div>
          <p className="text-dymBlack font-medium">{product.name}</p>
          <p className="text-dymBlack font-medium">{product.brand.name}</p>
          <p className="text-dymBlack font-medium">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-center">
          <NavLink
            className="rounded-lg py-1 px-2 font-medium bg-dymOrange text-dymBlack shadow-md"
            to={`/detail/${product._id}`}
          >
            Ver detalle
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
