import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchSalesQuery } from '../../../redux/slices/sales.slice';

const methodLabels: Record<string, string> = {
	cash: 'Efectivo',
	debit: 'Débito',
	credit: 'Crédito',
	transfer: 'Transferencia',
};

const SalesList = () => {
	const navigate = useNavigate();
	const { data: sales, isLoading, isError, refetch } = useFetchSalesQuery();
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const formatCurrency = (n: number) =>
		new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);

	const formatDate = (dateStr: string) =>
		new Intl.DateTimeFormat('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(new Date(dateStr));

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-dymAntiPop/50">
				Cargando ventas...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-3">
				<p className="text-red-400">Error al cargar las ventas.</p>
				<button
					onClick={refetch}
					className="px-4 py-2 bg-dymOrange text-white rounded-lg text-sm hover:bg-dymOrange/80 transition-colors"
				>
					Reintentar
				</button>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-xl font-bold text-white">Ventas en local</h1>
					<p className="text-dymAntiPop/50 text-sm mt-0.5">
						{sales?.length ?? 0} {sales?.length === 1 ? 'venta registrada' : 'ventas registradas'}
					</p>
				</div>
				<button
					onClick={() => navigate('/dashboard/sales/new')}
					className="flex items-center gap-2 px-4 py-2 bg-dymOrange text-white rounded-lg text-sm font-semibold hover:bg-dymOrange/80 transition-colors"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
						<path d="M12 5v14M5 12h14" />
					</svg>
					Nueva venta
				</button>
			</div>

			{!sales || sales.length === 0 ? (
				<div className="flex flex-col items-center justify-center h-64 gap-3">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dymAntiPop/20">
						<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
					</svg>
					<p className="text-dymAntiPop/40 text-sm">No hay ventas registradas aún.</p>
					<button
						onClick={() => navigate('/dashboard/sales/new')}
						className="px-4 py-2 bg-dymOrange text-white rounded-lg text-sm font-semibold hover:bg-dymOrange/80 transition-colors"
					>
						Registrar primera venta
					</button>
				</div>
			) : (
				<div className="space-y-3">
					{sales.map((sale: any) => (
						<div
							key={sale._id}
							className="bg-[#1E1A21] border border-white/[0.07] rounded-xl overflow-hidden"
						>
							<button
								className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
								onClick={() => setExpandedId(expandedId === sale._id ? null : sale._id)}
							>
								<div className="flex items-center gap-4 text-left">
									<div className="w-10 h-10 rounded-full bg-dymOrange/10 flex items-center justify-center text-dymOrange font-bold text-sm shrink-0">
										#{sale.orderNumber}
									</div>
									<div>
										<p className="text-white text-sm font-semibold">
											{sale.customerId?.name ?? 'Cliente desconocido'}
										</p>
										<p className="text-dymAntiPop/40 text-xs">
											{sale.customerId?.email}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-6 text-right">
									<div className="hidden sm:block">
										<p className="text-dymAntiPop/40 text-xs">Fecha</p>
										<p className="text-white text-sm">{formatDate(sale.createdAt)}</p>
									</div>
									<div className="hidden md:block">
										<p className="text-dymAntiPop/40 text-xs">Vendedor</p>
										<p className="text-white text-sm">{sale.sellerId?.name ?? '-'}</p>
									</div>
									<div>
										<p className="text-dymAntiPop/40 text-xs">Total</p>
										<p className="text-dymOrange font-bold text-base">{formatCurrency(sale.total)}</p>
									</div>
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										className={`text-dymAntiPop/40 transition-transform duration-200 shrink-0 ${expandedId === sale._id ? 'rotate-180' : ''}`}
									>
										<path d="M6 9l6 6 6-6" />
									</svg>
								</div>
							</button>

							{expandedId === sale._id && (
								<div className="border-t border-white/[0.07] px-5 py-4 space-y-4">
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
										<div>
											<p className="text-dymAntiPop/40 text-xs mb-1">Subtotal</p>
											<p className="text-white">{formatCurrency(sale.subtotal)}</p>
										</div>
										{sale.discountAmount > 0 && (
											<div>
												<p className="text-dymAntiPop/40 text-xs mb-1">Descuento</p>
												<p className="text-red-400">- {formatCurrency(sale.discountAmount)}</p>
											</div>
										)}
										<div>
											<p className="text-dymAntiPop/40 text-xs mb-1">Total final</p>
											<p className="text-dymOrange font-bold">{formatCurrency(sale.total)}</p>
										</div>
									</div>

									<div>
										<p className="text-dymAntiPop/40 text-xs mb-2">Método de pago</p>
										<div className="flex flex-wrap gap-2">
											{sale.paymentMethods?.map((pm: any, i: number) => (
												<span
													key={i}
													className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] rounded-full text-xs text-white"
												>
													{methodLabels[pm.method] ?? pm.method}
													<span className="text-dymOrange font-semibold">{formatCurrency(pm.amount)}</span>
												</span>
											))}
										</div>
									</div>

									<div>
										<p className="text-dymAntiPop/40 text-xs mb-2">Productos</p>
										<div className="space-y-1">
											{sale.items?.map((item: any, i: number) => (
												<div key={i} className="flex justify-between items-center text-sm py-1 border-b border-white/[0.04] last:border-0">
													<div>
														<span className="text-white">{item.name}</span>
														<span className="text-dymAntiPop/40 ml-2 text-xs">
															{item.color} / {item.size} — SKU: {item.sku}
														</span>
													</div>
													<div className="text-right shrink-0 ml-4">
														<span className="text-dymAntiPop/60 text-xs">{item.quantity} × {formatCurrency(item.price)}</span>
														<span className="text-white font-medium ml-3">{formatCurrency(item.price * item.quantity)}</span>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SalesList;
