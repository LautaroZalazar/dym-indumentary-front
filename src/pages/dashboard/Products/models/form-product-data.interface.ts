import ICombination from "./combination.interface";

export default interface IFormData {
	name: string;
	price: string;
	description: string;
	image: string[];
	categoryId: string;
	subCategoryId: string;
	brandId: string;
	gender: string;
	combinations: ICombination[];
}
