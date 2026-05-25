import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useSearchProductsQuery,
	useSearchUsersQuery,
	useCreateSaleMutation,
	useCreateCustomerMutation,
} from '../../../redux/slices/sales.slice';

type CartItem = {
	variantId: string;
	productId: string;
	name: string;
	sku: string;
	color: string;
	size: string;
	price: number;
	stock: number;
	quantity: number;
	image: string | null;
};

type PaymentEntry = {
	method: 'cash' | 'debit' | 'credit' | 'transfer';
	amount: string;
};

type Customer = { _id: string; name: string; email: string; phone?: string };

const METHOD_LABELS: Record<string, string> = {
	cash: 'Efectivo',
	debit: 'Débito',
	credit: 'Crédito',
	transfer: 'Transferencia / QR',
};

const METHODS = ['cash', 'debit', 'credit', 'transfer'] as const;

const formatCurrency = (n: number) =>
	new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n);

export default function NewSale() {
	const navigate = useNavigate();
	const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
	const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();

	// --- Product search ---
	const [productQuery, setProductQuery] = useState('');
	const [debouncedProduct, setDebouncedProduct] = useState('');
	const { data: productResults } = useSearchProductsQuery(debouncedProduct, {
		skip: debouncedProduct.length < 2,
	});

	// --- Cart ---
	const [cart, setCart] = useState<CartItem[]>([]);

	// --- Customer ---
	const [customerQuery, setCustomerQuery] = useState('');
	const [debouncedCustomer, setDebouncedCustomer] = useState('');
	const { data: userResults } = useSearchUsersQuery(debouncedCustomer, {
		skip: debouncedCustomer.length < 2,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
	const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

	// --- Discount ---
	const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
	const [discountValue, setDiscountValue] = useState('');

	// --- Payment ---
	const [payments, setPayments] = useState<PaymentEntry[]>([
		{ method: 'cash', amount: '' },
	]);

	// --- Error / success ---
	const [error, setError] = useState('');

	// Debounce helper
	const debounce = (fn: (v: string) => void, delay: number) => {
		let timer: ReturnType<typeof setTimeout>;
		return (v: string) => {
			clearTimeout(timer);
			timer = setTimeout(() => fn(v), delay);
		};
	};
	const debouncedSetProduct = useCallback(debounce(setDebouncedProduct, 350), []);
	const debouncedSetCustomer = useCallback(debounce(setDebouncedCustomer, 350), []);

	// --- Cart logic ---
	const addToCart = (product: any) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.variantId === product.variantId);
			if (existing) {
				if (existing.quantity >= product.stock) return prev;
				return prev.map((i) =>
					i.variantId === product.variantId ? { ...i, quantity: i.quantity + 1 } : i
				);
			}
			return [
				...prev,
				{
					variantId: product.variantId,
					productId: product.productId,
					name: product.name,
					sku: product.sku,
					color: product.color,
					size: product.size,
					price: product.price,
					stock: product.stock,
					quantity: 1,
					image: product.image,
				},
			];
		});
		setProductQuery('');
		setDebouncedProduct('');
	};

	const updateQty = (variantId: string, qty: number) => {
		if (qty <= 0) {
			setCart((prev) => prev.filter((i) => i.variantId !== variantId));
		} else {
			setCart((prev) =>
				prev.map((i) =>
					i.variantId === variantId
						? { ...i, quantity: Math.min(qty, i.stock) }
						: i
				)
			);
		}
	};

	// --- Calculations ---
	const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
	const discountNum = parseFloat(discountValue) || 0;
	const discountAmount =
		discountValue && discountNum > 0
			? discountType === 'percentage'
				? Math.round((subtotal * discountNum) / 100 * 100) / 100
				: Math.min(discountNum, subtotal)
			: 0;
	const total = Math.max(0, subtotal - discountAmount);

	const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
	const remaining = total - totalPaid;

	// --- Payment management ---
	const addPayment = () => {
		setPayments((prev) => [...prev, { method: 'cash', amount: '' }]);
	};
	const removePayment = (idx: number) => {
		setPayments((prev) => prev.filter((_, i) => i !== idx));
	};
	const updatePayment = (idx: number, field: keyof PaymentEntry, value: string) => {
		setPayments((prev) =>
			prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
		);
	};

	// --- Create customer ---
	const handleCreateCustomer = async () => {
		if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
			setError('Completá todos los campos del cliente.');
			return;
		}
		try {
			const result = await createCustomer(newCustomer).unwrap();
			setSelectedCustomer(result);
			setShowNewCustomerForm(false);
			setCustomerQuery('');
			setNewCustomer({ name: '', email: '', phone: '' });
			setError('');
		} catch (e: any) {
			setError(e?.data?.message ?? 'Error al crear el cliente.');
		}
	};

	// --- Submit ---
	const handleSubmit = async () => {
		setError('');
		if (cart.length === 0) { setError('Agregá al menos un producto.'); return; }
		if (!selectedCustomer) { setError('Seleccioná un cliente.'); return; }
		const validPayments = payments.filter((p) => parseFloat(p.amount) > 0);
		if (validPayments.length === 0) { setError('Ingresá al menos un método de pago.'); return; }
		if (Math.abs(remaining) > 0.5) {
			setError(`El monto pagado (${formatCurrency(totalPaid)}) no coincide con el total (${formatCurrency(total)}).`);
			return;
		}

		const body: any = {
			customerId: selectedCustomer._id,
			items: cart.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
			paymentMethods: validPayments.map((p) => ({
				method: p.method,
				amount: parseFloat(p.amount),
			})),
		};

		if (discountNum > 0) {
			body.discount = { type: discountType, value: discountNum };
		}

		try {
			await createSale(body).unwrap();
			navigate('/dashboard/sales');
		} catch (e: any) {
			setError(e?.data?.message ?? 'Error al registrar la venta.');
		}
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="flex items-center gap-3 mb-6">
				<button
					onClick={() => navigate('/dashboard/sales')}
					className="text-dymAntiPop/40 hover:text-dymAntiPop transition-colors"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M15 18l-6-6 6-6" />
					</svg>
				</button>
				<h1 className="text-xl font-bold text-white">Nueva venta en local</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* LEFT: Product search + cart */}
				<div className="lg:col-span-2 space-y-5">
					{/* Product search */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5">
						<h2 className="text-sm font-semibold text-dymAntiPop/70 uppercase tracking-wider mb-3">
							Buscar producto
						</h2>
						<div className="relative">
							<input
								type="text"
								placeholder="Nombre del producto..."
								value={productQuery}
								onChange={(e) => {
									setProductQuery(e.target.value);
									debouncedSetProduct(e.target.value);
								}}
								className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
							/>
							{productResults && productResults.length > 0 && productQuery.length >= 2 && (
								<div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1E1A21] border border-white/[0.1] rounded-xl shadow-2xl max-h-72 overflow-y-auto">
									{productResults.map((p: any) => (
										<button
											key={p.variantId}
											onClick={() => addToCart(p)}
											className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0"
										>
											{p.image && (
												<img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
											)}
											<div className="flex-1 min-w-0">
												<p className="text-white text-sm font-medium truncate">{p.name}</p>
												<p className="text-dymAntiPop/40 text-xs">{p.color} / {p.size} — SKU: {p.sku}</p>
											</div>
											<div className="text-right shrink-0">
												<p className="text-dymOrange font-semibold text-sm">{formatCurrency(p.price)}</p>
												<p className="text-dymAntiPop/40 text-xs">{p.stock} en stock</p>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Cart */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5">
						<h2 className="text-sm font-semibold text-dymAntiPop/70 uppercase tracking-wider mb-3">
							Productos en la venta
						</h2>
						{cart.length === 0 ? (
							<p className="text-dymAntiPop/30 text-sm text-center py-8">
								Buscá y seleccioná productos para agregarlos.
							</p>
						) : (
							<div className="space-y-2">
								{cart.map((item) => (
									<div
										key={item.variantId}
										className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0"
									>
										{item.image && (
											<img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
										)}
										<div className="flex-1 min-w-0">
											<p className="text-white text-sm font-medium truncate">{item.name}</p>
											<p className="text-dymAntiPop/40 text-xs">{item.color} / {item.size}</p>
										</div>
										<div className="flex items-center gap-2 shrink-0">
											<button
												onClick={() => updateQty(item.variantId, item.quantity - 1)}
												className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors text-sm"
											>−</button>
											<span className="text-white text-sm w-6 text-center">{item.quantity}</span>
											<button
												onClick={() => updateQty(item.variantId, item.quantity + 1)}
												disabled={item.quantity >= item.stock}
												className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors text-sm disabled:opacity-30"
											>+</button>
										</div>
										<p className="text-dymOrange font-semibold text-sm shrink-0 w-24 text-right">
											{formatCurrency(item.price * item.quantity)}
										</p>
										<button
											onClick={() => updateQty(item.variantId, 0)}
											className="text-dymAntiPop/30 hover:text-red-400 transition-colors ml-1"
										>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M18 6L6 18M6 6l12 12" />
											</svg>
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* RIGHT: Customer + discount + payment + total */}
				<div className="space-y-5">
					{/* Customer */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5">
						<h2 className="text-sm font-semibold text-dymAntiPop/70 uppercase tracking-wider mb-3">
							Cliente
						</h2>
						{selectedCustomer ? (
							<div className="flex items-start justify-between">
								<div>
									<p className="text-white text-sm font-semibold">{selectedCustomer.name}</p>
									<p className="text-dymAntiPop/40 text-xs">{selectedCustomer.email}</p>
									{selectedCustomer.phone && (
										<p className="text-dymAntiPop/40 text-xs">{selectedCustomer.phone}</p>
									)}
								</div>
								<button
									onClick={() => setSelectedCustomer(null)}
									className="text-dymAntiPop/30 hover:text-red-400 transition-colors text-xs"
								>
									Cambiar
								</button>
							</div>
						) : (
							<>
								{!showNewCustomerForm ? (
									<>
										<div className="relative mb-3">
											<input
												type="text"
												placeholder="Buscar por nombre o email..."
												value={customerQuery}
												onChange={(e) => {
													setCustomerQuery(e.target.value);
													debouncedSetCustomer(e.target.value);
												}}
												className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
											/>
											{userResults && userResults.length > 0 && customerQuery.length >= 2 && (
												<div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1E1A21] border border-white/[0.1] rounded-xl shadow-2xl max-h-48 overflow-y-auto">
													{userResults.map((u: any) => (
														<button
															key={u._id}
															onClick={() => {
																setSelectedCustomer(u);
																setCustomerQuery('');
																setDebouncedCustomer('');
															}}
															className="w-full text-left px-3 py-2.5 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0"
														>
															<p className="text-white text-sm">{u.name}</p>
															<p className="text-dymAntiPop/40 text-xs">{u.email}</p>
														</button>
													))}
												</div>
											)}
										</div>
										<button
											onClick={() => setShowNewCustomerForm(true)}
											className="text-dymOrange text-xs hover:underline"
										>
											+ Registrar nuevo cliente
										</button>
									</>
								) : (
									<div className="space-y-2">
										<input
											type="text"
											placeholder="Nombre completo"
											value={newCustomer.name}
											onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))}
											className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
										/>
										<input
											type="email"
											placeholder="Email"
											value={newCustomer.email}
											onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))}
											className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
										/>
										<input
											type="tel"
											placeholder="Teléfono"
											value={newCustomer.phone}
											onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))}
											className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
										/>
										<div className="flex gap-2 pt-1">
											<button
												onClick={handleCreateCustomer}
												disabled={isCreatingCustomer}
												className="flex-1 py-2 bg-dymOrange text-white rounded-lg text-sm font-semibold hover:bg-dymOrange/80 transition-colors disabled:opacity-50"
											>
												{isCreatingCustomer ? 'Guardando...' : 'Guardar cliente'}
											</button>
											<button
												onClick={() => setShowNewCustomerForm(false)}
												className="px-3 py-2 border border-white/10 text-dymAntiPop/60 rounded-lg text-sm hover:border-white/20 transition-colors"
											>
												Cancelar
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>

					{/* Discount */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5">
						<h2 className="text-sm font-semibold text-dymAntiPop/70 uppercase tracking-wider mb-3">
							Descuento
						</h2>
						<div className="flex gap-2 mb-3">
							<button
								onClick={() => setDiscountType('percentage')}
								className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${discountType === 'percentage' ? 'bg-dymOrange text-white' : 'bg-zinc-800 text-dymAntiPop/50 hover:bg-zinc-700'}`}
							>
								Porcentaje %
							</button>
							<button
								onClick={() => setDiscountType('fixed')}
								className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${discountType === 'fixed' ? 'bg-dymOrange text-white' : 'bg-zinc-800 text-dymAntiPop/50 hover:bg-zinc-700'}`}
							>
								Monto fijo $
							</button>
						</div>
						<input
							type="number"
							min="0"
							placeholder={discountType === 'percentage' ? 'Ej: 10 (= 10%)' : 'Ej: 500'}
							value={discountValue}
							onChange={(e) => setDiscountValue(e.target.value)}
							className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
						/>
						{discountAmount > 0 && (
							<p className="text-xs text-red-400 mt-1.5">− {formatCurrency(discountAmount)}</p>
						)}
					</div>

					{/* Payment methods */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5">
						<h2 className="text-sm font-semibold text-dymAntiPop/70 uppercase tracking-wider mb-3">
							Método de pago
						</h2>
						<div className="space-y-2">
							{payments.map((p, i) => (
								<div key={i} className="flex gap-2 items-center">
									<select
										value={p.method}
										onChange={(e) => updatePayment(i, 'method', e.target.value)}
										className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-dymOrange transition-colors"
									>
										{METHODS.map((m) => (
											<option key={m} value={m}>{METHOD_LABELS[m]}</option>
										))}
									</select>
									<input
										type="number"
										min="0"
										placeholder="Monto"
										value={p.amount}
										onChange={(e) => updatePayment(i, 'amount', e.target.value)}
										className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-dymOrange transition-colors"
									/>
									{payments.length > 1 && (
										<button
											onClick={() => removePayment(i)}
											className="text-dymAntiPop/30 hover:text-red-400 transition-colors"
										>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M18 6L6 18M6 6l12 12" />
											</svg>
										</button>
									)}
								</div>
							))}
						</div>
						<button
							onClick={addPayment}
							className="mt-2 text-dymOrange text-xs hover:underline"
						>
							+ Agregar método de pago
						</button>
					</div>

					{/* Totals + submit */}
					<div className="bg-[#1E1A21] border border-white/[0.07] rounded-xl p-5 space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-dymAntiPop/50">Subtotal</span>
							<span className="text-white">{formatCurrency(subtotal)}</span>
						</div>
						{discountAmount > 0 && (
							<div className="flex justify-between text-sm">
								<span className="text-dymAntiPop/50">Descuento</span>
								<span className="text-red-400">− {formatCurrency(discountAmount)}</span>
							</div>
						)}
						<div className="flex justify-between text-base font-bold border-t border-white/[0.07] pt-3">
							<span className="text-white">Total</span>
							<span className="text-dymOrange">{formatCurrency(total)}</span>
						</div>
						{totalPaid > 0 && (
							<div className={`flex justify-between text-sm ${Math.abs(remaining) < 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
								<span>{remaining > 0.5 ? 'Falta pagar' : remaining < -0.5 ? 'Excedente' : 'Pagado ✓'}</span>
								{Math.abs(remaining) >= 0.5 && <span>{formatCurrency(Math.abs(remaining))}</span>}
							</div>
						)}

						{error && (
							<p className="text-red-400 text-xs bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
						)}

						<button
							onClick={handleSubmit}
							disabled={isCreating || cart.length === 0}
							className="w-full py-3 bg-dymOrange text-white rounded-xl font-bold text-sm hover:bg-dymOrange/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{isCreating ? 'Registrando venta...' : 'Confirmar venta'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
