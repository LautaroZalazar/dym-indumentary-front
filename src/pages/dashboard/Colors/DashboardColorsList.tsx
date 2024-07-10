import Loader from '../../../components/loader';
import { useFetchColorsQuery } from '../../../redux/slices/catalogs.silce';
import { IColorMap } from './models/color-map.interface';

const DashboardColorsList = () => {
	const { data: colorData, isLoading: colorIsLoading } =
		useFetchColorsQuery('');

	if (colorIsLoading) return <Loader />;

	return (
		<div className='w-full h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar color'
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Ordenar
							</option>
						</select>
					</div>
				</div>
				<table className='w-full md:w-2/4 mt-24 mx-auto text-center overflow-y-auto'>
					<thead>
						<tr className='text-dymAntiPop'>
							<th className='py-2 px-4'>Nombre</th>
							<th className='py-2 px-4'>Vista</th>
						</tr>
					</thead>
					<tbody>
						{colorData.map((color: IColorMap) => (
							<tr key={color.name} className='text-dymAntiPop'>
								<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
									{color.name}
								</td>
								<td className='w-1/4 py-4 px-4 border-b border-gray-300'>
									<div>
										<button
											disabled
											className='w-14 h-6 relative group'
											style={{
												backgroundColor: color.hex,
											}}>
											<div
												className='absolute -top-5 w-24 h-24 border border-dymAntiPop hidden group-hover:block rounded-lg'
												style={{
													backgroundColor: color.hex,
													transform:
														'translateX(-8rem)',
												}}
											/>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardColorsList;
