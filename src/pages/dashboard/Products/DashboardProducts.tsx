import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFetchProductsQuery } from '../../../redux/slices/product.slice';
import { useUpdateProductMutation } from '../../../redux/slices/admin.slice';
import DashboardUpdateProductModal from './DashboardUpdateProductModal';
import { IProduct } from '../../../models/product/product.model';
import Loader from '../../../components/loader';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';

const DashboardProducts = () => {
	const [page, setPage] = useState<number>(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState('');
	const [filterOption, setFilterOption] = useState('');
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [productId, setProductId] = useState('');
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();
	const containerRef = useRef<HTMLDivElement>(null);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const {
		data: productData,
		isLoading: productIsLoading,
		refetch: refetchProducts,
	} = useFetchProductsQuery({ limit: 30, page });

	const [updateProduct] = useUpdateProductMutation();

	const handleCheckboxChange = (
		productId: string,
		currentActive: boolean,
		productName: string
	) => {
		showConfirmModal({
			message: `¿Estás seguro que quieres ${
				currentActive === true ? 'desactivar' : 'activar'
			} "${productName}"`,
			onAccept: async () => {
				const isActive = !currentActive;
				try {
					await updateProduct({
						id: productId,
						data: { isActive },
					}).unwrap();
					await refetchProducts();
					showMessage(
						'success',
						`Se ${
							currentActive === true ? 'desactivó' : 'activó'
						} correctamente "${productName}"`,
						3000
					);
				} catch (error: any) {
					showMessage(
						'error',
						`Error al activar o desactivar "${productName}"`,
						3000
					);
					throw new Error(error);
				}
			},
		});
	};

	const handleUpdateModal = (productId: string) => {
		setProductId(productId);
		setUpdateModalOpen(true);
	};

	const handleScroll = useCallback(() => {
		const container = containerRef.current;
		if (container) {
		  const { scrollTop, scrollHeight, clientHeight } = container;
		  if (container.scrollLeft === 0 && container.scrollLeft != 0 && scrollTop + clientHeight >= scrollHeight && !productIsLoading && hasMore && !loadingMore) {
			setLoadingMore(true);
			setPage((prevPage) => prevPage + 1);
		  }
		}
	  }, [productIsLoading, hasMore, loadingMore]);

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => {
				container.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	useEffect(() => {
		if (productData) {
			setHasMore(productData.length > 0);
		}
	}, [productData]);

	useEffect(() => {
		if (!productIsLoading) {
			setLoadingMore(false);
		}
	}, [productIsLoading]);

	const filteredAndSortedProducts = useMemo(() => {
		if (!productData) return [];

		let filteredProducts = productData.filter((product: IProduct) => {
			const matchesSearch = product.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			const matchesFilter =
				filterOption === '' ||
				(filterOption === 'inStock' &&
					product.inventory.some((i: any) => i.stock.length > 0)) ||
				(filterOption === 'outOfStock' &&
					!product.inventory.some((i: any) => i.stock.length > 0)) ||
				(filterOption === 'active' && product.isActive) ||
				(filterOption === 'inactive' && !product.isActive);

			return matchesSearch && matchesFilter;
		});

		if (sortOption === 'nameAsc') {
			return filteredProducts.sort((a: IProduct, b: IProduct) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOption === 'nameDesc') {
			return filteredProducts.sort((a: IProduct, b: IProduct) =>
				b.name.localeCompare(a.name)
			);
		}

		return filteredProducts;
	}, [productData, searchTerm, sortOption, filterOption]);

	const handleReset = () => {
		setSearchTerm('');
		setSortOption('');
		setFilterOption('');
	};

	if (productIsLoading) return <Loader />;

	return (
		<div className='h-screen w-full'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 md:space-y-0 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar producto'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select
							className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={sortOption}
							onChange={(e) => setSortOption(e.target.value)}>
							<option value='' hidden>
								Ordenar
							</option>
							<option value='nameAsc'>Ascendente</option>
							<option value='nameDesc'>Descendente</option>
						</select>
						<select
							className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={filterOption}
							onChange={(e) => setFilterOption(e.target.value)}>
							<option value='' hidden>
								Filtrar
							</option>
							<option value='inStock'>Con Stock</option>
							<option value='outOfStock'>Sin Stock</option>
							<option value='active'>Activo</option>
							<option value='inactive'>Inactivo</option>
						</select>
						{(sortOption || filterOption) && (
							<button
								className='p-2 bg-red-500 text-white rounded-md'
								onClick={handleReset}>
								Deshacer
							</button>
						)}
					</div>
				</div>
				<div
					ref={containerRef}
					className='overflow-y-auto mt-24'
					style={{ maxHeight: 'calc(100vh - 150px)' }}>
					<table className='w-full'>
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
							{filteredAndSortedProducts.length ? (
								filteredAndSortedProducts.map(
									(e: IProduct, productIndex: number) => (
										<tr
											className='border-b border-gray-300 text-dymAntiPop'
											key={productIndex}>
											<td className='py-4 px-4'>
												<p>${e.price}</p>
											</td>
											<td className='py-4 px-4'>
												{e.name.length < 18 ? (
													<p className='pl-2'>
														{e.name
															.charAt(0)
															.toUpperCase() +
															e.name.slice(1)}
													</p>
												) : (
													<p
														className='pl-2'
														title={
															e.name
																.charAt(0)
																.toUpperCase() +
															e.name.slice(1)
														}>
														{e.name
															.slice(0, 12)
															.concat('...')}
													</p>
												)}
											</td>
											<td className='py-4 px-4'>
												{e.inventory.some(
													(i: any) =>
														i.stock.length > 0
												) ? (
													<p className='text-green-600'>
														Disponible
													</p>
												) : (
													<p className='text-red-600'>
														No Disponible
													</p>
												)}
											</td>
											<td className='py-4 px-4'>
												<label className='inline-flex items-center cursor-pointer'>
													<input
														type='checkbox'
														checked={!e.isActive}
														onChange={() =>
															handleCheckboxChange(
																e._id,
																e.isActive,
																e.name
															)
														}
														className='sr-only peer'
													/>
													<div className="relative w-11 h-6 peer-focus:outline-none rounded-full peer bg-dymAntiPop peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-red-500 peer-checked:after:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-green-500 after:border-green-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
												</label>
											</td>
											<td className='py-4 px-4'>
												<button
													className='underline text-dymAntiPop roundedfocus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
													onClick={() =>
														handleUpdateModal(e._id)
													}>
													Editar
												</button>
											</td>
										</tr>
									)
								)
							) : (
								<tr>
									<td
										colSpan={5}
										className='text-center py-4'>
										No hay productos disponibles
									</td>
								</tr>
							)}
						</tbody>
						{loadingMore && (
							<div className='flex justify-center py-4'>
								<Loader />
							</div>
						)}
					</table>
				</div>
				{updateModalOpen && (
					<DashboardUpdateProductModal
						productId={productId}
						closeModal={() => setUpdateModalOpen(false)}
						refetch={() => refetchProducts()}
					/>
				)}
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardProducts;
