import React, { useState, useEffect } from 'react';
import IEditProductModalProps from '../models/editproductmodalprops.interface';
import { NavLink } from 'react-router-dom';
import useOutsideClick from '../../../hooks/handleClickOutside';
import xIcon from '../../../assets/SVG/x.svg';
import axios from 'axios';
import { IProduct } from '../../../models/product/product.model';

const baseUrl = import.meta.env.VITE_BACK_URL;

const EditProductModal: React.FC<IEditProductModalProps> = ({
	onClose,
	product,
	updateProduct,
	isModalOpen,
	setIsModalOpen,
}) => {
	const user = localStorage.getItem('user');
	const [productData, setProductData] = useState<IProduct>();
	const [selectedUpdate, setSelectedUpdate] = useState({
		sizeId: '',
		colorId: '',
		colorHex: '',
	});

	if (!isModalOpen) return null;

	useEffect(() => {
		const fetchProduct = async (id: string) => {
			try {
				if (user) {
					const response = await axios.get(
						`${baseUrl}/v1/product/${id}`,
						{
							headers: {
								'Content-Type':
									'application/json; charset=UTF-8',
							},
						}
					);
					setProductData(response.data);
				}
			} catch (error: any) {
				throw new Error(error);
			}
		};
		fetchProduct(product.product._id);
	}, [isModalOpen]);

	useEffect(() => {
		setSelectedUpdate({
			...selectedUpdate,
			sizeId: product.size._id,
			colorId: product.color._id,
			colorHex: product.color.hex,
		});
	}, [product]);

	const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedUpdate({ ...selectedUpdate, sizeId: event.target.value });
	};
	const handleColorClick = (color: string, id: string) => {
		setSelectedUpdate({
			...selectedUpdate,
			colorId: id,
			colorHex: color,
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

	const filteredColor = productData?.inventory?.filter(
		(i: any) => i.size._id === selectedUpdate.sizeId
	);

	const renderColorOptions = () =>
		filteredColor?.flatMap((i) =>
			i.stock?.map((e) => (
				<button
					key={e.color._id}
					className={`border-2 ml-2 rounded-full w-6 h-6 focus:outline-none`}
					style={{
						backgroundColor:
							selectedUpdate.colorHex === e.color.hex
								? e.color.hex
								: 'transparent',
						borderColor: e.color.hex,
					}}
					onClick={() => handleColorClick(e.color.hex, e.color._id)}
				/>
			))
		);

	const renderSizeOptions = () => {
		return productData?.inventory?.map((e) => (
			<option key={e.size._id} value={e.size._id} data-name={e.size.name}>
				{e.size.name}
			</option>
		));
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center'>
			<div
				ref={editModalRef}
				className='bg-dymBlack border border-dymOrange p-4 rounded-lg w-full lg:w-1/4 mx-4 lg:m-0'>
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
								<label className='block mb-1'>Size</label>
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
								Cancel
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
