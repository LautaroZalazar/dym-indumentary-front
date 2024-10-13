import { useState, useMemo } from 'react';
import Loader from '../../../components/loader';
import { useFetchColorsQuery } from '../../../redux/slices/catalogs.silce';
import { IColorMap } from './models/color-map.interface';

const DashboardColorsList = () => {
	const { data: colorData, isLoading: colorIsLoading } =
		useFetchColorsQuery('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('');

	const filteredColor = useMemo(() => {
		if (!colorData) return [];
		let filtered = colorData.filter((color: IColorMap) =>
			color.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (sortOrder === 'asc') {
			filtered.sort((a: IColorMap, b: IColorMap) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOrder === 'desc') {
			filtered.sort((a: IColorMap, b: IColorMap) =>
				b.name.localeCompare(a.name)
			);
		}

		return filtered;
	}, [colorData, searchTerm, sortOrder]);

	const resetSortOrder = () => {
		setSortOrder('');
	};

	if (colorIsLoading) return <Loader />;

	return (
		<div className='min-h-screen flex flex-col overflow-hidden pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col bg-dymBlack flex-grow p-2'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar color'
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
				<div className='flex-grow overflow-y-auto mt-8 md:mt-16 max-h-[calc(100vh-260px)]'>
					<table className='w-full md:w-2/4 mx-auto text-center mb-4'>
						<thead>
							<tr className='text-dymAntiPop'>
								<th className='py-2 px-4'>Nombre</th>
								<th className='py-2 px-4'>Vista</th>
							</tr>
						</thead>
						<tbody>
							{filteredColor.length ? (
								filteredColor.map((color: IColorMap) => (
									<tr
										key={color.name}
										className='text-dymAntiPop'>
										<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
											{color.name
												.charAt(0)
												.toUpperCase() +
												color.name.slice(1)}
										</td>
										<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
											<div>
												<button
													disabled
													className='w-14 h-6 relative group'
													style={{
														backgroundColor:
															color.hex,
													}}>
													<div
														className='absolute -top-8 w-24 h-24 border border-dymAntiPop hidden group-hover:block rounded-lg'
														style={{
															backgroundColor:
																color.hex,
															transform:
																'translateX(-8rem)',
														}}
													/>
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={2}
										className='text-center py-4'>
										No hay colores disponibles
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

export default DashboardColorsList;
