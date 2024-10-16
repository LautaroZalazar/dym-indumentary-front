import { ChangeEvent, useState } from 'react';
import { useCreateSubCategoriesMutation } from '../../../../redux/slices/catalogs.silce';
import { IAddSubcategoriesModalProps } from './models/addsubcategory-props.interface';
import { useMessage } from '../../../../hooks/alertMessage';
import XIcon from '../../../../assets/SVG/x.svg';

const AddSubcategories = ({
	closeModal,
	categoryId,
	categoryRefetch,
}: IAddSubcategoriesModalProps) => {
	const [createSubcategory] = useCreateSubCategoriesMutation();
	const [subcategories, setSubcategories] = useState([{ name: '' }]);
	const { MessageComponent, showMessage } = useMessage();

	const handleChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = event.target;
		const newSubcategory = subcategories.map((subCategory, i) =>
			i === index ? { ...subCategory, [name]: value } : subCategory
		);
		setSubcategories(newSubcategory);
	};

	const addSubcategoryField = () => {
		setSubcategories([...subcategories, { name: '' }]);
	};

	const removeSubcategoryField = (index: number) => {
		const updatedSubcategories = subcategories.filter(
			(_, i) => i !== index
		);
		setSubcategories(updatedSubcategories);
	};
	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		try {
			for (const subCategory of subcategories) {
				if (subCategory.name && categoryId) {
					const newSubcategory = {
						name: subCategory.name.toLowerCase(),
						categoryId: categoryId,
					};
					await createSubcategory(newSubcategory).unwrap();
					showMessage(
						'success',
						'La subcategoría se agregó correctamente',
						3000
					);
					categoryRefetch();
					closeModal();
				}
				showMessage('error', 'El nombre no debe estar vacío', 3000);
			}
			setSubcategories([{ name: '' }]);
		} catch (error: any) {
			showMessage('error', 'Error al agregar la subcategoría', 3000);
			throw new Error(error);
		}
	};

	return (
		<form className='fixed h-screen inset-0 flex justify-center items-center z-50 bg-dymBlack bg-opacity-80 pt-12'>
			<div className='bg-dymBlack border border-dymOrange rounded-lg shadow-lg w-full max-w-lg md:w-3/4 lg:w-2/4 xl:w-2/5 h-auto max-h-[80vh] flex flex-col mx-2 overflow-y-auto'>
				<div className='flex justify-between'>
					<h1 className='m-2'>Agregar subcategoría</h1>
					<button
						type='button'
						onClick={closeModal}
						className='rounded-lg hover:bg-dymOrange-dark transition-colors duration-300 m-2'>
						<img src={XIcon.toString()} />
					</button>
				</div>
				<div className='p-4'>
					{subcategories.map((subcategory, index) => (
						<div
							key={index}
							className='flex items-center justify-center space-x-4 mb-4'>
							<input
								name='name'
								placeholder='Nombre de la subcategoría'
								className='p-2 rounded-lg border border-dymAntiPop flex-1 min-w-0'
								value={subcategory.name}
								onChange={(e) => handleChange(index, e)}
							/>
							<button
								type='button'
								onClick={() => removeSubcategoryField(index)}
								className='p-1 text-red-500 hover:text-red-700 transition-all duration-300'>
								&times;
							</button>
						</div>
					))}
					<div className='flex justify-center space-x-4'>
						<button
							type='button'
							onClick={addSubcategoryField}
							className='p-2 border border-dymOrange rounded-lg flex-1 hover:bg-dymOrange transition-all duration-300'>
							Añadir otra subcategoría
						</button>
						<button
							onClick={handleSubmit}
							className='p-2 bg-dymOrange rounded-lg flex-1 transition-all duration-300'>
							Guardar subcategorías
						</button>
					</div>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</form>
	);
};

export default AddSubcategories;
