import { Brand } from './brand.model';
import { Category } from './category.model';
import { ISubCategory } from './subCategory.model';

interface IImage {
	url: string;
	public_id: string;
	_id: string;
}

export interface IProductData {
	_id: string;
	name: string;
	description: string;
	price: number;
	gender: string;
	image: IImage[];
	isActive: boolean;
	brand: Brand;
	category: Category;
	subCategory: ISubCategory;
	totalStock?: number;
}

export interface IProduct {
	products: IProductData[];
	totalCount: number;
}
