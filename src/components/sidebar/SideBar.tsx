import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ISideBarProps } from './models/sidebar-props.interface';
import { ICategoryMap } from '../../pages/dashboard/Categories/models/category-map.interface';
import { ISizeMap } from '../../pages/dashboard/Sizes/models/size-map.interface';
import { IFilterState } from '../../redux/slices/models/filter-state.interface';
import {
	useFetchCategoriesQuery,
	useFetchBrandsQuery,
	useFetchSizeQuery,
} from '../../redux/slices/catalogs.silce';
import { RootState } from '../../redux/store';
import {
	toggleFilter,
	setSort,
	selectFilters,
} from '../../redux/slices/filter.slice';

interface IBrandData {
	_id: string;
	name: string;
}

const SideBar: React.FC<ISideBarProps> = ({ isOpen }) => {
	const dispatch = useDispatch();
	const filters = useSelector((state: RootState) => selectFilters(state));
	const { data: categoriesData } = useFetchCategoriesQuery('');
	const { data: sizesData } = useFetchSizeQuery('');
	const { data: brandsData } = useFetchBrandsQuery('');
	const [openSections, setOpenSections] = useState({
		productType: true,
		gender: true,
		brand: true,
		size: true,
	});

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prevState) => ({
			...prevState,
			[section]: !prevState[section],
		}));
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
						<option>Más relevantes</option>
						<option>Menos relevantes</option>
						<option>Precio más alto</option>
						<option>Precio más bajo</option>
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
						<div className='mt-2 max-h-24 overflow-y-auto'>
							{categoriesData.map((category: ICategoryMap) => (
								<label key={category._id} className='block'>
									<input
										type='checkbox'
										className='mr-2'
										checked={filters.productType.includes(
											category._id
										)}
										onChange={() =>
											handleFilterChange(
												'productType',
												category._id
											)
										}
									/>
									{category.name.charAt(0).toUpperCase() +
										category.name.slice(1)}
								</label>
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
							{brandsData.map((brand: IBrandData) => (
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
						<div className='mt-2 max-h-24 overflow-y-auto'>
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SideBar;
