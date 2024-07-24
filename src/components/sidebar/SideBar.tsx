import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISideBarProps } from './models/sidebar-props.interface';
import { Category } from '../../models/product/category.model';
import { Brand } from '../../models/product/brand.model';
import { ISizeMap } from '../../pages/dashboard/Sizes/models/size-map.interface';
import { IFilterState } from '../../redux/slices/models/filter-state.interface';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
	useFetchSizeQuery,
} from '../../redux/slices/catalogs.silce';
import { RootState } from '../../redux/store';
import { toggleFilter, setSort } from '../../redux/slices/filter.slice';

const SideBar: React.FC<ISideBarProps> = ({ isOpen }) => {
	const dispatch = useDispatch();
	const filters = useSelector((state: RootState) => state.filters);
	const { data: categoriesData } = useFetchCategoriesQuery('');
	const { data: sizesData } = useFetchSizeQuery('');
	const { data: brandsData } = useFetchBrandsQuery('');
	const [openSections, setOpenSections] = useState({
		productType: true,
		gender: true,
		brand: true,
		size: true,
	});
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prevState) => ({
			...prevState,
			[section]: !prevState[section],
		}));
	};

	const handleCategoryChange = (categoryId: string) => {
		setSelectedCategories((prevCategories) =>
			prevCategories.includes(categoryId)
				? prevCategories.filter((id) => id !== categoryId)
				: [...prevCategories, categoryId]
		);
	};

	const handleFilterChange = (
		category: keyof Omit<IFilterState, 'sort'>,
		value: string
	) => {
		dispatch(toggleFilter({ category, value }));
	};

	const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSort(event.target.value));
	};

	return (
		<div
			className={`
            fixed top-0 left-0 h-full w-80 bg-dymBlack z-40 transition-transform duration-300 ease-in-out
            transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:z-0
        `}>
			<div className='p-4 overflow-y-auto h-screen pt-16'>
				<div className='mb-6'>
					<select
						className='block w-full border border-zinc-300 rounded p-2'
						value={filters.sort}
						onChange={handleSortChange}>
						<option value='Todos los productos'>
							Todos los productos
						</option>
						<option value='Precio más alto'>Precio más alto</option>
						<option value='Precio más bajo'>Precio más bajo</option>
					</select>
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('productType')}
						className='flex justify-between w-full text-left font-bold'>
						Tipo de producto
						<span>{openSections.productType ? '▲' : '▼'}</span>
					</button>
					{openSections.productType && categoriesData && (
						<div className='mt-2'>
							{categoriesData.map((category: Category) => (
								<div key={category._id} className='mb-2'>
									<button
										className='flex justify-between w-3/4 text-left font-bold text-white'
										onClick={() =>
											handleCategoryChange(category._id)
										}>
										{category.name.charAt(0).toUpperCase() +
											category.name.slice(1)}
										<span>
											{selectedCategories.includes(
												category._id
											)
												? '▲'
												: '▼'}
										</span>
									</button>
									{selectedCategories.includes(
										category._id
									) && (
										<div className='ml-4 mt-2'>
											{category.subCategories.map(
												(subCategory) => (
													<label
														key={subCategory._id}
														className='block text-white'>
														<input
															type='checkbox'
															className='mr-2 form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
															checked={filters.productType.includes(
																subCategory._id
															)}
															onChange={() =>
																handleFilterChange(
																	'productType',
																	subCategory._id
																)
															}
														/>
														{subCategory.name
															.charAt(0)
															.toUpperCase() +
															subCategory.name.slice(
																1
															)}
													</label>
												)
											)}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('brand')}
						className='flex justify-between w-full text-left font-bold'>
						Marca
						<span>{openSections.brand ? '▲' : '▼'}</span>
					</button>
					{openSections.brand && brandsData && (
						<div className='mt-2 max-h-24 overflow-y-auto'>
							{brandsData.map((brand: Brand) => (
								<label key={brand._id} className='block'>
									<input
										type='checkbox'
										className='mr-2'
										checked={filters.brand.includes(
											brand._id
										)}
										onChange={() =>
											handleFilterChange(
												'brand',
												brand._id
											)
										}
									/>
									{brand.name.charAt(0).toUpperCase() +
										brand.name.slice(1)}
								</label>
							))}
						</div>
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('size')}
						className='flex justify-between w-full text-left font-bold'>
						Talle
						<span>{openSections.size ? '▲' : '▼'}</span>
					</button>
					{openSections.size && sizesData && (
						<div className='mt-2 max-h-24 overflow-y-auto'>
							{sizesData.map((size: ISizeMap) => (
								<label key={size._id} className='block'>
									<input
										type='checkbox'
										className='mr-2'
										checked={filters.size.includes(
											size._id
										)}
										onChange={() =>
											handleFilterChange('size', size._id)
										}
									/>
									{size.name.toUpperCase()}
								</label>
							))}
						</div>
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('gender')}
						className='flex justify-between w-full text-left font-bold'>
						Género
						<span>{openSections.gender ? '▲' : '▼'}</span>
					</button>
					{openSections.gender && (
						<div className='mt-2 max-h-26 overflow-y-auto'>
							<label className='block'>
								<input
									type='checkbox'
									className='mr-2'
									checked={filters.gender.includes('Hombre')}
									onChange={() =>
										handleFilterChange('gender', 'Hombre')
									}
								/>
								Hombre
							</label>
							<label className='block'>
								<input
									type='checkbox'
									className='mr-2'
									checked={filters.gender.includes('Mujer')}
									onChange={() =>
										handleFilterChange('gender', 'Mujer')
									}
								/>
								Mujer
							</label>
							<label className='block'>
								<input
									type='checkbox'
									className='mr-2'
									checked={filters.gender.includes('Unisex')}
									onChange={() =>
										handleFilterChange('gender', 'Unisex')
									}
								/>
								Unisex
							</label>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
