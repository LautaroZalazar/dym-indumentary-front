import { useState, useEffect } from 'react';
import { useFetchProductQuery } from '../../../redux/slices/product.slice';
import { useUpdateProductMutation } from '../../../redux/slices/admin.slice';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
} from '../../../redux/slices/catalogs.silce';
import { IUpdateProductProps } from './models/update-product-props.interface';
import validateProductForm from '../Products/utils/product-validaction-form';
import IFormData from './models/form-product-data.interface';
import { IValidateProduct } from './models/validate-product.interface';
import xIcon from '../../../assets/SVG/x.svg';
import Loader from '../../../components/loader';
import { ICategories } from './models/categories.interface';
import ICatalogMap from './models/catalog-map.interface';
import UploadImage from '../../../components/uploadImage/UploadImage';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';
import VariantsTable from './components/VariantsTable';

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
	const [selectedCategory, setSelectedCategory] = useState<ICategories>({
		_id: '',
		name: '',
		subCategories: [],
	});
	const [formData, setFormData] = useState<IFormData>(initialState);
	const [errors, setErrors] = useState<IValidateProduct>({});
	// TODO - Delete images in cloudinary - Pro fueature only
	// const [cloudImageToDelete, setCloudImageToDelete] = useState<string[]>([]);
	const [, setHoveredField] = useState<string | null>(null);
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
				combinations: [],
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
					gender: formData.gender.toLowerCase(),
					image: formData.image,
					brand: formData.brandId,
					category: formData.categoryId,
					subCategory: formData.subCategoryId,
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
										className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										autoComplete='off'
									/>
									{errors.name && (
										<p className='mt-1.5 text-xs text-red-400'>{errors.name}</p>
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
										className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
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
										<p className='mt-1.5 text-xs text-red-400'>{errors.price}</p>
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
										className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150 cursor-pointer'
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
										<p className='mt-1.5 text-xs text-red-400'>{errors.category}</p>
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
											className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150 cursor-pointer'
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
											<p className='mt-1.5 text-xs text-red-400'>{errors.subCategory}</p>
										)}
									</div>
								) : (
									<>
										{selectedCategory._id !== '' && (
											<input
												className='w-full rounded-lg h-10 pl-3 bg-[#1a1620] border border-white/[0.06] text-dymAntiPop/30 cursor-not-allowed'
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
										className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150'
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
										<p className='mt-1.5 text-xs text-red-400'>{errors.brand}</p>
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
										className='w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150'
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
										<p className='mt-1.5 text-xs text-red-400'>{errors.gender}</p>
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
										className='w-full rounded-lg p-3 h-24 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150 resize-none overflow-y-auto'
										name='description'
										value={formData.description}
										onChange={handleInputChange}
									/>
									{errors.description && (
										<p className='mt-1.5 text-xs text-red-400'>{errors.description}</p>
									)}
								</div>
								<div className='flex flex-col w-full items-center'>
									<VariantsTable productId={productId} />
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
										<p className='mt-1.5 text-xs text-red-400 text-center'>{errors.image}</p>
									)}
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className='mt-auto flex gap-3 pt-3 border-t border-white/[0.07]'>
					<button
						onClick={onSubmit}
						className={`flex-1 py-2.5 bg-dymOrange hover:bg-dymOrange/90 text-white font-semibold rounded-lg transition-colors text-sm ${
							!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={!isFormValid()}>
						Actualizar producto
					</button>
					<button
						className='flex-1 py-2.5 border border-white/20 hover:border-white/40 text-dymAntiPop/60 hover:text-dymAntiPop font-medium rounded-lg transition-colors text-sm'
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
