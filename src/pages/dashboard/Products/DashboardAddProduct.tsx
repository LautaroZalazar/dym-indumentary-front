import { useState, useEffect } from 'react';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
	useFetchColorsQuery,
	useFetchSizeQuery,
} from '../../../redux/slices/catalogs.silce';
import { useCreateProductMutation } from '../../../redux/slices/admin.slice';
import { useCreateVariantMutation } from '../../../redux/slices/variant.slice';
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
	const [createVariant] = useCreateVariantMutation();
	const [errors, setErrors] = useState<IValidateProduct>({});
	const [, setHoveredField] = useState<string | null>(null);
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
		} else if (typeof field === 'string' && field.startsWith('sku:')) {
			const colorId = field.slice(4);
			const existingStockIndex = newCombinations[index].stock.findIndex(
				(stock) => stock.color === colorId
			);
			if (existingStockIndex !== -1) {
				newCombinations[index].stock[existingStockIndex] = {
					...newCombinations[index].stock[existingStockIndex],
					sku: value as string,
				};
			}
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
			if (!validateProductForm(formData, setErrors)) return;
			if (formData.combinations.length === 0) {
				showMessage(
					'error',
					'Debes agregar al menos una variante (talle, color, stock)',
					3000
				);
				return;
			}
			const incompleteCombo = formData.combinations.find(
				(c) => !c.size || c.stock.length === 0
			);
			if (incompleteCombo) {
				showMessage(
					'error',
					'Hay variantes incompletas (talle o stock vacíos)',
					3000
				);
				return;
			}

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
			const created: any = await createProduct(formatedProduct).unwrap();
			const newProductId = created?._id;
			if (!newProductId) {
				throw new Error('El backend no devolvió el _id del producto creado');
			}

			const variantPayloads = formData.combinations.flatMap((combo) =>
				combo.stock
					.filter((s) => s.color && Number(s.quantity) > 0)
					.map((s) => ({
						productId: newProductId,
						size: combo.size,
						color: s.color,
						quantity: Number(s.quantity),
						...(s.sku ? { sku: s.sku } : {}),
					}))
			);

			const results = await Promise.allSettled(
				variantPayloads.map((p) => createVariant(p).unwrap())
			);
			const failed = results.filter((r) => r.status === 'rejected').length;
			if (failed > 0) {
				showMessage(
					'error',
					`Producto creado, pero ${failed} variante(s) fallaron al guardar`,
					4000
				);
			} else {
				showMessage(
					'success',
					`Producto creado con ${variantPayloads.length} variante(s)`,
					3000
				);
			}
			setFormData(initialState);
		} catch (error: any) {
			showMessage('error', error?.data?.message || 'Error al agregar el producto', 3000);
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

	const fieldCls =
		'w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150';
	const labelCls = 'block text-xs font-medium text-dymAntiPop/55 mb-1.5';
	const sectionCls = 'bg-[#1E1A21] rounded-xl border border-white/[0.07] p-5';
	const sectionTitleCls = 'text-[10px] font-bold uppercase tracking-widest text-dymAntiPop/30 mb-4';

	return (
		<form className='w-full flex justify-center items-start p-4 py-8'>
			<div className='w-full md:w-[70%] lg:w-[58%] xl:w-[46%] flex flex-col gap-4'>

				{/* Información básica */}
				<div className={sectionCls}>
					<p className={sectionTitleCls}>Información básica</p>
					<div className='space-y-4'>
						<div>
							<label className={labelCls}>Nombre del producto</label>
							<input
								type='text'
								placeholder='Ej: Remera básica manga corta'
								className={fieldCls}
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								autoComplete='off'
							/>
							{errors.name && <p className='mt-1.5 text-xs text-red-400'>{errors.name}</p>}
						</div>
						<div>
							<label className={labelCls}>Precio</label>
							<div className='relative'>
								<span className='absolute left-3 top-1/2 -translate-y-1/2 text-dymAntiPop/40 text-sm pointer-events-none'>
									$
								</span>
								<input
									type='number'
									placeholder='0'
									min={0}
									className={fieldCls + ' pl-7 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'}
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
							</div>
							{errors.price && <p className='mt-1.5 text-xs text-red-400'>{errors.price}</p>}
						</div>
					</div>
				</div>

				{/* Categorización */}
				<div className={sectionCls}>
					<p className={sectionTitleCls}>Categorización</p>
					<div className='space-y-4'>
						<div>
							<label className={labelCls}>Categoría</label>
							<select
								className={fieldCls}
								name='categoryId'
								value={formData.categoryId}
								onChange={handleCategoryChange}>
								<option value='' hidden>Seleccioná una categoría</option>
								{categoriesData &&
									categoriesData.map((c: ICatalogMap) => (
										<option key={c._id} value={c._id}>{c.name}</option>
									))}
							</select>
							{errors.category && <p className='mt-1.5 text-xs text-red-400'>{errors.category}</p>}
						</div>

						{selectedCategory && selectedCategory.subCategories.length > 0 ? (
							<div>
								<label className={labelCls}>Subcategoría</label>
								<select
									className={fieldCls}
									name='subCategoryId'
									value={formData.subCategoryId}
									onChange={handleInputChange}>
									<option value='' hidden>Seleccioná una subcategoría</option>
									{selectedCategory.subCategories.map((sc: ICatalogMap) => (
										<option key={sc._id} value={sc._id}>{sc.name}</option>
									))}
								</select>
								{errors.subCategory && <p className='mt-1.5 text-xs text-red-400'>{errors.subCategory}</p>}
							</div>
						) : selectedCategory._id !== '' ? (
							<div>
								<label className={labelCls}>Subcategoría</label>
								<input
									className={fieldCls + ' opacity-40 cursor-not-allowed'}
									disabled
									placeholder='Esta categoría no tiene subcategorías'
								/>
							</div>
						) : null}

						<div className='grid grid-cols-2 gap-4'>
							<div>
								<label className={labelCls}>Marca</label>
								<select
									className={fieldCls}
									name='brandId'
									value={formData.brandId}
									onChange={handleInputChange}>
									<option value='' hidden>Seleccionar</option>
									{brandData &&
										brandData.map((c: ICatalogMap) => (
											<option key={c._id} value={c._id}>{c.name}</option>
										))}
								</select>
								{errors.brand && <p className='mt-1.5 text-xs text-red-400'>{errors.brand}</p>}
							</div>
							<div>
								<label className={labelCls}>Género</label>
								<select
									className={fieldCls}
									name='gender'
									value={formData.gender}
									onChange={handleInputChange}>
									<option value='' hidden>Seleccionar</option>
									<option value='Hombre'>Hombre</option>
									<option value='Mujer'>Mujer</option>
									<option value='Niño'>Niño</option>
									<option value='Niña'>Niña</option>
									<option value='Unisex'>Unisex</option>
								</select>
								{errors.gender && <p className='mt-1.5 text-xs text-red-400'>{errors.gender}</p>}
							</div>
						</div>
					</div>
				</div>

				{/* Descripción */}
				<div className={sectionCls}>
					<p className={sectionTitleCls}>Descripción</p>
					<textarea
						placeholder='Descripción del producto...'
						className='w-full rounded-lg p-3 h-24 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150 resize-none overflow-y-auto'
						name='description'
						value={formData.description}
						onChange={handleInputChange}
					/>
					{errors.description && <p className='mt-1.5 text-xs text-red-400'>{errors.description}</p>}
				</div>

				{/* Variantes */}
				<div className={sectionCls}>
					<p className={sectionTitleCls}>Variantes — talle, color y stock</p>
					<div className='space-y-2 max-h-[500px] overflow-y-auto mb-4 pr-0.5'>
						{formData.combinations.map((combination, index) => {
							const activeColors = combination.stock.filter(
								(s) => s.quantity > 0
							).length;
							return (
								<div
									key={index}
									className='rounded-lg border border-white/[0.08] bg-[#252030] overflow-hidden'>
									{/* Cabecera de variante */}
									<div className='flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]'>
										<div className='flex items-center gap-3'>
											<span className='text-[10px] font-bold uppercase tracking-widest text-dymAntiPop/30'>
												Variante {index + 1}
											</span>
											<select
												className='rounded-md h-7 px-2 bg-[#1E1A21] border border-white/[0.1] text-dymAntiPop text-xs focus:outline-none focus:border-dymOrange/50 transition-colors cursor-pointer'
												value={combination.size}
												onChange={(e) =>
													handleCombinationChange(
														index,
														'sizeId',
														e.target.value
													)
												}>
												<option value='' hidden>
													Elegir talle
												</option>
												{sizeData &&
													sizeData.map((size: ICatalogMap) => (
														<option key={size._id} value={size._id}>
															{size.name}
														</option>
													))}
											</select>
											{activeColors > 0 && (
												<span className='text-[10px] text-dymOrange/70 font-medium'>
													{activeColors} color
													{activeColors > 1 ? 'es' : ''} con stock
												</span>
											)}
										</div>
										<button
											className='w-6 h-6 flex items-center justify-center rounded text-dymAntiPop/30 hover:text-red-400 hover:bg-red-400/10 transition-colors text-base shrink-0'
											type='button'
											onClick={() => removeCombination(index)}>
											×
										</button>
									</div>

									{/* Chips de colores */}
									<div className='p-3 flex flex-wrap gap-2'>
										{colorData &&
											colorData.map((color: ICatalogMap) => {
												const stockEntry = combination.stock.find(
													(s) => s.color === color._id
												);
												const qty = stockEntry?.quantity ?? 0;
												const hasStock = qty > 0;
												const hex = (color as any).hex as
													| string
													| undefined;

												return (
													<div
														key={color._id}
														className={`flex flex-col items-center gap-1.5 px-2.5 py-2 rounded-lg border transition-all min-w-[58px] ${
															hasStock
																? 'border-dymOrange/45 bg-dymOrange/[0.05]'
																: 'border-white/[0.07] bg-[#1E1A21]/60'
														}`}>
														<div
															className='w-5 h-5 rounded-full border border-white/25 shrink-0'
															style={{
																backgroundColor: hex,
															}}
														/>
														<span
															className={`text-[10px] font-medium capitalize leading-tight text-center max-w-[54px] truncate ${
																hasStock
																	? 'text-dymAntiPop/80'
																	: 'text-dymAntiPop/35'
															}`}>
															{color.name}
														</span>
														<input
															type='number'
															placeholder='0'
															className={`w-11 h-5 text-center text-xs rounded border bg-transparent transition-colors [&::-webkit-inner-spin-button]:appearance-none focus:outline-none ${
																hasStock
																	? 'border-dymOrange/40 text-dymOrange font-semibold'
																	: 'border-white/[0.1] text-dymAntiPop/40 focus:border-dymOrange/40 focus:text-dymAntiPop'
															}`}
															value={qty || ''}
															onChange={(e) =>
																handleCombinationChange(
																	index,
																	color._id,
																	Number(e.target.value)
																)
															}
														/>
														{hasStock && (
															<input
																type='text'
																placeholder='SKU (opc.)'
																maxLength={30}
																className='w-16 h-5 text-center text-[9px] rounded border bg-transparent border-white/[0.1] text-dymAntiPop/60 placeholder:text-dymAntiPop/25 focus:border-dymOrange/40 focus:text-dymAntiPop focus:outline-none uppercase'
																value={stockEntry?.sku ?? ''}
																onChange={(e) =>
																	handleCombinationChange(
																		index,
																		`sku:${color._id}`,
																		e.target.value.toUpperCase()
																	)
																}
															/>
														)}
													</div>
												);
											})}
									</div>
								</div>
							);
						})}
					</div>
					<button
						type='button'
						onClick={addCombination}
						className='w-full py-2.5 border border-dymOrange/35 hover:border-dymOrange hover:bg-dymOrange/10 text-dymAntiPop/65 hover:text-dymAntiPop font-medium rounded-lg transition-colors text-sm'>
						+ Agregar variante
					</button>
					{errors.combination && (
						<p className='mt-2 text-xs text-red-400 text-center'>{errors.combination}</p>
					)}
				</div>

				{/* Imágenes */}
				<div className={sectionCls}>
					<p className={sectionTitleCls}>Imágenes</p>
					<div className='flex justify-center'>
						<UploadImage
							preset='ml_products'
							setUrl={setFormData}
							form={formData}
							handleMouseEnter={() => handleMouseEnter('image')}
							handleMouseLeave={handleMouseLeave}
						/>
					</div>
					{errors.image && (
						<p className='mt-2 text-xs text-red-400 text-center'>{errors.image}</p>
					)}
				</div>

				{/* CTA */}
				<div className='pb-4'>
					<button
						onClick={onSubmit}
						type='submit'
						className={`w-full py-3 bg-dymOrange hover:bg-dymOrange/90 text-white font-semibold rounded-lg transition-colors text-sm ${
							!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						disabled={!isFormValid()}>
						Crear producto
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default AddProductForm;
