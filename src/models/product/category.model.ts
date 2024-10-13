import { ISubCategory } from "./subCategory.model";

export interface Category {
    _id: string;
    name: string;
    subCategories: ISubCategory[];
    primary: boolean;
}