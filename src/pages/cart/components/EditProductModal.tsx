import React, { useEffect, useMemo, useState } from 'react';
import IEditProductModalProps from '../models/editproductmodalprops.interface';
import { NavLink } from 'react-router-dom';
import useOutsideClick from '../../../hooks/handleClickOutside';
import xIcon from '../../../assets/SVG/x.svg';
import { useFetchPublicVariantsQuery } from '../../../redux/slices/variant.slice';
import { ISize } from '../../../models/product/size.model';
import { IColor } from '../../../models/product/color.model';

const EditProductModal: React.FC<IEditProductModalProps> = ({
	onClose,
	product,
	updateProduct,
	isModalOpen,
	setIsModalOpen,
}) => {
	const [selectedUpdate, setSelectedUpdate] = useState({
		sizeId: '',
		colorId: '',
		colorHex: '',
	});

	const { data: variants } = useFetchPublicVariantsQuery(
		product.product._id,
		{ skip: !isModalOpen },
	);

	if (!isModalOpen) return null;

	useEffect(() => {
		setSelectedUpdate({
			sizeId: product.size._id,
			colorId: product.color._id,
			colorHex: product.color.hex,
		});
	}, [product]);

	const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedUpdate({ ...selectedUpdate, sizeId: event.target.value });
	};
	const handleColorClick = (color: IColor) => {
		setSelectedUpdate({
			...selectedUpdate,
			colorId: color._id,
			colorHex: color.hex,
		});
	};

	const editModalRef = useOutsideClick(() => {
		if (isModalOpen) {
			setIsModalOpen(false);
		}
	});

	const handleUpdate = () => {
		if (selectedUpdate.colorId && selectedUpdate.sizeId) {
			updateProduct(
				product.product._id,
				product.quantity,
				product.color._id,
				product.size._id,
				selectedUpdate.colorId,
				selectedUpdate.sizeId
			);
			onClose();
		}
	};

	const sizesAvailable: ISize[] = useMemo(() => {
		if (!variants) return [];
		const map = new Map<string, ISize>();
		variants.forEach((v) => {
			if (v.quantity > 0 && !map.has(v.size._id)) {
				map.set(v.size._id, { _id: v.size._id, name: v.size.name });
			}
		});
		return Array.from(map.values());
	}, [variants]);

	const colorsForSelectedSize: IColor[] = useMemo(() => {
		if (!variants || !selectedUpdate.sizeId) return [];
		const map = new Map<string, IColor>();
		variants.forEach((v) => {
			if (v.size._id === selectedUpdate.sizeId && v.quantity > 0) {
				if (!map.has(v.color._id)) map.set(v.color._id, v.color);
			}
		});
		return Array.from(map.values());
	}, [variants, selectedUpdate.sizeId]);

	const renderColorOptions = () =>
		colorsForSelectedSize.map((c) => (
			<button
				key={c._id}
				className={`border-2 ml-2 rounded-full w-6 h-6 focus:outline-none`}
				style={{
					backgroundColor:
						selectedUpdate.colorHex === c.hex ? c.hex : 'transparent',
					borderColor: c.hex,
				}}
				onClick={() => handleColorClick(c)}
			/>
		));

	const renderSizeOptions = () => {
		return sizesAvailable.map((s) => (
			<option key={s._id} value={s._id} data-name={s.name}>
				{s.name}
			</option>
		));
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center'>
			<div
				ref={editModalRef}
				className='bg-dymBlack border border-dymOrange p-4 rounded-lg w-full md:w-2/4 lg:w-1/3 xl:w-1/4 mx-4 lg:m-0'>
				{localStorage.getItem('user') ? (
					<>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl'>Editar producto</h2>
							<button
								onClick={onClose}
								className='relative top-0 right-0'>
								<img src={xIcon.toString()} />
							</button>
						</div>
						<div className='flex flex-row w-full justify-evenly text-center p-6'>
							<div className='p-4'>
								<label className='block mb-1'>Talle</label>
								<select
									value={selectedUpdate.sizeId}
									onChange={handleSizeChange}
									className='w-24 rounded overflow-y-auto border border-gray-400 py-2 focus:outline-none focus:border-dymOrange text-base pl-3 mb-2'>
									{renderSizeOptions()}
								</select>
							</div>
							<div className='p-4'>
								<label className='block mb-1'>Color</label>
								{renderColorOptions()}
							</div>
						</div>
						<div className='flex justify-between w-full mt-2'>
							<button
								onClick={handleUpdate}
								className='w-2/4 bg-dymOrange text-dymAntiPop p-2 rounded'>
								Modificar
							</button>
							<button
								onClick={onClose}
								className='w-2/4 bg-dymBlack text-dymAntiPop'>
								Cancelar
							</button>
						</div>
					</>
				) : (
					<div>
						<button
							onClick={onClose}
							className='relative top-0 right-0'>
							<img src={xIcon.toString()} />
						</button>
						<p className='flex justify-center p-4'>
							<NavLink
								to={'/auth'}
								className='underline text-dymAntiPop hover:text-blue-700'>
								Inicia sesión
							</NavLink>
							&nbsp;para editar el producto
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditProductModal;
