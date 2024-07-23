import { useState, useEffect } from 'react';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
	useFetchColorsQuery,
	useFetchSizeQuery,
} from '../../../redux/slices/catalogs.silce';
import { useCreateProductMutation } from '../../../redux/slices/admin.slice';
import xIcon from '../../../assets/SVG/x.svg';
import ICombination from './models/combination.interface';
import IFormData from './models/form-product-data.interface';
import validateProductForm from '../Products/utils/product-validaction-form';
import ICatalogMap from './models/catalog-map.interface';
import { ICategories } from './models/categories.interface';
import { IValidateProduct } from './models/validate-product.interface';
import UploadImage from '../../../components/uploadImage/UploadImage';
import { useMessage } from '../../../hooks/alertMessage';

const AddProductForm: React.FC = () => {
	const initialState = {
		name: '',
		price: '',
		description: '',
		categoryId: '',
		subCategoryId: '',
		brandId: '',
		image: [],
		gender: '',
		combinations: [],
	};
	const [selectedCategory, setSelectedCategory] = useState<ICategories>({
		_id: '',
		name: '',
		subCategories: [],
	});
	const { data: categoriesData } = useFetchCategoriesQuery('');
	const { data: brandData } = useFetchBrandsQuery('');
	const { data: colorData } = useFetchColorsQuery('');
	const { data: sizeData } = useFetchSizeQuery('');
	const [createProduct] = useCreateProductMutation();
	const [errors, setErrors] = useState<IValidateProduct>({});
	const [hoveredField, setHoveredField] = useState<string | null>(null);
	const [formData, setFormData] = useState<IFormData>(initialState);
	const { MessageComponent, showMessage } = useMessage();

	useEffect(() => {
		validateProductForm(formData, setErrors);
	}, [formData]);

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleCombinationChange = (
		index: number,
		field: keyof ICombination | string,
		value: string | number
	) => {
		const newCombinations = [...formData.combinations];
		if (field === 'sizeId') {
			newCombinations[index] = {
				...newCombinations[index],
				size: value as string,
			};
		} else if (typeof field === 'string') {
			const colorId = field;
			const existingStockIndex = newCombinations[index].stock.findIndex(
				(stock) => stock.color === colorId
			);

			if (existingStockIndex !== -1) {
				newCombinations[index].stock[existingStockIndex] = {
					...newCombinations[index].stock[existingStockIndex],
					quantity: value as number,
				};
			} else {
				newCombinations[index].stock.push({
					color: colorId,
					quantity: value as number,
				});
			}
		}
		setFormData({ ...formData, combinations: newCombinations });
	};

	const addCombination = () => {
		setFormData({
			...formData,
			combinations: [
				...formData.combinations,
				{
					size: '',
					stock: [],
				},
			],
		});
	};

	const removeCombination = (index: number) => {
		const newCombinations = formData.combinations.filter(
			(_, i) => i !== index
		);
		setFormData({ ...formData, combinations: newCombinations });
	};

	const onSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			if (validateProductForm(formData, setErrors)) {
				const formatedProduct = {
					name: formData.name,
					price: Number(formData.price),
					description: formData.description,
					gender: formData.gender,
					image: formData.image,
					brand: formData.brandId,
					category: formData.categoryId,
					subCategory: formData.subCategoryId,
					inventory: formData.combinations,
				};
				await createProduct(formatedProduct).unwrap();
				showMessage(
					'success',
					'El producto se agregó correctamente',
					3000
				);
			}
			setFormData(initialState);
		} catch (error: any) {
			showMessage('error', 'Error al agregar el producto', 3000);
			throw new Error(error);
		}
	};

	const isFormValid = () => {
		return Object.keys(errors).length === 0;
	};

	const handleMouseEnter = (field: string) => {
		setHoveredField(field);
	};

	const handleMouseLeave = () => {
		setHoveredField(null);
	};

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const categoryId = e.target.value;
		const selectCategory = categoriesData.find(
			(e: any) => e._id === categoryId
		);
		setSelectedCategory(selectCategory);
		setFormData({
			...formData,
			categoryId,
			subCategoryId: '',
		});
	};

	return (
		<form className='w-full md:h-screen flex justify-center items-center p-4'>
			<div className='w-full md:w-3/4 lg:w-2/4 xl:w-2/6 mt-4 flex flex-col justify-center space-y-4'>
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('name')}
					onMouseLeave={handleMouseLeave}>
					<input
						type='text'
						placeholder='Nombre...'
						className='rounded-md w-full h-10 pl-2'
						name='name'
						value={formData.name}
						onChange={handleInputChange}
						autoComplete='off'
					/>
					{errors.name && (
						<span
							className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'name'
									? 'opacity-100'
									: 'opacity-0'
							}  mr-2`}>
							{errors.name}
						</span>
					)}
				</div>
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('price')}
					onMouseLeave={handleMouseLeave}>
					<input
						type='number'
						placeholder='Precio'
						min={0}
						className='rounded-md w-full h-10 pl-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
						name='price'
						value={formData.price}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
								e.preventDefault();
							}
						}}
						onWheel={(e) => {
							e.preventDefault();
							e.currentTarget.blur();
						}}
					/>
					{errors.price && (
						<span
							className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'price'
									? 'opacity-100'
									: 'opacity-0'
							} mr-2`}>
							{errors.price}
						</span>
					)}
				</div>
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('categoryId')}
					onMouseLeave={handleMouseLeave}>
					<select
						className='rounded-md w-full h-10 pl-2'
						name='categoryId'
						value={formData.categoryId}
						onChange={handleCategoryChange}>
						<option value='' hidden>
							Categorías
						</option>
						{categoriesData &&
							categoriesData.map((c: ICatalogMap) => (
								<option key={c._id} value={c._id}>
									{c.name}
								</option>
							))}
					</select>
					{errors.category && (
						<span
							className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'categoryId'
									? 'opacity-100'
									: 'opacity-0'
							} mr-6`}>
							{errors.category}
						</span>
					)}
				</div>
				{selectedCategory &&
				selectedCategory.subCategories.length > 0 ? (
					<div
						className='relative'
						onMouseEnter={() => handleMouseEnter('subCategoryId')}
						onMouseLeave={handleMouseLeave}>
						<select
							className='rounded-md w-full h-10 pl-2'
							name='subCategoryId'
							value={formData.subCategoryId}
							onChange={handleInputChange}>
							<option value='' hidden>
								Subcategorías
							</option>
							{selectedCategory.subCategories.length &&
								selectedCategory.subCategories.map(
									(sc: ICatalogMap) => (
										<option key={sc._id} value={sc._id}>
											{sc.name}
										</option>
									)
								)}
						</select>
						{errors.subCategory && (
							<span
								className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
									hoveredField === 'subCategoryId'
										? 'opacity-100'
										: 'opacity-0'
								} mr-6`}>
								{errors.subCategory}
							</span>
						)}
					</div>
				) : (
					<>
						{selectedCategory._id != '' && (
							<input
								className='rounded-md w-full h-10 pl-2 bg-[#121212]'
								disabled
								placeholder='No hay subcategorías para esta categoría'
							/>
						)}
					</>
				)}
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('brandId')}
					onMouseLeave={handleMouseLeave}>
					<select
						className='rounded-md w-full h-10 pl-2'
						name='brandId'
						value={formData.brandId}
						onChange={handleInputChange}>
						<option value='' hidden>
							Marca
						</option>
						{brandData &&
							brandData.map((c: ICatalogMap) => (
								<option key={c._id} value={c._id}>
									{c.name}
								</option>
							))}
					</select>
					{errors.brand && (
						<span
							className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'brandId'
									? 'opacity-100'
									: 'opacity-0'
							} mr-6`}>
							{errors.brand}
						</span>
					)}
				</div>
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('gender')}
					onMouseLeave={handleMouseLeave}>
					<select
						className='rounded-md w-full h-10 pl-2'
						name='gender'
						value={formData.gender}
						onChange={handleInputChange}>
						<option value='' hidden>
							Género
						</option>
						<option value='Hombre'>Hombre</option>
						<option value='Mujer'>Mujer</option>
						<option value='Niño'>Niño</option>
						<option value='Niña'>Niña</option>
						<option value='Unisex'>Unisex</option>
					</select>
					{errors.gender && (
						<span
							className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'gender'
									? 'opacity-100'
									: 'opacity-0'
							} mr-6`}>
							{errors.gender}
						</span>
					)}
				</div>
				<div
					className='relative'
					onMouseEnter={() => handleMouseEnter('description')}
					onMouseLeave={handleMouseLeave}>
					<textarea
						placeholder='Descripción...'
						className='rounded-md w-full h-20 max-h-20 p-2 text-break resize-none overflow-y-auto'
						name='description'
						value={formData.description}
						onChange={handleInputChange}
					/>
					{errors.description && (
						<span
							className={`absolute right-0 top-4 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'description'
									? 'opacity-100'
									: 'opacity-0'
							} mr-2`}>
							{errors.description}
						</span>
					)}
				</div>
				<div
					onMouseEnter={() => handleMouseEnter('combination')}
					onMouseLeave={handleMouseLeave}
					className='space-y-4'>
					<div className='flex flex-col w-full items-center max-h-72 overflow-y-auto mb-6 p-2'>
						{formData.combinations.map((combination, index) => (
							<div className='flex flex-row w-full border border-dymOrange rounded-md mb-2'>
								<div
									key={index}
									className='w-full flex flex-col md:flex-row md:space-x-2 justify-between items-center p-2 overflow-y-auto'>
									<select
										className='rounded-md w-32 h-10 pl-2'
										value={combination.size}
										onChange={(e) =>
											handleCombinationChange(
												index,
												'sizeId',
												e.target.value
											)
										}>
										<option value='' hidden>
											Talle
										</option>
										{sizeData &&
											sizeData.map(
												(size: ICatalogMap) => (
													<option
														key={size._id}
														value={size._id}>
														{size.name}
													</option>
												)
											)}
									</select>
									<div className='flex flex-col mt-4 max-h-40 overflow-y-auto'>
										<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
											{colorData &&
												colorData.map(
													(color: ICatalogMap) => {
														const stock =
															combination.stock.find(
																(stock) =>
																	stock.color ===
																	color._id
															)?.quantity || '';
														return (
															<div
																key={color._id}
																className='flex flex-col items-center space-x-2 mx-2 mb-2 pr-4 md:pr-2'>
																<span>
																	{color.name}
																</span>
																<input
																	type='number'
																	placeholder='Stock'
																	className={`rounded-md w-20 h-10 pl-2 ${
																		stock &&
																		'border border-dymOrange'
																	} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0`}
																	value={
																		stock
																	}
																	onChange={(
																		e
																	) =>
																		handleCombinationChange(
																			index,
																			color._id,
																			Number(
																				e
																					.target
																					.value
																			)
																		)
																	}
																/>
															</div>
														);
													}
												)}
										</div>
									</div>
								</div>
								<div className='h-full w-6 flex justify-end items-start m-2'>
									<button
										className='text-xs'
										type='button'
										onClick={() =>
											removeCombination(index)
										}>
										<img src={xIcon.toString()} />
									</button>
								</div>
							</div>
						))}
					</div>
					<button
						type='button'
						onClick={addCombination}
						className='mt-2 w-full flex justify-center items-center border border-dymOrange text-dymAntiPop rounded-lg p-2'>
						Agregar talle, color y stock
					</button>
					{errors.combination && (
						<span
							className={`text-xs text-red-600 text-center block mt-2 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'combination'
									? 'opacity-100'
									: 'opacity-0'
							}`}>
							{errors.combination}
						</span>
					)}
				</div>

				<div className='flex flex-col justify-center items-center p-2'>
					<div className='w-full flex justify-center'>
						<UploadImage
							preset='ml_products'
							setUrl={setFormData}
							form={formData}
							handleMouseEnter={() => handleMouseEnter('image')}
							handleMouseLeave={handleMouseLeave}
						/>
					</div>
					{errors.image && (
						<span
							className={`text-xs text-red-600 block mt-2 transition-opacity duration-200 ease-in-out ${
								hoveredField === 'image'
									? 'opacity-100'
									: 'opacity-0'
							}`}>
							{errors.image}
						</span>
					)}
					<button
						onClick={onSubmit}
						type='submit'
						className={`mt-2 w-full flex justify-center items-center bg-dymOrange text-dymAntiPop rounded-lg p-2 ${
							!isFormValid() && 'opacity-50 cursor-not-allowed'
						}`}
						disabled={!isFormValid()}>
						Crear Producto
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default AddProductForm;
