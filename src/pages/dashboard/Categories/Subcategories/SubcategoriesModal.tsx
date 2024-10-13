import { useState } from 'react';
import AddSubcategory from './AddSubcategory';
import { ISubcategoriesModalProps } from './models/subcategories-props.interface';
import xIcon from '../../../../assets/SVG/x.svg';

const SubcategoriesModal: React.FC<ISubcategoriesModalProps> = ({
	categoryId,
	subCategories,
	closeModal,
	categoryRefetch,
}) => {
	const [addModalOpen, setAddModalOpen] = useState(false);

	return (
		<div className='fixed inset-0 flex justify-center items-center z-50 bg-dymBlack bg-opacity-80'>
			<div className='bg-dymBlack border border-dymOrange p-4 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-3/4 flex flex-col mx-2'>
				<div className='overflow-y-auto'>
					<div className='flex justify-between items-center mb-4 md:mb-6'>
						<h2 className='text-lg font-bold'>Subcategorías</h2>
						<button
							onClick={closeModal}
							className='p-1 md:p-2 rounded-lg hover:bg-dymOrange-dark transition-colors duration-300'>
							<img
								src={xIcon.toString()}
								alt='Cerrar'
								className='w-4 h-4 md:w-6 md:h-6'
							/>
						</button>
					</div>
					<div
						className='overflow-y-auto'
						style={{ maxHeight: 'calc(100vh - 150px)' }}>
						<table className='w-full mx-auto text-center'>
							<thead>
								<tr className='text-dymAntiPop'>
									<th className='py-2 px-4'>Nombre</th>
								</tr>
							</thead>
							<tbody>
								{subCategories.map((subCategory) => (
									<tr
										key={subCategory._id}
										className='text-dymAntiPop'>
										<td className='py-4 px-4 border-b border-gray-300'>
											{subCategory.name
												.charAt(0)
												.toUpperCase() +
												subCategory.name.slice(1)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className='mt-auto text-center'>
					<button
						onClick={() => setAddModalOpen(true)}
						className='p-2 bg-dymOrange rounded-lg mt-4 hover:bg-dymOrange-dark transition-colors duration-300'>
						Agregar Subcategoría
					</button>
				</div>
				{addModalOpen && (
					<AddSubcategory
						closeModal={() => setAddModalOpen(false)}
						categoryId={categoryId}
						categoryRefetch={categoryRefetch}
					/>
				)}
			</div>
		</div>
	);
};

export default SubcategoriesModal;
