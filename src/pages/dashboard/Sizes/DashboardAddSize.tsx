import { ChangeEvent, useState } from 'react';
import { useCreateSizeMutation } from '../../../redux/slices/catalogs.silce';
import { useMessage } from '../../../hooks/alertMessage';

const DashboardAddSize: React.FC = () => {
	const [createSize] = useCreateSizeMutation();
	const [sizes, setSizes] = useState([{ name: '' }]);
	const { MessageComponent, showMessage } = useMessage();

	const handleChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const newSize = sizes.map((size, i) =>
			i === index ? { ...size, [name]: value } : size
		);
		setSizes(newSize);
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
					const newSize = {
						size: size.name.toLowerCase(),
					};
					await createSize(newSize).unwrap();
					showMessage(
						'success',
						'El talle se agregó correctamente',
						3000
					);
				}
				showMessage('error', 'El nombre no debe estar vacío', 3000);
			}
			setSizes([{ name: '' }]);
		} catch (error: any) {
			showMessage('error', 'Error al agregar el talle', 3000);
			throw new Error(error);
		}
	};

	return (
		<form className='flex justify-center items-center w-full min-h-screen p-4 pt-12 pb-12 md:pb-0'>
			<div className='flex flex-col justify-center items-center bg-dymBlack w-full max-w-lg rounded-lg shadow-lg space-y-6 p-4'>
				{sizes.map((size, index) => (
					<div
						key={index}
						className='flex items-center justify-between w-full'>
						<input
							name='name'
							placeholder='Nombre del talle'
							className='p-2 rounded-lg border border-dymAntiPop w-full'
							value={size.name}
							onChange={(e) => handleChange(index, e)}
						/>
						<button
							type='button'
							onClick={() => removeSizeField(index)}
							className='text-red-500 hover:text-red-700 transition-all duration-300 ml-2'>
							&times;
						</button>
					</div>
				))}
				<div className='flex flex-col justify-around md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4'>
					<button
						type='button'
						onClick={addSizeField}
						className='p-2 border border-dymOrange rounded-lg w-full md:w-auto hover:bg-dymOrange transition-all duration-300'>
						Añadir otro talle
					</button>
					<button
						onClick={handleSubmit}
						className='p-2 border bg-dymOrange rounded-lg w-full md:w-auto transition-all duration-300'>
						Guardar talles
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default DashboardAddSize;
