import { useFetchMovementsQuery } from '../../../../redux/slices/variant.slice';
import xIcon from '../../../../assets/SVG/x.svg';
import Loader from '../../../../components/loader';

interface IProps {
	variantId: string;
	sku: string;
	onClose: () => void;
}

const labelByType: Record<string, string> = {
	in: 'Entrada',
	out: 'Salida',
	adjust: 'Ajuste',
};

const MovementsHistoryModal: React.FC<IProps> = ({ variantId, sku, onClose }) => {
	const { data, isLoading } = useFetchMovementsQuery({
		variantId,
		page: 1,
		limit: 50,
	});

	return (
		<div className='fixed inset-0 z-[60] flex justify-center items-center bg-dymBlack bg-opacity-80'>
			<div className='bg-dymBlack border border-dymOrange p-4 rounded-lg shadow-lg w-full md:w-3/5 lg:w-1/2 xl:w-2/5 max-h-[80vh] flex flex-col mx-2'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-lg font-bold'>
						Historial de movimientos
						<span className='ml-2 text-dymOrange text-sm'>{sku}</span>
					</h3>
					<button
						type='button'
						onClick={onClose}
						className='p-1 rounded-lg hover:bg-dymOrange-dark transition-colors duration-300'>
						<img src={xIcon.toString()} className='w-4 h-4' />
					</button>
				</div>
				<div className='overflow-y-auto'>
					{isLoading && <Loader />}
					{!isLoading && data && data.movements.length === 0 && (
						<p className='text-dymAntiPop text-center p-6'>
							Sin movimientos registrados aún.
						</p>
					)}
					{!isLoading && data && data.movements.length > 0 && (
						<table className='w-full text-sm'>
							<thead>
								<tr className='text-dymAntiPop border-b border-gray-600'>
									<th className='text-left py-2 px-2'>Fecha</th>
									<th className='text-left py-2 px-2'>Tipo</th>
									<th className='text-right py-2 px-2'>Δ</th>
									<th className='text-right py-2 px-2'>Stock</th>
									<th className='text-left py-2 px-2'>Motivo</th>
								</tr>
							</thead>
							<tbody>
								{data.movements.map((m) => (
									<tr
										key={m._id}
										className='border-b border-gray-700 text-dymAntiPop'>
										<td className='py-2 px-2'>
											{new Date(m.createdAt).toLocaleString('es-AR')}
										</td>
										<td className='py-2 px-2'>{labelByType[m.type] ?? m.type}</td>
										<td
											className={`py-2 px-2 text-right ${
												m.qtyDelta > 0
													? 'text-green-500'
													: m.qtyDelta < 0
													? 'text-red-500'
													: ''
											}`}>
											{m.qtyDelta > 0 ? `+${m.qtyDelta}` : m.qtyDelta}
										</td>
										<td className='py-2 px-2 text-right'>{m.qtyAfter}</td>
										<td className='py-2 px-2'>{m.reason ?? '-'}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
				<div className='mt-4 flex justify-end'>
					<button
						type='button'
						onClick={onClose}
						className='p-2 border border-dymOrange rounded-lg hover:bg-dymOrange-dark'>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	);
};

export default MovementsHistoryModal;
