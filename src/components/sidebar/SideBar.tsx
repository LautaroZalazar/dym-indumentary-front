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
            fixed top-0 left-0 h-screen w-64 bg-dymBlack z-40 transition-transform duration-300 ease-in-out
            transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:z-0
        `}>
			<div className='p-5 overflow-y-auto pt-20'>
				<p className='text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5'>Filtros</p>
				<div className='mb-5 pb-5 border-b border-zinc-800'>
					<p className='text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2'>Ordenar</p>
					<select
						className='block w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-dymOrange transition-colors'
						value={sort}
						onChange={handleSortChange}>
						<option value=''>Todos los productos</option>
						<option value='DESC'>Precio más alto</option>
						<option value='ASC'>Precio más bajo</option>
					</select>
				</div>
				<div className='mb-4 pb-4 border-b border-zinc-800'>
					<button
						onClick={() => toggleSection('category')}
						className='flex justify-between w-full text-left text-sm font-semibold text-white hover:text-dymOrange transition-colors py-1 group'>
						Categorías
						<span className='text-zinc-500 group-hover:text-dymOrange'>{openSections.category ? '−' : '+'}</span>
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
													className='flex justify-between w-3/4 text-left text-sm font-semibold text-zinc-300 hover:text-dymOrange transition-colors group'
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
															? '−'
															: '+'}
													</span>
												</button>
												{selectedCategories.includes(
													category._id
												) && (
													<div className='ml-4 mt-2'>
														<label
															key={category._id}
															className='block text-zinc-300 text-sm hover:text-white transition-colors cursor-pointer'>
															<input
																type='checkbox'
																className='mr-2 accent-dymOrange h-4 w-4 cursor-pointer'
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
																	className='block text-zinc-300 text-sm hover:text-white transition-colors cursor-pointer'>
																	<input
																		type='checkbox'
																		className='mr-2 accent-dymOrange h-4 w-4 cursor-pointer'
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
				<div className='mb-4 pb-4 border-b border-zinc-800'>
					<button
						onClick={() => toggleSection('brand')}
						className='flex justify-between w-full text-left text-sm font-semibold text-white hover:text-dymOrange transition-colors py-1 group'>
						Marca
						<span className='text-zinc-500 group-hover:text-dymOrange'>{openSections.brand ? '−' : '+'}</span>
					</button>
					{!brandsIsLoading ? (
						<>
							{openSections.brand && brandsData && (
								<div className='mt-2 max-h-40 overflow-y-auto space-y-1'>
									{brandsData.map((brand: Brand) => (
										<label
											key={brand._id}
											className='block text-zinc-300 text-sm hover:text-white transition-colors cursor-pointer'>
											<input
												type='checkbox'
												className='mr-2 accent-dymOrange h-4 w-4 cursor-pointer'
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
				<div className='mb-4 pb-4 border-b border-zinc-800'>
					<button
						onClick={() => toggleSection('size')}
						className='flex justify-between w-full text-left text-sm font-semibold text-white hover:text-dymOrange transition-colors py-1 group'>
						Talle
						<span className='text-zinc-500 group-hover:text-dymOrange'>{openSections.size ? '−' : '+'}</span>
					</button>
					{!sizesIsLoading ? (
						<>
							{openSections.size && sizesData && (
								<div className='mt-3 flex flex-wrap gap-2'>
									{sizesData.map((size: ISizeMap) => {
										const isSelected = filter.size.includes(size._id);
										return (
											<button
												key={size._id}
												onClick={() => handleFilterChange('size', size._id, !isSelected)}
												className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200 ${
													isSelected
														? 'bg-dymOrange border-dymOrange text-white'
														: 'bg-transparent border-zinc-700 text-zinc-400 hover:border-dymOrange hover:text-white'
												}`}>
												{size.name.toUpperCase()}
											</button>
										);
									})}
								</div>
							)}
						</>
					) : (
						<Skeleton_loader />
					)}
				</div>
				<div className='mb-4 pb-4 border-b border-zinc-800'>
					<button
						onClick={() => toggleSection('gender')}
						className='flex justify-between w-full text-left text-sm font-semibold text-white hover:text-dymOrange transition-colors py-1 group'>
						Género
						<span className='text-zinc-500 group-hover:text-dymOrange'>{openSections.gender ? '−' : '+'}</span>
					</button>
					{!sizesIsLoading ? (
						<>
							{openSections.gender && (
								<div className='mt-3 flex flex-wrap gap-2'>
									{(['hombre', 'mujer', 'niño', 'niña', 'unisex'] as const).map((g) => {
										const isSelected = filter.gender.includes(g);
										return (
											<button
												key={g}
												onClick={() => handleFilterChange('gender', g, !isSelected)}
												className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-200 ${
													isSelected
														? 'bg-dymOrange border-dymOrange text-white'
														: 'bg-transparent border-zinc-700 text-zinc-400 hover:border-dymOrange hover:text-white'
												}`}>
												{g.charAt(0).toUpperCase() + g.slice(1)}
											</button>
										);
									})}
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
