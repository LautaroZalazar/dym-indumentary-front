import IFormData from '../models/form-product-data.interface';
import {IValidateProduct} from '../models/validate-product.interface';

const validateProductForm = (
	formData: IFormData,
	setErrors: React.Dispatch<React.SetStateAction<IValidateProduct>>
): boolean => {
	const newErrors: IValidateProduct = {};

	if (formData.combinations.length === 0) {
		newErrors.combination =
			'Debes agregar al menos una combinación de talle, color y stock';
	} else {
		formData.combinations.forEach((combination, index) => {
			if (!combination.size || !combination.stock.length) {
				if (!newErrors.combination) {
					newErrors.combination = `Faltan datos en la combinación ${
						index + 1
					}`;
				}
			}
		});
	}

	if (!formData.name) newErrors.name = 'El nombre es obligatorio';
	if (!formData.price) newErrors.price = 'El precio es obligatorio';
	else if (Number(formData.price) < 0)
		newErrors.price = 'El precio debe ser positivo';
	if (!formData.description)
		newErrors.description = 'La descripción es obligatoria';
	if (!formData.categoryId)
		newErrors.category = 'La categoría es obligatoria';
	if (!formData.subCategoryId)
		newErrors.subCategory = 'Seleccione una sub-categoría';
	if (!formData.image.length) newErrors.image = 'Debes subir al menos una imágen';
	if (!formData.brandId) newErrors.brand = 'La marca es obligatoria';
	if (!formData.gender) newErrors.gender = 'El género es obligatorio';

	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
};

export default validateProductForm;
