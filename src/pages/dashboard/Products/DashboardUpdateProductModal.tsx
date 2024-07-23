import { useState, useEffect } from 'react';
import { useFetchProductQuery } from '../../../redux/slices/product.slice';
import { useUpdateProductMutation } from '../../../redux/slices/admin.slice';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
	useFetchColorsQuery,
	useFetchSizeQuery,
} from '../../../redux/slices/catalogs.silce';
import { IUpdateProductProps } from './models/update-product-props.interface';
import validateProductForm from '../Products/utils/product-validaction-form';
import IFormData from './models/form-product-data.interface';
import { IValidateProduct } from './models/validate-product.interface';
import xIcon from '../../../assets/SVG/x.svg';
import Loader from '../../../components/loader';
import { ICategories } from './models/categories.interface';
import { ICombinationMap } from './models/combination-map.interface';
import ICatalogMap from './models/catalog-map.interface';
import ICombination from './models/combination.interface';
import UploadImage from '../../../components/uploadImage/UploadImage';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';

const DashboardUpdateProductModal: React.FC<IUpdateProductProps> = ({
	productId,
	closeModal,
	refetch,
}) => {
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
	const [updateProduct] = useUpdateProductMutation();
	const {
		data: productData,
		isLoading: productIsLoading,
		refetch: productRefetch,
	} = useFetchProductQuery(productId);
	const { data: categoriesData } = useFetchCategoriesQuery('');
	const { data: brandData } = useFetchBrandsQuery('');
	const { data: colorData } = useFetchColorsQuery('');
	const { data: sizeData } = useFetchSizeQuery('');
	const [selectedCategory, setSelectedCategory] = useState<ICategories>({
		_id: '',
		name: '',
		subCategories: [],
	});
	const [formData, setFormData] = useState<IFormData>(initialState);
	const [errors, setErrors] = useState<IValidateProduct>({});
	// TODO - Delete images in cloudinary - Pro fueature only
	// const [cloudImageToDelete, setCloudImageToDelete] = useState<string[]>([]);
	const [hoveredField, setHoveredField] = useState<string | null>(null);
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();

	useEffect(() => {
		if (productData) {
			setFormData({
				name: productData.name || '',
				price: productData.price || '',
				description: productData.description || '',
				categoryId: productData.category?._id || '',
				subCategoryId: productData.subCategory?._id || '',
				brandId: productData.brand?._id || '',
				image: productData.image || [],
				gender: productData.gender || '',
				combinations: productData.inventory.map(
					(combination: ICombinationMap) => ({
						size: combination.size._id,
						stock: combination.stock.map((stock) => ({
							color: stock.color._id,
							quantity: stock.quantity,
						})),
					})
				),
			});
			setSelectedCategory({
				_id: productData.category?._id || '',
				name: productData.category?.name || '',
				subCategories:
					categoriesData.find(
						(c: ICatalogMap) => c._id === productData.category?._id
					)?.subCategories || [],
			});
		}
	}, [productData]);

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

	const isFormValid = () => {
		return Object.keys(errors).length === 0;
	};

	const handleMouseEnter = (field: string) => {
		setHoveredField(field);
	};

	const handleMouseLeave = () => {
		setHoveredField(null);
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
				await updateProduct({
					id: productId,
					data: formatedProduct,
				}).unwrap();
				// TODO - Delete images in cloudinary - Pro fueature only
				// await Promise.all(
				// 	cloudImageToDelete.map(async (publicId) => {
				// 		await axios.delete(
				// 			`https://api.cloudinary.com/v1_1/dym/image/destroy`,
				// 			{
				// 				data: { public_id: publicId },
				// 			}
				// 		);
				// 	})
				// );
				// setCloudImageToDelete([]);
				showMessage(
					'success',
					'El producto se actualizó correctamente',
					3000
				);
			}
			setTimeout(() => {
				refetch();
				closeModal();
			}, 3000);
		} catch (error: any) {
			showMessage('error', 'Error al actualizar el producto', 3000);
			throw new Error(error);
		}
	};

	const handleImageDelete = (publicId: string) => {
		showConfirmModal({
			message: '¿Estás seguro que quieres borrar esta imagen?',
			onAccept: async () => {
				try {
					// TODO - Delete images in cloudinary - Pro fueature only
					// setCloudImageToDelete((prev) => [...prev, publicId]);
					setFormData({
						...formData,
						image: formData.image.filter(
							(img) => img.public_id !== publicId
						),
					});
					await productRefetch();
					showMessage(
						'success',
						'Imagen eliminada correctamente',
						3000
					);
				} catch (error: any) {
					showMessage('error', 'Error al eliminar la imagen', 3000);
					throw new Error(error);
				}
			},
		});
	};

	if (productIsLoading) return <Loader />;

	return (
		<div className='fixed inset-0 flex justify-center items-center z-50 bg-dymBlack bg-opacity-80'>
			<div className='bg-dymBlack border border-dymOrange p-4 rounded-lg shadow-lg w-full md:w-4/5 lg:w-2/3 xl:w-[45%] h-4/5 flex flex-col mx-2'>
				<div>
					<div className='flex justify-between items-center mb-4 md:mb-6'>
						<h2 className='text-lg font-bold'>
							Modificar producto
						</h2>
						<button
							type='button'
							onClick={closeModal}
							className='p-1 md:p-2 rounded-lg hover:bg-dymOrange-dark transition-colors duration-300'>
							<img
								src={xIcon.toString()}
								alt='Cerrar'
								className='w-4 h-4 md:w-6 md:h-6'
							/>
						</button>
					</div>
					<div
						className='overflow-y-auto'
						style={{ maxHeight: 'calc(80vh - 150px)' }}>
						<form className='flex justify-center p-4'>
							<div className='w-full md:w-3/4 h-4/5 flex flex-col space-y-4'>
								<div
									className='relative'
									onMouseEnter={() =>
										handleMouseEnter('name')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Nombre</label>
									<input
										type='text'
										placeholder='Nombre del producto'
										className='rounded-md w-full h-10 pl-2'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										autoComplete='off'
									/>
									{errors.name && (
										<span
											className={`absolute right-0 top-2/3 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
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
									onMouseEnter={() =>
										handleMouseEnter('price')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Precio</label>
									<input
										type='number'
										placeholder='Precio'
										min={0}
										className='rounded-md w-full h-10 pl-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
										name='price'
										value={formData.price}
										onChange={handleInputChange}
										onKeyDown={(e) => {
											if (
												e.key === 'ArrowUp' ||
												e.key === 'ArrowDown'
											) {
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
											className={`absolute right-0 top-2/3 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
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
									onMouseEnter={() =>
										handleMouseEnter('categoryId')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Categoría</label>
									<select
										className='rounded-md w-full h-10 pl-2 cursor-pointer'
										name='categoryId'
										value={formData.categoryId}
										onChange={handleCategoryChange}>
										{categoriesData &&
											categoriesData.map(
												(c: ICatalogMap) => (
													<option
														key={c._id}
														value={c._id}>
														{c.name}
													</option>
												)
											)}
									</select>
									{errors.category && (
										<span
											className={`absolute right-0 top-2/3 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
												hoveredField === 'categoryId'
													? 'opacity-100'
													: 'opacity-0'
											} mr-6`}>
											{errors.category}
										</span>
									)}
								</div>
								{selectedCategory.subCategories ? (
									<div
										className='relative'
										onMouseEnter={() =>
											handleMouseEnter('subCategoryId')
										}
										onMouseLeave={handleMouseLeave}>
										<label>Subcategoría</label>
										<select
											className='rounded-md w-full h-10 pl-2 cursor-pointer'
											name='subCategoryId'
											value={formData.subCategoryId}
											onChange={handleInputChange}>
											<option value='' hidden>
												{selectedCategory.subCategories
													?.length
													? ''
													: 'No hay subcategorías'}
											</option>
											{selectedCategory &&
												selectedCategory.subCategories.map(
													(sc: ICatalogMap) => (
														<option
															key={sc._id}
															value={sc._id}>
															{sc.name}
														</option>
													)
												)}
										</select>
										{errors.subCategory && (
											<span
												className={`absolute right-0 top-2/3 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
													hoveredField ===
													'subCategoryId'
														? 'opacity-100'
														: 'opacity-0'
												} mr-6`}>
												{errors.subCategory}
											</span>
										)}
									</div>
								) : (
									<>
										{selectedCategory._id !== '' && (
											<input
												className='rounded-md w-full h-10 pl-2 bg-[#121212]'
												disabled
												placeholder='No hay subcategoría seleccionada'
											/>
										)}
									</>
								)}
								<div
									className='relative'
									onMouseEnter={() =>
										handleMouseEnter('brandId')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Marca</label>
									<select
										className='rounded-md w-full h-10 pl-2'
										name='brandId'
										value={formData.brandId}
										onChange={handleInputChange}>
										{brandData &&
											brandData.map((c: ICatalogMap) => (
												<option
													key={c._id}
													value={c._id}>
													{c.name}
												</option>
											))}
									</select>
									{errors.brand && (
										<span
											className={`absolute right-0 top-3/4 transform -translate-y-1/2 text-xs text-red-600 transition-opacity duration-200 ease-in-out ${
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
									onMouseEnter={() =>
										handleMouseEnter('gender')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Género</label>
									<select
										className='rounded-md w-full h-10 pl-2'
										name='gender'
										value={formData.gender}
										onChange={handleInputChange}>
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
									onMouseEnter={() =>
										handleMouseEnter('description')
									}
									onMouseLeave={handleMouseLeave}>
									<label>Descripción</label>
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
									className='flex flex-col w-full items-center'
									onMouseEnter={() =>
										handleMouseEnter('combination')
									}
									onMouseLeave={handleMouseLeave}>
									{formData.combinations.map(
										(combination, index) => (
											<div
												key={index}
												className='flex flex-row w-full border border-dymOrange rounded-md mb-2'>
												<div className='w-full flex flex-col md:flex-row md:space-x-2 justify-between items-center p-2 overflow-y-auto'>
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
															Selecciona un talle
														</option>
														{sizeData &&
															sizeData.map(
																(
																	size: ICatalogMap
																) => (
																	<option
																		key={
																			size._id
																		}
																		value={
																			size._id
																		}>
																		{
																			size.name
																		}
																	</option>
																)
															)}
													</select>
													<div className='flex flex-col w-full mt-4 max-h-40 overflow-y-auto'>
														<div className='grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
															{colorData &&
																colorData.map(
																	(
																		color: ICatalogMap
																	) => {
																		const stock =
																			combination.stock.find(
																				(
																					stock
																				) =>
																					stock.color ===
																					color._id
																			)
																				?.quantity ||
																			'';
																		return (
																			<div
																				key={
																					color._id
																				}
																				className='flex flex-col items-center space-x-2 mx-2 mb-2 pr-4 md:pr-2'>
																				<span>
																					{
																						color.name
																					}
																				</span>
																				<input
																					type='number'
																					placeholder={
																						stock
																							? `Stock: ${stock}`
																							: 'Stock'
																					}
																					className={`rounded-md w-20 h-10 pl-2 ${
																						stock
																							? 'border border-dymOrange'
																							: ''
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
															removeCombination(
																index
															)
														}>
														<img
															src={xIcon.toString()}
														/>
													</button>
												</div>
											</div>
										)
									)}
									<button
										type='button'
										onClick={addCombination}
										className='mt-2 w-full flex justify-center items-center border border-dymOrange text-dymAntiPop rounded-lg p-2'>
										Agregar talle, color y stock
									</button>
									{errors.combination && (
										<span
											className={`text-xs text-red-600 block mt-2 transition-opacity duration-200 ease-in-out ${
												hoveredField === 'combination'
													? 'opacity-100'
													: 'opacity-0'
											}`}>
											{errors.combination}
										</span>
									)}
								</div>
								<div className='flex flex-col justify-center items-center p-2'>
									{formData.image.length > 0 && (
										<div className=' border border-dymOrange mb-4 items-center w-full max-h-52'>
											<div className='flex flex-row mb-4 items-center overflow-y-auto'>
												{formData.image
													.slice(0, 4)
													.map((image) => (
														<div className='flex flex-col justify-around items-center'>
															<img
																src={image.url}
																className='size-28 m-2'
															/>
															<button
																type='button'
																onClick={() =>
																	handleImageDelete(
																		image.public_id
																	)
																}
																className='text-red-500 underline w-2/4'>
																Eliminar
															</button>
														</div>
													))}
											</div>
											<div className='flex justify-center items-center w-full p-2'>
												<button
													type='button'
													className='underline'>
													Ver más
												</button>
											</div>
										</div>
									)}
									<div className='w-full flex justify-center'>
										<UploadImage
											preset='ml_products'
											setUrl={setFormData}
											form={formData}
											handleMouseEnter={() =>
												handleMouseEnter('image')
											}
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
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className='mt-auto flex justify-evenly'>
					<button
						onClick={onSubmit}
						className={`p-2 bg-dymOrange rounded-lg mt-4 hover:bg-dymOrange-dark transition-colors duration-300 ${
							!isFormValid() && 'opacity-50 cursor-not-allowed'
						}`}
						disabled={!isFormValid()}>
						Actualizar producto
					</button>
					<button
						className='p-2 border border-dymOrange rounded-lg mt-4 hover:bg-dymOrange-dark'
						onClick={closeModal}>
						Cancelar
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardUpdateProductModal;
