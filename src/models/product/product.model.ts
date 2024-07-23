import { ISize } from "./size.model";
import { Brand } from "./brand.model";
import { IColor } from "./color.model";
import { Category } from "./category.model";

interface IImage {
    url: string;
    public_id: string;
    _id: string;
}

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    gender: string;
    image: IImage[];
    isActive: boolean;
    brand: Brand;
    category: Category;
    inventory: Array<{
        size: ISize,
        stock: Array<{
            quantity: number,
            color: IColor,
        }>,
    }>
}