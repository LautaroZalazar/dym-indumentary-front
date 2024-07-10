import Loader from '../../../components/loader';
import { useFetchSizeQuery } from '../../../redux/slices/catalogs.silce';
import {ISizeMap} from './models/size-map.interface'

const DashboardSizesList = () => {
	const { data: sizeData, isLoading: dataIsLoading } = useFetchSizeQuery('');

    if(dataIsLoading) return <Loader />

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4 '>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar talle'
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Ordenar
							</option>
						</select>
					</div>
				</div>
				<table className='w-1/6 mt-24 mx-auto text-center overflow-y-auto'>
					<thead>
						<tr className='text-dymAntiPop'>
							<th className='py-2 px-4'>Nombre</th>
						</tr>
					</thead>
					<tbody>
						{sizeData.map((size: ISizeMap) => (
							<tr
								key={size.name}
								className='text-dymAntiPop'>
								<td className='w-1/4 py-4 px-4 border-b border-gray-300'>{size.name}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardSizesList;
