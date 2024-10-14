import React, { useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setFilter, setPage, setSort } from '../../redux/slices/filter.silce';
import Skeleton_loader from '../Skeleton_loader';

const SideBar: React.FC<ISideBarProps> = ({ isOpen }) => {
	const dispatch = useDispatch();
	const { filter, sort } = useSelector((state: RootState) => state.filter);
	const { data: categoriesData, isLoading: categoriesIsLoading } =
		useFetchCategoriesQuery('');
	const { data: sizesData, isLoading: sizesIsLoading } =
		useFetchSizeQuery('');
	const { data: brandsData, isLoading: brandsIsLoading } =
		useFetchBrandsQuery('');
	const [openSections, setOpenSections] = useState({
		category: true,
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
		type: keyof IFilterState['filter'],
		id: string,
		checked: boolean
	) => {
		dispatch(setPage(1));
		dispatch(
			setFilter({
				[type]: checked
					? [...filter[type], id]
					: filter[type].filter((item: string) => item !== id),
			} as Partial<IFilterState['filter']>)
		);
	};

	const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		dispatch(setPage(1));
		dispatch(setSort(event.target.value));
	};

	return (
		<div
			className={`
            fixed top-0 left-0 h-screen min-w-80 bg-dymBlack z-40 transition-transform duration-300 ease-in-out
            transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:z-0
        `}>
			<div className='p-4 overflow-y-auto pt-16'>
				<div className='mb-6'>
					<select
						className='block w-full border border-zinc-300 rounded p-2'
						value={sort}
						onChange={handleSortChange}>
						<option value=''>Todos los productos</option>
						<option value='DESC'>Precio más alto</option>
						<option value='ASC'>Precio más bajo</option>
					</select>
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('category')}
						className='flex justify-between w-full text-left font-bold'>
						Categorías
						<span>{openSections.category ? '▲' : '▼'}</span>
					</button>
					{!categoriesIsLoading ? (
						<>
							{openSections.category && categoriesData && (
								<div className='mt-2'>
									{categoriesData.map(
										(category: Category) => (
											<div
												key={category._id}
												className='mb-2'>
												<button
													className='flex justify-between w-3/4 text-left font-bold text-white'
													onClick={() =>
														handleCategoryChange(
															category._id
														)
													}>
													{category.name
														.charAt(0)
														.toUpperCase() +
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
														<label
															key={category._id}
															className='block text-white'>
															<input
																type='checkbox'
																className='mr-2 form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
																checked={filter.category.includes(
																	category._id
																)}
																onChange={(e) =>
																	handleFilterChange(
																		'category',
																		category._id,
																		e.target
																			.checked
																	)
																}
															/>
															Todos
														</label>
														{category.subCategories.map(
															(subCategory) => (
																<label
																	key={
																		subCategory._id
																	}
																	className='block text-white'>
																	<input
																		type='checkbox'
																		className='mr-2 form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out'
																		checked={filter.subCategory.includes(
																			subCategory._id
																		)}
																		onChange={(
																			e
																		) =>
																			handleFilterChange(
																				'subCategory',
																				subCategory._id,
																				e
																					.target
																					.checked
																			)
																		}
																	/>
																	{subCategory.name
																		.charAt(
																			0
																		)
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
										)
									)}
								</div>
							)}
						</>
					) : (
						<Skeleton_loader />
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('brand')}
						className='flex justify-between w-full text-left font-bold'>
						Marca
						<span>{openSections.brand ? '▲' : '▼'}</span>
					</button>
					{!brandsIsLoading ? (
						<>
							{openSections.brand && brandsData && (
								<div className='mt-2 max-h-24 overflow-y-auto'>
									{brandsData.map((brand: Brand) => (
										<label
											key={brand._id}
											className='block'>
											<input
												type='checkbox'
												className='mr-2'
												checked={filter.brand.includes(
													brand._id
												)}
												onChange={(e) =>
													handleFilterChange(
														'brand',
														brand._id,
														e.target.checked
													)
												}
											/>
											{brand.name
												.charAt(0)
												.toUpperCase() +
												brand.name.slice(1)}
										</label>
									))}
								</div>
							)}
						</>
					) : (
						<Skeleton_loader />
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('size')}
						className='flex justify-between w-full text-left font-bold'>
						Talle
						<span>{openSections.size ? '▲' : '▼'}</span>
					</button>
					{!sizesIsLoading ? (
						<>
							{openSections.size && sizesData && (
								<div className='mt-2 max-h-24 overflow-y-auto'>
									{sizesData.map((size: ISizeMap) => (
										<label key={size._id} className='block'>
											<input
												type='checkbox'
												className='mr-2'
												checked={filter.size.includes(
													size._id
												)}
												onChange={(e) =>
													handleFilterChange(
														'size',
														size._id,
														e.target.checked
													)
												}
											/>
											{size.name.toUpperCase()}
										</label>
									))}
								</div>
							)}
						</>
					) : (
						<Skeleton_loader />
					)}
				</div>
				<div className='mb-4'>
					<button
						onClick={() => toggleSection('gender')}
						className='flex justify-between w-full text-left font-bold'>
						Género
						<span>{openSections.gender ? '▲' : '▼'}</span>
					</button>
					{!sizesIsLoading ? (
						<>
							{openSections.gender && (
								<div className='mt-2 max-h-26 overflow-y-auto'>
									<label className='block'>
										<input
											type='checkbox'
											className='mr-2'
											checked={filter.gender.includes(
												'hombre'
											)}
											onChange={(e) =>
												handleFilterChange(
													'gender',
													'hombre',
													e.target.checked
												)
											}
										/>
										Hombre
									</label>
									<label className='block'>
										<input
											type='checkbox'
											className='mr-2'
											checked={filter.gender.includes(
												'mujer'
											)}
											onChange={(e) =>
												handleFilterChange(
													'gender',
													'mujer',
													e.target.checked
												)
											}
										/>
										Mujer
									</label>
									<label className='block'>
										<input
											type='checkbox'
											className='mr-2'
											checked={filter.gender.includes(
												'niño'
											)}
											onChange={(e) =>
												handleFilterChange(
													'gender',
													'niño',
													e.target.checked
												)
											}
										/>
										Niño
									</label>
									<label className='block'>
										<input
											type='checkbox'
											className='mr-2'
											checked={filter.gender.includes(
												'niña'
											)}
											onChange={(e) =>
												handleFilterChange(
													'gender',
													'niña',
													e.target.checked
												)
											}
										/>
										Niña
									</label>
									<label className='block'>
										<input
											type='checkbox'
											className='mr-2'
											checked={filter.gender.includes(
												'unisex'
											)}
											onChange={(e) =>
												handleFilterChange(
													'gender',
													'unisex',
													e.target.checked
												)
											}
										/>
										Unisex
									</label>
								</div>
							)}
						</>
					) : (
						<Skeleton_loader />
					)}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
