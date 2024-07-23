import { useState, useMemo } from 'react';
import Loader from '../../../components/loader';
import { useFetchBrandsQuery } from '../../../redux/slices/catalogs.silce';
import { IBrandMap } from './models/brand-map.interface';

const DashboardBrandsList = () => {
	const { data: brandData, isLoading: dataIsLoading } =
		useFetchBrandsQuery('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('');

	const filteredBrand = useMemo(() => {
		if (!brandData) return [];
		let filtered = brandData.filter((brand: IBrandMap) =>
			brand.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (sortOrder === 'asc') {
			filtered.sort((a: IBrandMap, b: IBrandMap) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOrder === 'desc') {
			filtered.sort((a: IBrandMap, b: IBrandMap) =>
				b.name.localeCompare(a.name)
			);
		}

		return filtered;
	}, [brandData, searchTerm, sortOrder]);

	const resetSortOrder = () => {
		setSortOrder('');
	};

	if (dataIsLoading) return <Loader />;

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar marca'
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
				<div
					className='overflow-y-auto mt-24'
					style={{ maxHeight: 'calc(100vh - 150px)' }}>
					<table className='w-1/6 mx-auto text-center'>
						<thead>
							<tr className='text-dymAntiPop'>
								<th className='py-2 px-4'>Nombre</th>
							</tr>
						</thead>
						<tbody>
							{filteredBrand.length ? (
								filteredBrand.map((brand: IBrandMap) => (
									<tr
										key={brand.name}
										className='text-dymAntiPop'>
										<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
											{brand.name
												.charAt(0)
												.toUpperCase() +
												brand.name.slice(1)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={1}
										className='text-center py-4'>
										No hay marcas disponibles
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default DashboardBrandsList;
