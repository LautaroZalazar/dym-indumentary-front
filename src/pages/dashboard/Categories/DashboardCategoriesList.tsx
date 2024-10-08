import { useState, useMemo } from 'react';
import Loader from '../../../components/loader';
import { useFetchCategoriesQuery } from '../../../redux/slices/catalogs.silce';
import { ICategoryMap } from './models/category-map.interface';
import SubcategoriesModal from './Subcategories/SubcategoriesModal';

const DashboardCategoriesList = () => {
	const {
		data: categoryData,
		isLoading: categoryIsLoading,
		refetch: categoryRefetch,
	} = useFetchCategoriesQuery('');
	const [selectedCategory, setSelectedCategory] =
		useState<ICategoryMap | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('');

	const filteredCategory = useMemo(() => {
		if (!categoryData) return [];
		let filtered = categoryData.filter((category: ICategoryMap) =>
			category.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (sortOrder === 'asc') {
			filtered.sort((a: ICategoryMap, b: ICategoryMap) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOrder === 'desc') {
			filtered.sort((a: ICategoryMap, b: ICategoryMap) =>
				b.name.localeCompare(a.name)
			);
		}

		return filtered;
	}, [categoryData, searchTerm, sortOrder]);

	const resetSortOrder = () => {
		setSortOrder('');
	};

	if (categoryIsLoading) return <Loader />;

	return (
		<div className='min-h-screen flex flex-col overflow-hidden pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col bg-dymBlack flex-grow p-2'>
				<div className='flex flex-col md:flex-row md:space-x-24 space-y-4 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar categoría'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className='flex items-center md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select
							className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}>
							<option value='' hidden>
								Ordenar
							</option>
							<option value='asc'>Ascendente</option>
							<option value='desc'>Descendente</option>
						</select>
						{sortOrder && (
							<button
								className='ml-2 p-2 bg-red-500 text-white rounded-md'
								onClick={resetSortOrder}>
								Deshacer orden
							</button>
						)}
					</div>
				</div>
				<div className='flex-grow overflow-y-auto mt-8 md:mt-16 max-h-[calc(100vh-150px)]'>
					<table className='w-2/4 mx-auto text-center'>
						<thead>
							<tr className='text-dymAntiPop'>
								<th className='py-2 px-4'>Nombre</th>
								<th className='py-2 px-4'>Subcategoría</th>
							</tr>
						</thead>
						<tbody>
							{filteredCategory.length ? (
								filteredCategory.map(
									(category: ICategoryMap) => (
										<tr
											key={category.name}
											className='text-dymAntiPop'>
											<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
												{category.name
													.charAt(0)
													.toUpperCase() +
													category.name.slice(1)}
											</td>
											<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
												<button
													onClick={() =>
														setSelectedCategory(
															category
														)
													}
													className='underline'>
													Ver
												</button>
											</td>
										</tr>
									)
								)
							) : (
								<tr>
									<td
										colSpan={2}
										className='text-center py-4'>
										No hay categorías disponibles
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{selectedCategory && (
					<SubcategoriesModal
						subCategories={selectedCategory.subCategories}
						closeModal={() => setSelectedCategory(null)}
						categoryId={selectedCategory._id}
						categoryRefetch={categoryRefetch}
					/>
				)}
			</div>
		</div>
	);
};

export default DashboardCategoriesList;
