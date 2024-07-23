import { ChangeEvent, useState } from 'react';
import { useCreateColorMutation } from '../../../redux/slices/catalogs.silce';
import { useMessage } from '../../../hooks/alertMessage';

const DashboardAddColor: React.FC = () => {
	const [createColor] = useCreateColorMutation();
	const [colors, setColors] = useState([{ name: '', hex: '#000000' }]);
	const { MessageComponent, showMessage } = useMessage();

	const handleChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const newColors = colors.map((color, i) =>
			i === index ? { ...color, [name]: value } : color
		);
		setColors(newColors);
	};

	const addColorField = () => {
		setColors([...colors, { name: '', hex: '#000000' }]);
	};

	const removeColorField = (index: number) => {
		setColors(colors.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			for (const color of colors) {
				if (color.name && color.hex) {
					const newColor = {
						color: color.name.toLowerCase(),
						hex: color.hex,
					};
					await createColor(newColor).unwrap();
					showMessage(
						'success',
						'El color se agregó correctamente',
						3000
					);
				}
				showMessage(
					'error',
					'El nombre o el color no debe estar vacío',
					3000
				);
			}
			setColors([{ name: '', hex: '#000000' }]);
		} catch (error: any) {
			showMessage('error', 'Error al agregar el color', 3000);
			throw new Error(error);
		}
	};

	return (
		<form className='flex justify-center items-center w-full min-h-screen p-4'>
			<div className='flex flex-col justify-center items-center bg-dymBlack w-full max-w-lg rounded-lg shadow-lg space-y-6 p-4'>
				{colors.map((color, index) => (
					<div
						key={index}
						className='flex flex-col md:flex-row items-center justify-between w-full space-y-4 md:space-y-0 md:space-x-4'>
						<input
							name='name'
							placeholder='Nombre del color'
							className='p-2 rounded-lg border border-dymAntiPop w-full'
							value={color.name}
							onChange={(e) => handleChange(index, e)}
						/>
						<input
							name='hex'
							type='color'
							className='rounded-lg w-16 h-10 cursor-pointer'
							value={color.hex}
							onChange={(e) => handleChange(index, e)}
						/>
						<button
							type='button'
							onClick={() => removeColorField(index)}
							className='text-red-500 hover:text-red-700 transition-all duration-300'>
							&times;
						</button>
					</div>
				))}
				<div className='flex flex-col justify-around md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4'>
					<button
						type='button'
						onClick={addColorField}
						className='p-2 border border-dymOrange rounded-lg w-full md:w-auto hover:bg-dymOrange transition-all duration-300'>
						Añadir otro color
					</button>
					<button
						onClick={handleSubmit}
						className='p-2 border bg-dymOrange rounded-lg w-full md:w-auto transition-all duration-300'>
						Guardar colores
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default DashboardAddColor;
