import { ChangeEvent, useState } from 'react';
import { useCreateCategoryMutation } from '../../../redux/slices/catalogs.silce';

const DashboardAddCategory: React.FC = () => {
	const [createCategory] = useCreateCategoryMutation();
	const [categories, setCategories] = useState([{ name: '' }]);

	const handleCategoryChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const newCategories = categories.map((category, i) =>
			i === index ? { ...category, [name]: value } : category
		);
		setCategories(newCategories);
	};

	const addCategoryField = () => {
		setCategories([...categories, { name: '' }]);
	};

	const removeCategoryField = (index: number) => {
		setCategories(categories.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			for (const category of categories) {
				if (category.name) {
					await createCategory(category);
				}
			}
			setCategories([{ name: '' }]);
		} catch (error: any) {
			throw new Error(error);
		}
	};

	return (
		<form className='flex justify-center items-center w-full min-h-screen p-4'>
			<div className='flex flex-col justify-center items-center bg-dymBlack w-full max-w-lg rounded-lg shadow-lg space-y-4 p-4'>
				{categories.map((category, index) => (
					<div
						key={index}
						className='flex items-center justify-between w-full'>
						<input
							name='name'
							placeholder='Nombre de la categoría'
							className='p-2 rounded-lg border border-dymAntiPop w-full'
							value={category.name}
							onChange={(e) => handleCategoryChange(index, e)}
						/>
						<button
							type='button'
							onClick={() => removeCategoryField(index)}
							className='text-red-500 hover:text-red-700 transition-all duration-300 ml-2'>
							&times;
						</button>
					</div>
				))}
				<div className='flex flex-col justify-around md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4'>
					<button
						type='button'
						onClick={addCategoryField}
						className='p-2 border border-dymOrange rounded-lg w-full md:w-auto hover:bg-dymOrange transition-all duration-300'>
						Añadir otra categoría
					</button>
					<button
						onClick={handleSubmit}
						className='p-2 border bg-dymOrange rounded-lg w-full md:w-auto transition-all duration-300'>
						Guardar categorias
					</button>
				</div>
			</div>
		</form>
	);
};

export default DashboardAddCategory;
