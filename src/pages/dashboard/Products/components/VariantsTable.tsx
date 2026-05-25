import { useEffect, useMemo, useState } from 'react';
import {
	useFetchVariantsByProductQuery,
	useCreateVariantMutation,
	useUpdateVariantMutation,
	useDeleteVariantMutation,
	useSuggestSkuMutation,
} from '../../../../redux/slices/variant.slice';
import {
	useFetchSizeQuery,
	useFetchColorsQuery,
} from '../../../../redux/slices/catalogs.silce';
import Loader from '../../../../components/loader';
import { useMessage } from '../../../../hooks/alertMessage';
import { useConfirmModal } from '../../../../components/confirm-modal/ConfirmModalContext';
import xIcon from '../../../../assets/SVG/x.svg';
import MovementsHistoryModal from './MovementsHistoryModal';
import { IVariant } from '../../../../models/variant/variant.model';

interface IProps {
	productId: string;
}

interface IRow {
	_id?: string;
	sku: string;
	sizeId: string;
	colorId: string;
	quantity: number;
	minStock: number;
	dirty: boolean;
	isNew: boolean;
}

const idOf = (ref: any): string =>
	typeof ref === 'string' ? ref : ref?._id ?? '';

const VariantsTable: React.FC<IProps> = ({ productId }) => {
	const { data, isLoading, refetch } = useFetchVariantsByProductQuery(productId, {
		skip: !productId,
	});
	const { data: sizeData } = useFetchSizeQuery('');
	const { data: colorData } = useFetchColorsQuery('');
	const [createVariant] = useCreateVariantMutation();
	const [updateVariant] = useUpdateVariantMutation();
	const [deleteVariant] = useDeleteVariantMutation();
	const [suggestSku] = useSuggestSkuMutation();
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();
	const [rows, setRows] = useState<IRow[]>([]);
	const [historyFor, setHistoryFor] = useState<{ id: string; sku: string } | null>(null);
	const [savingId, setSavingId] = useState<string | null>(null);

	useEffect(() => {
		if (!data) return;
		setRows(
			data.variants.map((v: IVariant) => ({
				_id: v._id,
				sku: v.sku,
				sizeId: idOf(v.size),
				colorId: idOf(v.color),
				quantity: v.quantity,
				minStock: v.minStock,
				dirty: false,
				isNew: false,
			})),
		);
	}, [data]);

	const sizesById = useMemo(() => {
		const map: Record<string, string> = {};
		sizeData?.forEach((s: any) => (map[s._id] = s.name));
		return map;
	}, [sizeData]);

	const colorsById = useMemo(() => {
		const map: Record<string, { name: string; hex: string }> = {};
		colorData?.forEach((c: any) => (map[c._id] = { name: c.name, hex: c.hex }));
		return map;
	}, [colorData]);

	const updateRow = (idx: number, patch: Partial<IRow>) => {
		setRows((prev) => {
			const next = [...prev];
			next[idx] = { ...next[idx], ...patch, dirty: true };
			return next;
		});
	};

	const handleAddRow = () => {
		setRows((prev) => [
			...prev,
			{
				sku: '',
				sizeId: '',
				colorId: '',
				quantity: 0,
				minStock: 0,
				dirty: true,
				isNew: true,
			},
		]);
	};

	const handleSuggestSku = async (idx: number) => {
		const row = rows[idx];
		if (!row.sizeId || !row.colorId) {
			showMessage('error', 'Elegí talle y color antes de generar el SKU', 3000);
			return;
		}
		try {
			const res = await suggestSku({
				productId,
				size: row.sizeId,
				color: row.colorId,
			}).unwrap();
			updateRow(idx, { sku: res.sku });
		} catch (e: any) {
			showMessage('error', 'No se pudo generar el SKU', 3000);
		}
	};

	const handleSaveRow = async (idx: number) => {
		const row = rows[idx];
		if (!row.sizeId || !row.colorId) {
			showMessage('error', 'Talle y color son obligatorios', 3000);
			return;
		}
		setSavingId(row._id ?? `new-${idx}`);
		try {
			if (row.isNew) {
				await createVariant({
					productId,
					size: row.sizeId,
					color: row.colorId,
					quantity: row.quantity,
					minStock: row.minStock,
					sku: row.sku || undefined,
				}).unwrap();
				showMessage('success', 'Variante creada', 2500);
			} else if (row._id) {
				await updateVariant({
					id: row._id,
					productId,
					data: {
						sku: row.sku,
						quantity: row.quantity,
						minStock: row.minStock,
					},
				}).unwrap();
				showMessage('success', 'Variante actualizada', 2500);
			}
			await refetch();
		} catch (e: any) {
			const msg = e?.data?.message || 'Error al guardar la variante';
			showMessage('error', msg, 3000);
		} finally {
			setSavingId(null);
		}
	};

	const handleDeleteRow = (idx: number) => {
		const row = rows[idx];
		if (row.isNew) {
			setRows((prev) => prev.filter((_, i) => i !== idx));
			return;
		}
		if (!row._id) return;
		showConfirmModal({
			message: `¿Eliminar la variante ${row.sku}?`,
			onAccept: async () => {
				try {
					await deleteVariant({ id: row._id!, productId }).unwrap();
					await refetch();
					showMessage('success', 'Variante eliminada', 2500);
				} catch (e: any) {
					showMessage('error', 'Error al eliminar la variante', 3000);
				}
			},
		});
	};

	if (isLoading) return <Loader />;

	return (
		<div className='w-full'>
			<div className='flex justify-between items-center mb-2'>
				<h3 className='text-dymAntiPop font-semibold'>Variantes</h3>
				<button
					type='button'
					onClick={handleAddRow}
					className='text-sm border border-dymOrange rounded px-3 py-1 hover:bg-dymOrange-dark'>
					+ Agregar variante
				</button>
			</div>
			<div className='overflow-x-auto'>
				<table className='w-full text-sm text-dymAntiPop'>
					<thead>
						<tr className='border-b border-gray-600'>
							<th className='text-left py-2 px-2'>SKU</th>
							<th className='text-left py-2 px-2'>Talle</th>
							<th className='text-left py-2 px-2'>Color</th>
							<th className='text-right py-2 px-2'>Stock</th>
							<th className='text-right py-2 px-2'>Min</th>
							<th className='text-center py-2 px-2'>Acciones</th>
						</tr>
					</thead>
					<tbody>
						{rows.length === 0 && (
							<tr>
								<td colSpan={6} className='text-center py-4'>
									Sin variantes. Agregá una para empezar.
								</td>
							</tr>
						)}
						{rows.map((row, idx) => {
							const isLow = row.quantity <= row.minStock;
							const rowKey = row._id ?? `new-${idx}`;
							return (
								<tr
									key={rowKey}
									className={`border-b border-gray-700 ${
										isLow && !row.isNew ? 'bg-red-900 bg-opacity-20' : ''
									}`}>
									<td className='py-2 px-2'>
										<div className='flex items-center gap-1'>
											<input
												className='rounded p-1 w-32 bg-dymBlack border border-gray-600'
												value={row.sku}
												placeholder='Automático'
												onChange={(e) =>
													updateRow(idx, {
														sku: e.target.value.toUpperCase(),
													})
												}
											/>
											<button
												type='button'
												title='Generar SKU sugerido'
												onClick={() => handleSuggestSku(idx)}
												className='text-xs px-2 py-1 border border-dymOrange rounded hover:bg-dymOrange-dark'>
												↻
											</button>
										</div>
									</td>
									<td className='py-2 px-2'>
										{row.isNew ? (
											<select
												className='rounded p-1 bg-dymBlack border border-gray-600'
												value={row.sizeId}
												onChange={(e) =>
													updateRow(idx, { sizeId: e.target.value })
												}>
												<option value='' hidden>
													Talle
												</option>
												{sizeData?.map((s: any) => (
													<option key={s._id} value={s._id}>
														{s.name}
													</option>
												))}
											</select>
										) : (
											<span>{sizesById[row.sizeId] ?? '-'}</span>
										)}
									</td>
									<td className='py-2 px-2'>
										{row.isNew ? (
											<select
												className='rounded p-1 bg-dymBlack border border-gray-600'
												value={row.colorId}
												onChange={(e) =>
													updateRow(idx, { colorId: e.target.value })
												}>
												<option value='' hidden>
													Color
												</option>
												{colorData?.map((c: any) => (
													<option key={c._id} value={c._id}>
														{c.name}
													</option>
												))}
											</select>
										) : (
											<span className='inline-flex items-center gap-2'>
												<span
													className='inline-block w-4 h-4 rounded-full border'
													style={{
														backgroundColor: colorsById[row.colorId]?.hex,
													}}
												/>
												{colorsById[row.colorId]?.name ?? '-'}
											</span>
										)}
									</td>
									<td className='py-2 px-2 text-right'>
										<input
											type='number'
											min={0}
											className='rounded p-1 w-20 text-right bg-dymBlack border border-gray-600'
											value={row.quantity}
											onChange={(e) =>
												updateRow(idx, {
													quantity: Number(e.target.value) || 0,
												})
											}
										/>
									</td>
									<td className='py-2 px-2 text-right'>
										<input
											type='number'
											min={0}
											className='rounded p-1 w-20 text-right bg-dymBlack border border-gray-600'
											value={row.minStock}
											onChange={(e) =>
												updateRow(idx, {
													minStock: Number(e.target.value) || 0,
												})
											}
										/>
									</td>
									<td className='py-2 px-2 text-center'>
										<div className='flex justify-center items-center gap-2'>
											<button
												type='button'
												disabled={!row.dirty || savingId === rowKey}
												onClick={() => handleSaveRow(idx)}
												className={`text-xs px-2 py-1 rounded ${
													row.dirty
														? 'bg-dymOrange'
														: 'border border-gray-700 opacity-50'
												}`}>
												Guardar
											</button>
											{!row.isNew && row._id && (
												<button
													type='button'
													onClick={() =>
														setHistoryFor({ id: row._id!, sku: row.sku })
													}
													className='text-xs px-2 py-1 border border-dymOrange rounded'>
													Historial
												</button>
											)}
											<button
												type='button'
												onClick={() => handleDeleteRow(idx)}
												className='p-1 hover:bg-dymOrange-dark rounded'>
												<img src={xIcon.toString()} className='w-3 h-3' />
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{historyFor && (
				<MovementsHistoryModal
					variantId={historyFor.id}
					sku={historyFor.sku}
					onClose={() => setHistoryFor(null)}
				/>
			)}
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default VariantsTable;
