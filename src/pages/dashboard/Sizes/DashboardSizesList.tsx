import Loader from '../../../components/loader';
import { useFetchSizeQuery } from '../../../redux/slices/catalogs.silce';
import { useState, useMemo } from 'react';
import { ISizeMap } from './models/size-map.interface';

const DashboardSizesList = () => {
	const { data: sizeData, isLoading: dataIsLoading } = useFetchSizeQuery('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('');

	const filteredSize = useMemo(() => {
		if (!sizeData) return [];
		let filtered = sizeData.filter((size: ISizeMap) =>
			size.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (sortOrder === 'asc') {
			filtered.sort((a: ISizeMap, b: ISizeMap) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOrder === 'desc') {
			filtered.sort((a: ISizeMap, b: ISizeMap) =>
				b.name.localeCompare(a.name)
			);
		}

		return filtered;
	}, [sizeData, searchTerm, sortOrder]);

	const resetSortOrder = () => {
		setSortOrder('');
	};

	if (dataIsLoading) return <Loader />;

	return (
		<div className='min-h-screen flex flex-col overflow-hidden pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col bg-dymBlack flex-grow p-2'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar talle'
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
					className="flex-grow overflow-y-auto mt-8 md:mt-16 max-h-[calc(100vh-150px)]">
					<table className='w-1/6 mx-auto text-center'>
						<thead>
							<tr className='text-dymAntiPop'>
								<th className='py-2 px-4'>Nombre</th>
							</tr>
						</thead>
						<tbody>
							{filteredSize.length ? (
								filteredSize.map((size: ISizeMap) => (
									<tr
										key={size.name}
										className='text-dymAntiPop'>
										<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
											{size.name.toUpperCase()}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={1}
										className='text-center py-4'>
										No hay talles disponibles
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

export default DashboardSizesList;
