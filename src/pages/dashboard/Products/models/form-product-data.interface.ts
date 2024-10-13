import ICombination from "./combination.interface";
import { IUploadImageResponse } from '../../../../components/uploadImage/models/upload-image-response.interface'

export default interface IFormData {
	name: string;
	price: string;
	description: string;
	image: IUploadImageResponse[];
	categoryId: string;
	subCategoryId: string;
	brandId: string;
	gender: string;
	combinations: ICombination[];
}
