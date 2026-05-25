import { useState } from 'react';
import {
	useUpdateProductMutation,
	useFetchAdminProductsQuery,
} from '../../../redux/slices/admin.slice';
import { useLazyFetchVariantBySkuQuery } from '../../../redux/slices/variant.slice';
import DashboardUpdateProductModal from './DashboardUpdateProductModal';
import ProductVariantsInline from './components/ProductVariantsInline';
import ImportProductsModal from './ImportProductsModal';
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
	const [importModalOpen, setImportModalOpen] = useState(false);
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
	const [findVariantBySku] = useLazyFetchVariantBySkuQuery();
	const [skuInput, setSkuInput] = useState('');
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const toggleExpand = (id: string) => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

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

	const handleSkuSearch = async () => {
		const sku = skuInput.trim();
		if (!sku) return;
		try {
			const variant = await findVariantBySku(sku).unwrap();
			const productId =
				typeof variant.productId === 'string'
					? variant.productId
					: variant.productId?._id;
			if (!productId) {
				showMessage('error', 'No se encontró el producto de esa variante', 3000);
				return;
			}
			handleUpdateModal(productId);
		} catch (error: any) {
			showMessage('error', `SKU no encontrado: ${sku}`, 3000);
		}
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
		<div className='flex flex-col flex-1'>
			<div className='flex flex-col bg-dymBlack flex-grow p-4 lg:p-6'>
				{/* Header */}
				<div className='mb-6'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-2xl font-bold text-dymAntiPop'>Productos</h1>
							<p className='text-sm text-dymAntiPop/50 mt-1'>Gestiona el catálogo de productos</p>
						</div>
						<button
							className='sm:w-auto w-full px-4 py-2.5 bg-dymOrange hover:bg-dymOrange/90 active:bg-dymOrange/95 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2'
							onClick={() => setImportModalOpen(true)}>
							<span>📥</span>
							<span>Importar Excel</span>
						</button>
					</div>

					{/* Search and Filters */}
					<div className='space-y-4'>
						{/* Búsquedas */}
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{/* Buscar por SKU */}
							<div className='flex gap-2'>
								<input
									className='flex-1 px-4 py-2.5 bg-[#252030] border border-white/10 rounded-lg text-dymAntiPop placeholder:text-dymAntiPop/40 focus:outline-none focus:border-dymOrange/50 focus:ring-1 focus:ring-dymOrange/20 transition-all font-mono text-sm'
									placeholder='Buscar por SKU'
									value={skuInput}
									onChange={(e) => setSkuInput(e.target.value.toUpperCase())}
									onKeyPress={(e) => {
										if (e.key === 'Enter') handleSkuSearch();
									}}
								/>
								<button
									className='px-4 py-2.5 bg-dymOrange hover:bg-dymOrange/90 active:bg-dymOrange/95 text-white font-medium rounded-lg transition-all duration-200'
									onClick={handleSkuSearch}>
									SKU
								</button>
							</div>

							{/* Buscar por Nombre */}
							<div className='flex gap-2'>
								<input
									className='flex-1 px-4 py-2.5 bg-[#252030] border border-white/10 rounded-lg text-dymAntiPop placeholder:text-dymAntiPop/40 focus:outline-none focus:border-dymOrange/50 focus:ring-1 focus:ring-dymOrange/20 transition-all text-sm'
									placeholder='Buscar producto por nombre'
									value={inputValue}
									onChange={handleInputChange}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											handleSearch();
										}
									}}
								/>
								<button
									className={`px-4 py-2.5 font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${
										hasSearched
											? 'bg-white/10 hover:bg-white/15 text-dymAntiPop border border-white/20'
											: 'bg-dymOrange hover:bg-dymOrange/90 active:bg-dymOrange/95 text-white'
									}`}
									onClick={
										hasSearched ? handleSearchClear : handleSearch
									}>
									{hasSearched ? (
										<img src={x.toString()} alt='Limpiar' className='w-4 h-4' />
									) : (
										<img src={searchIcon.toString()} alt='Buscar' className='w-4 h-4' />
									)}
								</button>
							</div>
						</div>

						{/* Filtros y Ordenamiento */}
						<div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center'>
							<select
								className='flex-1 sm:flex-none px-4 py-2.5 bg-[#252030] border border-white/10 rounded-lg text-dymAntiPop focus:outline-none focus:border-dymOrange/50 focus:ring-1 focus:ring-dymOrange/20 transition-all text-sm'
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value)}>
								<option value='' hidden>
									Ordenar
								</option>
								<option value='ASC'>Ascendente</option>
								<option value='DESC'>Descendente</option>
							</select>

							<select
								className='flex-1 sm:flex-none px-4 py-2.5 bg-[#252030] border border-white/10 rounded-lg text-dymAntiPop focus:outline-none focus:border-dymOrange/50 focus:ring-1 focus:ring-dymOrange/20 transition-all text-sm'
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
									className='w-full sm:w-auto px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium rounded-lg transition-all duration-200'
									onClick={handleReset}>
									Limpiar filtros
								</button>
							)}
						</div>
					</div>
				</div>
				{/* Tabla */}
				<div className='flex flex-col flex-1 bg-[#1E1A21]/50 rounded-xl border border-white/5 overflow-hidden'>
					<div className='flex-grow overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='bg-[#1E1A21] border-b border-white/10'>
									<th className='w-8 py-3 px-4' />
									<th className='w-28 text-start py-3 px-4'>
										<span className='text-xs font-semibold text-dymAntiPop/70 uppercase tracking-wider'>Precio</span>
									</th>
									<th className='w-40 text-start py-3 px-4'>
										<span className='text-xs font-semibold text-dymAntiPop/70 uppercase tracking-wider'>Producto</span>
									</th>
									<th className='w-28 text-start py-3 px-4'>
										<span className='text-xs font-semibold text-dymAntiPop/70 uppercase tracking-wider'>Stock</span>
									</th>
									<th className='w-24 text-start py-3 px-4'>
										<span className='text-xs font-semibold text-dymAntiPop/70 uppercase tracking-wider'>Estado</span>
									</th>
									<th className='w-24 text-start py-3 px-4'>
										<span className='text-xs font-semibold text-dymAntiPop/70 uppercase tracking-wider'>Acciones</span>
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-white/5'>
								{adminProductsData.products.length ? (
									adminProductsData.products.map(
										(
											e: IProductData,
											productIndex: number
										) => (
											<>
												<tr
													className='hover:bg-white/[0.02] transition-colors duration-150 group text-dymAntiPop'
													key={productIndex}>
													<td className='py-3 px-4'>
														<button
															onClick={() => toggleExpand(e._id)}
															className='flex items-center justify-center w-7 h-7 rounded-md text-dymAntiPop/50 hover:text-dymOrange hover:bg-white/10 group-hover:text-dymAntiPop transition-all duration-200'
															title={expandedId === e._id ? 'Ocultar variantes' : 'Ver variantes / SKU'}
														>
															<svg
																width='16'
																height='16'
																viewBox='0 0 24 24'
																fill='none'
																stroke='currentColor'
																strokeWidth='2.5'
																strokeLinecap='round'
																strokeLinejoin='round'
																className={`transition-transform duration-300 ${expandedId === e._id ? 'rotate-90' : ''}`}
															>
																<path d='M9 18l6-6-6-6' />
															</svg>
														</button>
													</td>
													<td className='py-3 px-4'>
														<span className='font-semibold text-dymOrange'>${e.price.toLocaleString()}</span>
													</td>
													<td className='py-3 px-4'>
														<div className='flex flex-col'>
															<span className='font-medium text-dymAntiPop max-w-xs truncate'>
																{e.name.charAt(0).toUpperCase() + e.name.slice(1)}
															</span>
														</div>
													</td>
													<td className='py-3 px-4'>
														<div className='flex items-center gap-2'>
															{(e.totalStock ?? 0) > 0 ? (
																<>
																	<div className='w-2 h-2 rounded-full bg-green-500' />
																	<span className='text-sm font-medium text-green-400'>
																		{e.totalStock} u.
																	</span>
																</>
															) : (
																<>
																	<div className='w-2 h-2 rounded-full bg-red-500' />
																	<span className='text-sm font-medium text-red-400'>
																		Sin stock
																	</span>
																</>
															)}
														</div>
													</td>
													<td className='py-3 px-4'>
														<label className='inline-flex items-center cursor-pointer group/toggle'>
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
															<div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${e.isActive ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'} peer`}>
																<div className={`absolute top-1 start-1 w-4 h-4 rounded-full transition-all duration-200 ${e.isActive ? 'bg-green-500' : 'bg-red-500'} ${!e.isActive ? 'translate-x-5' : ''}`}></div>
															</div>
														</label>
													</td>
													<td className='py-3 px-4'>
														<button
															className='px-3 py-1.5 text-sm font-medium text-dymOrange hover:text-white hover:bg-dymOrange/20 rounded-md transition-all duration-200 active:scale-95'
															onClick={() =>
																handleUpdateModal(
																	e._id
																)
															}>
															Editar
														</button>
													</td>
												</tr>
												{expandedId === e._id && (
													<ProductVariantsInline productId={e._id} />
												)}
											</>
										)
									)
								) : (
									<tr>
										<td colSpan={6} className='py-12 px-4 text-center'>
											<div className='flex flex-col items-center justify-center'>
												<div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3'>
													<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='text-dymAntiPop/40'>
														<circle cx='11' cy='11' r='8' />
														<path d='m21 21-4.35-4.35' />
													</svg>
												</div>
												<p className='text-dymAntiPop/50 font-medium mb-1'>No hay productos</p>
												<p className='text-dymAntiPop/30 text-sm'>Comienza importando productos o crear uno nuevo</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className='border-t border-white/5 bg-[#1E1A21] px-4 py-4'>
						<Pagination
							currentPage={currentPage}
							totalItems={adminProductsData.totalCount}
							itemsPerPage={10}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
				{updateModalOpen && (
					<DashboardUpdateProductModal
						productId={productId}
						closeModal={() => setUpdateModalOpen(false)}
						refetch={() => refetchAdminProducts()}
					/>
				)}
				{importModalOpen && (
					<ImportProductsModal
						closeModal={() => setImportModalOpen(false)}
						refetch={() => refetchAdminProducts()}
					/>
				)}
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardProducts;
