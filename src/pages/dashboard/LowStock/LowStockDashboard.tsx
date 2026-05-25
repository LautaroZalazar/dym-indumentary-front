import { useState } from 'react';
import { useFetchLowStockQuery } from '../../../redux/slices/variant.slice';
import Loader from '../../../components/loader';
import Pagination from '../components/Pagination/Pagination';

const idOf = (ref: any): string =>
	typeof ref === 'string' ? ref : ref?._id ?? '';

const nameOf = (ref: any): string =>
	typeof ref === 'string' ? '-' : ref?.name ?? '-';

const LowStockDashboard = () => {
	const [page, setPage] = useState(1);
	const [threshold, setThreshold] = useState<string>('');
	const limit = 20;
	const { data, isLoading } = useFetchLowStockQuery({
		threshold: threshold === '' ? undefined : Number(threshold),
		page,
		limit,
	});

	if (isLoading) return <Loader />;

	return (
		<div className='flex flex-col flex-1'>
			<div className='flex flex-col bg-dymBlack flex-grow p-2'>
				<div className='flex flex-col md:flex-row gap-4 mt-4 items-start md:items-center'>
					<h1 className='text-2xl text-dymAntiPop'>Stock bajo</h1>
					<div className='flex items-center gap-2'>
						<label className='text-dymAntiPop text-sm'>Umbral:</label>
						<input
							type='number'
							min={0}
							placeholder='≤ minStock'
							value={threshold}
							onChange={(e) => {
								setPage(1);
								setThreshold(e.target.value);
							}}
							className='w-28 rounded-md p-2 border border-gray-300 bg-dymBlack text-dymAntiPop'
						/>
						{threshold && (
							<button
								className='text-xs underline text-dymAntiPop'
								onClick={() => setThreshold('')}>
								limpiar
							</button>
						)}
					</div>
				</div>

				<div className='flex flex-col justify-center'>
					<div className='flex-grow overflow-y-auto mt-8 max-h-[calc(100vh-260px)]'>
						<table className='w-full'>
							<thead>
								<tr className='text-dymAntiPop'>
									<th className='text-start py-2 px-4'>SKU</th>
									<th className='text-start py-2 px-4'>Producto</th>
									<th className='text-start py-2 px-4'>Talle</th>
									<th className='text-start py-2 px-4'>Color</th>
									<th className='text-end py-2 px-4'>Stock</th>
									<th className='text-end py-2 px-4'>Mín.</th>
								</tr>
							</thead>
							<tbody>
								{data && data.variants.length > 0 ? (
									data.variants.map((v) => {
										const product: any = v.productId;
										const productName =
											typeof product === 'object'
												? product?.name ?? '-'
												: '-';
										const productLink =
											typeof product === 'object' && product?._id
												? `/dashboard/products?openProduct=${product._id}`
												: '#';
										return (
											<tr
												key={v._id}
												className='border-b border-gray-300 text-dymAntiPop'>
												<td className='py-3 px-4 font-mono'>{v.sku}</td>
												<td className='py-3 px-4'>
													<a className='underline' href={productLink}>
														{productName}
													</a>
												</td>
												<td className='py-3 px-4'>{nameOf(v.size)}</td>
												<td className='py-3 px-4'>
													<span className='inline-flex items-center gap-2'>
														<span
															className='inline-block w-4 h-4 rounded-full border'
															style={{
																backgroundColor:
																	typeof v.color === 'object'
																		? v.color?.hex
																		: undefined,
															}}
														/>
														{nameOf(v.color)}
													</span>
												</td>
												<td className='py-3 px-4 text-end text-red-500 font-semibold'>
													{v.quantity}
												</td>
												<td className='py-3 px-4 text-end'>{v.minStock}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={6} className='text-center py-4'>
											{idOf(null) /* no-op */}
											No hay variantes en bajo stock 🎉
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{data && (
						<Pagination
							currentPage={page}
							totalItems={data.totalCount}
							itemsPerPage={limit}
							onPageChange={setPage}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default LowStockDashboard;
