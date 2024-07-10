import { useState, useEffect, useRef } from 'react';
import { useFetchProductsQuery } from '../../../redux/slices/product.slice';
import { IProduct } from '../../../models/product/product.model';
import Loader from '../../../components/loader';

const DashboardProducts = () => {
	const [page, setPage] = useState<number>(1);
	const { data: productData, isLoading: productIsLoading } =
		useFetchProductsQuery({ limit: 30, page });
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			const container = containerRef.current;
			if (container) {
				const { scrollTop, scrollHeight, clientHeight } = container;
				if (
					scrollTop + clientHeight >= scrollHeight &&
					!productIsLoading &&
					page < 120
				) {
					setPage(page + 1);
				}
			}
		};

		containerRef.current?.addEventListener('scroll', handleScroll);
	}, [productIsLoading, page, containerRef]);

	if (productIsLoading) return <Loader />;

	return (
		<div ref={containerRef} className='h-screen w-full'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar producto'
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Ordenar
							</option>
						</select>
						<select className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Filtrar
							</option>
						</select>
					</div>
				</div>
				<table className='w-full mt-20 overflow-y-auto'>
					<thead>
						<tr className='text-dymAntiPop'>
							<th className='w-1/4 text-start py-2 px-4'>
								Precio
							</th>
							<th className='w-1/4 text-start py-2 px-4'>
								Producto
							</th>
							<th className='w-1/4 text-start py-2 px-4'>
								Stock
							</th>
							<th className='w-1/4 text-start py-2 px-4'>
								Activo
							</th>
							<th className='w-1/12 text-start py-2 px-4'>
								Editar
							</th>
						</tr>
					</thead>
					<tbody>
						{productData?.map(
							(e: IProduct, productIndex: number) => (
								<tr
									className='border-b border-gray-300 text-dymAntiPop'
									key={productIndex}>
									<td className='py-4 px-4'>
										<p>${e.price}</p>
									</td>
									<td className='py-4 px-4'>
										{e.name.length < 18 ? (
											<p className='pl-2'>{e.name}</p>
										) : (
											<p className='pl-2' title={e.name}>
												{e.name
													.slice(0, 12)
													.concat('...')}
											</p>
										)}
									</td>
									<td className='py-4 px-4'>
										<p>
											{e.inventory.some(
												(i: any) => i.stock.length > 0
											)
												? 'Disponible'
												: 'No Disponible'}
										</p>
									</td>
									<td className='py-4 px-4'>
										<div>
											{e.inventory.some(
												(i: any) => i.stock.length > 0
											) ? (
												<button type='button'>
													Activo
												</button>
											) : (
												<p>-</p>
											)}
										</div>
									</td>
									<td className='py-4 px-4'>
										<div>
											<button type='button'>
												Editar
											</button>
										</div>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardProducts;
