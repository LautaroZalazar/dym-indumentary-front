import { useState } from 'react';
import Loader from '../../../components/loader';
import { useFetchCategoriesQuery } from '../../../redux/slices/catalogs.silce';
import { ICategoryMap } from './models/category-map.interface';
import SubcategoriesModal from './Subcategories/SubcategoriesModal';

const DashboardCategoriesList = () => {
	const { data: categoryData, isLoading: categoryIsLoading, refetch: categoryRefetch } =
		useFetchCategoriesQuery('');
	const [selectedCategory, setSelectedCategory] =
		useState<ICategoryMap | null>(null);

	if (categoryIsLoading) return <Loader />;

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4 '>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar categoría'
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Ordenar
							</option>
						</select>
					</div>
				</div>
				<table className='w-2/4 mt-24 mx-auto text-center overflow-y-auto'>
					<thead>
						<tr className='text-dymAntiPop'>
							<th className='py-2 px-4'>Nombre</th>
							<th className='py-2 px-4'>Subcategoría</th>
						</tr>
					</thead>
					<tbody>
						{categoryData.map((category: ICategoryMap) => (
							<>
								<tr
									key={category.name}
									className='text-dymAntiPop'>
									<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
										{category.name}
									</td>
									<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
										<button
											onClick={() =>
												setSelectedCategory(category)
											}
											className='underline'>
											Ver
										</button>
									</td>
								</tr>
							</>
						))}
					</tbody>
				</table>
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
