import { Size } from "./size.model";
import { Brand } from "./brand.model";
import { Color } from "./color.model";
import { Category } from "./category.model";

export interface IProduct {
    _id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    gender: string;
    image: string[];
    brand: Brand;
    category: Category[];
    inventory: Array<{
        size: Size,
        stock: Array<{
            quantity: number,
            color: Color,
        }>,
    }>
}