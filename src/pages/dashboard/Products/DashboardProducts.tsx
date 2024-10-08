import { useState } from 'react';
import {
	useUpdateProductMutation,
	useFetchAdminProductsQuery,
} from '../../../redux/slices/admin.slice';
import DashboardUpdateProductModal from './DashboardUpdateProductModal';
import { IProductData } from '../../../models/product/product.model';
import Loader from '../../../components/loader';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';
import { IProductFilters } from '../models/filters.interface';
import Pagination from '../components/Pagination/Pagination';
import searchIcon from '../../../assets/SVG/searchIcon.svg';
import x from '../../../assets/SVG/x.svg';

const DashboardProducts = () => {
	const [sortOption, setSortOption] = useState('');
	const [filters, setFilters] = useState<IProductFilters>({
		stock: undefined,
		isActive: undefined,
	});
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [productId, setProductId] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [hasSearched, setHasSearched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();

	const {
		data: adminProductsData,
		refetch: refetchAdminProducts,
		isLoading: adminProductsLoading,
	} = useFetchAdminProductsQuery({
		sort: sortOption,
		limit: 10,
		page: currentPage,
		isActive: filters.isActive,
		stock: filters.stock,
		name: searchTerm,
	});

	const [updateProduct] = useUpdateProductMutation();

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleSearch = () => {
		if (inputValue) {
			setSearchTerm(inputValue);
			setHasSearched(true);
		} else {
			setHasSearched(false);
			setSearchTerm('');
		}
	};
	const handleSearchClear = () => {
		setInputValue('');
		setSearchTerm('');
		setHasSearched(false);
	};

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
					await refetchAdminProducts();
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

	const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		if (value === 'inStock') {
			setFilters({
				...filters,
				stock: true,
				isActive: undefined,
			});
		} else if (value === 'outOfStock') {
			setFilters({
				...filters,
				stock: false,
				isActive: undefined,
			});
		} else if (value === 'active') {
			setFilters({
				...filters,
				stock: undefined,
				isActive: true,
			});
		} else if (value === 'inactive') {
			setFilters({
				...filters,
				stock: undefined,
				isActive: false,
			});
		} else {
			setFilters({
				...filters,
				stock: undefined,
				isActive: undefined,
			});
		}
	};

	const handleReset = () => {
		setSortOption('');
		setFilters({ ...filters, stock: undefined, isActive: undefined });
	};

	if (adminProductsLoading) return <Loader />;

	return (
		<div className='min-h-screen flex flex-col overflow-hidden pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col bg-dymBlack flex-grow p-2'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 md:space-y-0 mt-4'>
					<div className='flex w-full md:w-1/4'>
						<input
							className='w-full rounded-md rounded-r-none p-2 border border-gray-300'
							placeholder='Buscar producto'
							value={inputValue}
							onChange={handleInputChange}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									handleSearch();
								}
							}}
						/>
						<button
							className={`p-2 rounded-r-md ${
								hasSearched
									? 'border border-dymOrange'
									: 'bg-dymOrange'
							} text-white`}
							onClick={
								hasSearched ? handleSearchClear : handleSearch
							}>
							{hasSearched ? (
								<img src={x.toString()} />
							) : (
								<img src={searchIcon.toString()} />
							)}
						</button>
					</div>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42 justify-center'>
						<select
							className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={sortOption}
							onChange={(e) => setSortOption(e.target.value)}>
							<option value='' hidden>
								Ordenar
							</option>
							<option value='ASC'>Ascendente</option>
							<option value='DESC'>Descendente</option>
						</select>
						<select
							className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={
								filters.stock !== undefined
									? filters.stock?.toString()
									: filters.isActive !== undefined
									? filters.isActive?.toString()
									: ''
							}
							onChange={(e) => handleFilterChange(e)}>
							<option value='' hidden>
								Filtrar
							</option>
							<option value='inStock'>Con Stock</option>
							<option value='outOfStock'>Sin Stock</option>
							<option value='active'>Activo</option>
							<option value='inactive'>Inactivo</option>
						</select>
						{(sortOption ||
							filters.stock != undefined ||
							filters.isActive != undefined) && (
							<button
								className='p-2 bg-red-500 text-white rounded-md'
								onClick={handleReset}>
								Deshacer
							</button>
						)}
					</div>
				</div>
				<div className='flex flex-col justify-center'>
					<div className='flex-grow overflow-y-auto mt-8 md:mt-16 max-h-[calc(100vh-320px)]'>
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
								{adminProductsData.products.length ? (
									adminProductsData.products.map(
										(
											e: IProductData,
											productIndex: number
										) => (
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
															checked={
																!e.isActive
															}
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
															handleUpdateModal(
																e._id
															)
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
						</table>
					</div>
					<Pagination
						currentPage={currentPage}
						totalItems={adminProductsData.totalCount}
						itemsPerPage={10}
						onPageChange={handlePageChange}
					/>
				</div>
				{updateModalOpen && (
					<DashboardUpdateProductModal
						productId={productId}
						closeModal={() => setUpdateModalOpen(false)}
						refetch={() => refetchAdminProducts()}
					/>
				)}
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardProducts;
