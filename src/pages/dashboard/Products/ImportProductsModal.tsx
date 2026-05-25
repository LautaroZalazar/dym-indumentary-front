import { useState } from 'react';
import { useMessage } from '../../../hooks/alertMessage';

type Phase = 'idle' | 'importing' | 'done';

interface ImportError {
	productName: string;
	sku?: string;
	reason: string;
}

interface ImportResult {
	productsCreated: number;
	productsAlreadyExisting: number;
	variantsCreated: number;
	errors: ImportError[];
}

interface ImportProductsModalProps {
	closeModal: () => void;
	refetch: () => void;
}

const ImportProductsModal: React.FC<ImportProductsModalProps> = ({ closeModal, refetch }) => {
	const [phase, setPhase] = useState<Phase>('idle');
	const [importResult, setImportResult] = useState<ImportResult | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [totalRows, setTotalRows] = useState(0);
	const { MessageComponent, showMessage } = useMessage();

	const getToken = () => {
		const stored = localStorage.getItem('user');
		return stored ? JSON.parse(stored).user?.token : null;
	};

	const generateTemplate = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACK_URL}/v1/admin/product/template`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			if (!response.ok) throw new Error('Error al descargar la plantilla');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'plantilla-productos.xlsx';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			showMessage('success', 'Plantilla descargada correctamente', 2000);
		} catch (error: any) {
			showMessage('error', error.message || 'Error al descargar la plantilla', 3000);
		}
	};

	const handleFileSelect = (file: File) => {
		if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
			showMessage('error', 'El archivo debe ser .xlsx o .xls', 3000);
			return;
		}
		setSelectedFile(file);
	};

	const handleImport = async () => {
		if (!selectedFile) return;

		setPhase('importing');

		const formData = new FormData();
		formData.append('file', selectedFile);

		try {
			const response = await fetch(`${import.meta.env.VITE_BACK_URL}/v1/admin/product/import`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${getToken()}` },
				body: formData,
			});

			if (!response.ok) {
				const err = await response.json().catch(() => ({}));
				throw new Error(err.message || `Error ${response.status}`);
			}

			const result: ImportResult = await response.json();
			setTotalRows(result.productsCreated + result.productsAlreadyExisting + result.errors.length);
			setImportResult(result);
			setPhase('done');
			refetch();
		} catch (error: any) {
			showMessage('error', error.message || 'Error al importar', 4000);
			setPhase('idle');
		}
	};

	const handleClose = () => {
		if (phase !== 'importing') closeModal();
	};

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
			<div
				className={`bg-[#1E1A21] rounded-xl border border-white/[0.07] w-full ${
					phase === 'done' ? 'max-w-3xl' : 'max-w-2xl'
				} max-h-[90vh] flex flex-col`}
			>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-white/[0.07]'>
					<h2 className='text-lg font-semibold text-dymAntiPop'>Importar productos desde Excel</h2>
					<button
						onClick={handleClose}
						disabled={phase === 'importing'}
						className='text-dymAntiPop/40 hover:text-dymAntiPop disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						✕
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-6'>
					{phase === 'idle' && (
						<div className='space-y-6'>
							<div>
								<h3 className='text-sm font-medium text-dymAntiPop mb-3'>1. Descargar plantilla</h3>
								<button
									onClick={generateTemplate}
									className='w-full py-3 px-4 bg-dymOrange hover:bg-dymOrange/90 text-white font-medium rounded-lg transition-colors'
								>
									📥 Descargar plantilla
								</button>
								<p className='text-xs text-dymAntiPop/50 mt-2'>
									La plantilla incluye listas desplegables con los valores válidos de cada campo
								</p>
							</div>

							<div className='border-t border-white/[0.07] pt-6'>
								<h3 className='text-sm font-medium text-dymAntiPop mb-3'>2. Subir archivo</h3>
								<div
									onDragOver={(e) => e.preventDefault()}
									onDrop={(e) => {
										e.preventDefault();
										const file = e.dataTransfer.files?.[0];
										if (file) handleFileSelect(file);
									}}
									onClick={() => document.getElementById('fileInput')?.click()}
									className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
										selectedFile
											? 'border-dymOrange/50 bg-dymOrange/5'
											: 'border-white/[0.2] hover:border-dymOrange/50 hover:bg-dymOrange/5'
									}`}
								>
									<input
										type='file'
										accept='.xlsx,.xls'
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) handleFileSelect(file);
										}}
										className='hidden'
										id='fileInput'
									/>
									{selectedFile ? (
										<div>
											<p className='text-dymOrange font-medium'>📄 {selectedFile.name}</p>
											<p className='text-xs text-dymAntiPop/50 mt-1'>
												Clic para cambiar el archivo
											</p>
										</div>
									) : (
										<div>
											<p className='text-dymAntiPop font-medium'>
												Arrastra tu archivo aquí o haz clic
											</p>
											<p className='text-xs text-dymAntiPop/50 mt-1'>Acepta .xlsx y .xls</p>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{phase === 'importing' && (
						<div className='flex flex-col items-center justify-center py-8 space-y-4'>
							<div className='w-10 h-10 border-2 border-dymOrange/30 border-t-dymOrange rounded-full animate-spin' />
							<p className='text-sm font-medium text-dymAntiPop'>
								Procesando importación...
							</p>
							<p className='text-xs text-dymAntiPop/50'>
								El backend está resolviendo y creando los productos. Por favor espera.
							</p>
						</div>
					)}

					{phase === 'done' && importResult && (
						<div className='space-y-6'>
							<div>
								<h3 className='text-base font-semibold text-dymAntiPop'>
									Importación finalizada
								</h3>
								<p className='text-xs text-dymAntiPop/50 mt-1'>
									Resumen del procesamiento de {totalRows}{' '}
									{totalRows === 1 ? 'producto' : 'productos'}
								</p>
							</div>

							{/* Tarjetas de estadísticas */}
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
								<div className='bg-[#252030] border border-green-500/20 rounded-lg p-4'>
									<div className='flex items-center gap-2 mb-2'>
										<div className='w-2 h-2 rounded-full bg-green-500' />
										<p className='text-xs uppercase tracking-wider text-dymAntiPop/60 font-medium'>
											Procesados
										</p>
									</div>
									<p className='text-2xl font-semibold text-green-400'>
										{importResult.productsCreated}
									</p>
									<p className='text-xs text-dymAntiPop/40 mt-1'>
										{importResult.variantsCreated}{' '}
										{importResult.variantsCreated === 1 ? 'variante' : 'variantes'} creadas
									</p>
								</div>

								<div className='bg-[#252030] border border-amber-500/20 rounded-lg p-4'>
									<div className='flex items-center gap-2 mb-2'>
										<div className='w-2 h-2 rounded-full bg-amber-500' />
										<p className='text-xs uppercase tracking-wider text-dymAntiPop/60 font-medium'>
											Ya existentes
										</p>
									</div>
									<p className='text-2xl font-semibold text-amber-400'>
										{importResult.productsAlreadyExisting}
									</p>
									<p className='text-xs text-dymAntiPop/40 mt-1'>Detectados por SKU duplicado</p>
								</div>

								<div className='bg-[#252030] border border-red-500/20 rounded-lg p-4'>
									<div className='flex items-center gap-2 mb-2'>
										<div className='w-2 h-2 rounded-full bg-red-500' />
										<p className='text-xs uppercase tracking-wider text-dymAntiPop/60 font-medium'>
											Con errores
										</p>
									</div>
									<p className='text-2xl font-semibold text-red-400'>
										{importResult.errors.length}
									</p>
									<p className='text-xs text-dymAntiPop/40 mt-1'>
										{importResult.errors.length === 0 ? 'Sin incidencias' : 'Ver detalle abajo'}
									</p>
								</div>
							</div>

							{/* Tabla de errores */}
							{importResult.errors.length > 0 && (
								<div>
									<div className='flex items-center justify-between mb-3'>
										<h4 className='text-sm font-semibold text-dymAntiPop'>
											Detalle de errores
										</h4>
										<span className='text-xs text-dymAntiPop/50'>
											{importResult.errors.length}{' '}
											{importResult.errors.length === 1 ? 'incidencia' : 'incidencias'}
										</span>
									</div>
									<div className='rounded-lg border border-white/[0.07] overflow-hidden'>
										<div className='max-h-[280px] overflow-y-auto'>
											<table className='w-full text-xs'>
												<thead className='sticky top-0 bg-[#252030] z-10'>
													<tr className='border-b border-white/[0.07]'>
														<th className='px-3 py-2.5 text-left text-dymAntiPop/60 font-medium uppercase tracking-wider text-[10px]'>
															Producto
														</th>
														<th className='px-3 py-2.5 text-left text-dymAntiPop/60 font-medium uppercase tracking-wider text-[10px]'>
															SKU
														</th>
														<th className='px-3 py-2.5 text-left text-dymAntiPop/60 font-medium uppercase tracking-wider text-[10px]'>
															Detalle del fallo
														</th>
													</tr>
												</thead>
												<tbody className='divide-y divide-white/[0.05]'>
													{importResult.errors.map((e, idx) => (
														<tr
															key={idx}
															className='hover:bg-white/[0.02] transition-colors'
														>
															<td className='px-3 py-2.5 text-dymAntiPop font-medium align-top max-w-[160px]'>
																<span className='block truncate'>{e.productName}</span>
															</td>
															<td className='px-3 py-2.5 align-top'>
																{e.sku ? (
																	<span className='font-mono text-dymAntiPop/80'>
																		{e.sku}
																	</span>
																) : (
																	<span className='text-dymAntiPop/30'>—</span>
																)}
															</td>
															<td className='px-3 py-2.5 text-red-300/90 align-top'>
																{e.reason}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='flex gap-3 px-6 py-4 border-t border-white/[0.07]'>
					{phase === 'idle' && (
						<>
							<button
								onClick={handleClose}
								className='flex-1 py-2 px-4 border border-white/[0.2] hover:bg-white/5 text-dymAntiPop rounded-lg transition-colors'
							>
								Cancelar
							</button>
							<button
								onClick={handleImport}
								disabled={!selectedFile}
								className='flex-1 py-2 px-4 bg-dymOrange hover:bg-dymOrange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium'
							>
								Importar
							</button>
						</>
					)}

					{phase === 'done' && (
						<button
							onClick={handleClose}
							className='flex-1 py-2 px-4 bg-dymOrange hover:bg-dymOrange/90 text-white rounded-lg transition-colors font-medium'
						>
							Cerrar
						</button>
					)}
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default ImportProductsModal;
