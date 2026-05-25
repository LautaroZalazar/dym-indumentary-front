import { ChangeEvent, useState } from 'react';
import { useCreateSizeMutation } from '../../../redux/slices/catalogs.silce';
import { useMessage } from '../../../hooks/alertMessage';

const inputCls =
	'w-full rounded-lg h-10 pl-3 bg-[#252030] border border-white/[0.1] text-dymAntiPop placeholder:text-dymAntiPop/35 focus:outline-none focus:border-dymOrange/60 focus:ring-1 focus:ring-dymOrange/20 transition-colors duration-150';

const DashboardAddSize: React.FC = () => {
	const [createSize] = useCreateSizeMutation();
	const [sizes, setSizes] = useState([{ name: '' }]);
	const { MessageComponent, showMessage } = useMessage();

	const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setSizes(sizes.map((size, i) => (i === index ? { ...size, [name]: value } : size)));
	};

	const addSizeField = () => {
		setSizes([...sizes, { name: '' }]);
	};

	const removeSizeField = (index: number) => {
		setSizes(sizes.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			for (const size of sizes) {
				if (size.name) {
					await createSize({ size: size.name.toLowerCase() }).unwrap();
					showMessage('success', 'El talle se agregó correctamente', 3000);
				} else {
					showMessage('error', 'El nombre no debe estar vacío', 3000);
				}
			}
			setSizes([{ name: '' }]);
		} catch (error: any) {
			showMessage('error', 'Error al agregar el talle', 3000);
			throw new Error(error);
		}
	};

	return (
		<form className='flex justify-center items-start w-full p-6 py-8'>
			<div className='flex flex-col w-full max-w-lg bg-[#1E1A21] rounded-xl border border-white/[0.07] shadow-lg p-6'>
				<h1 className='text-lg font-semibold text-dymAntiPop mb-1'>Agregar talles</h1>
				<p className='text-xs text-dymAntiPop/40 mb-6'>Podés agregar varios talles a la vez.</p>

				<div className='space-y-3'>
					{sizes.map((size, index) => (
						<div key={index} className='flex items-end gap-3'>
							<div className='flex-1'>
								{index === 0 && (
									<label className='block text-xs font-medium text-dymAntiPop/55 mb-1.5'>
										Talle
									</label>
								)}
								<input
									name='name'
									placeholder='Ej: XL, 42, Único'
									className={inputCls}
									value={size.name}
									onChange={(e) => handleChange(index, e)}
								/>
							</div>
							<button
								type='button'
								onClick={() => removeSizeField(index)}
								disabled={sizes.length === 1}
								className='w-9 h-10 flex items-center justify-center rounded-lg text-dymAntiPop/35 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-20 transition-colors text-xl leading-none'
							>
								×
							</button>
						</div>
					))}
				</div>

				<div className='flex gap-3 mt-6 pt-5 border-t border-white/[0.07]'>
					<button
						type='button'
						onClick={addSizeField}
						className='flex-1 py-2.5 border border-white/15 hover:border-white/35 text-dymAntiPop/55 hover:text-dymAntiPop font-medium rounded-lg transition-colors text-sm'
					>
						+ Añadir otro
					</button>
					<button
						onClick={handleSubmit}
						className='flex-1 py-2.5 bg-dymOrange hover:bg-dymOrange/90 text-white font-semibold rounded-lg transition-colors text-sm'
					>
						Guardar talles
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default DashboardAddSize;
