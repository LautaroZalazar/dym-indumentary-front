import { ChangeEvent, useState } from 'react';
import { useCreatebrandMutation } from '../../../redux/slices/catalogs.silce';
import { useMessage } from '../../../hooks/alertMessage';

const DashboardAddBrand: React.FC = () => {
	const [createBrand] = useCreatebrandMutation();
	const [brands, setBrands] = useState([{ name: '' }]);
	const { MessageComponent, showMessage } = useMessage();

	const handleChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const newSize = brands.map((size, i) =>
			i === index ? { ...size, [name]: value } : size
		);
		setBrands(newSize);
	};

	const addBrandField = () => {
		setBrands([...brands, { name: '' }]);
	};

	const removeBrandField = (index: number) => {
		setBrands(brands.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			for (const brand of brands) {
				if (brand.name) {
					const newBrand = {
						brand: brand.name.toLowerCase(),
					};
					await createBrand(newBrand).unwrap();
					showMessage(
						'success',
						'La marca se agregó correctamente',
						3000
					);
				}
				showMessage('error', 'El nombre no debe estar vacío', 3000);
			}
			setBrands([{ name: '' }]);
		} catch (error: any) {
			showMessage('error', 'Error al agregar la marca', 3000);
			throw new Error(error);
		}
	};

	return (
		<form className='flex justify-center items-center w-full min-h-screen p-4'>
			<div className='flex flex-col justify-center items-center bg-dymBlack w-full max-w-lg rounded-lg shadow-lg space-y-6 p-4'>
				{brands.map((brand, index) => (
					<div
						key={index}
						className='flex items-center justify-between w-full'>
						<input
							name='name'
							placeholder='Nombre de la marca'
							className='p-2 rounded-lg border border-dymAntiPop w-full'
							value={brand.name}
							onChange={(e) => handleChange(index, e)}
						/>
						<button
							type='button'
							onClick={() => removeBrandField(index)}
							className='text-red-500 hover:text-red-700 transition-all duration-300 ml-2'>
							&times;
						</button>
					</div>
				))}
				<div className='flex flex-col justify-around md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4'>
					<button
						type='button'
						onClick={addBrandField}
						className='p-2 border border-dymOrange rounded-lg w-full md:w-auto hover:bg-dymOrange transition-all duration-300'>
						Añadir otra marca
					</button>
					<button
						onClick={handleSubmit}
						className='p-2 border bg-dymOrange rounded-lg w-full md:w-auto transition-all duration-300'>
						Guardar marcas
					</button>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default DashboardAddBrand;
