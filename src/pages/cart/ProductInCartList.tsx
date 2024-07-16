import trashIcon from '../../assets/SVG/trashIcon.svg';

const ProductInCartList = ({
	product,
	removeItem,
	updateProduct,
	openModal,
}: any) => {
	return (
		<>
			{product &&
				product.map((e: any, index: number) => {
					return (
						<div
							key={index}
							className='flex justify-between mb-6 rounded-lg p-4 shadow-md border border-dymOrange'>
							<div className='flex flex-1 pr-4'>
								<img
									src={e.product?.image[0]}
									alt='product-image'
									className='w-24 h-24 md:w-40 md:h-40 rounded-lg object-cover'
								/>
								<div className='ml-4 flex flex-col justify-between'>
									<div className='md:space-y-4'>
										<h2 className='text-sm font-bold text-dymAntiPop'>
											{e.product?.name}
										</h2>
										<p className='text-xs text-dymAntiPop mt-1'>
											Talle: {e.size?.name}
										</p>
										<p className='flex items-center text-xs text-dymAntiPop mt-1'>
											<span className='flex items-center'>
												Color:
											</span>
											<button
												disabled
												key={e.color?._id}
												className={`border ml-2 rounded-full w-4 h-4 focus:outline-none`}
												style={{
													backgroundColor:
														e.color?.hex,
													borderColor: e.color?.hex,
												}}
											/>
										</p>
									</div>
									<button
										onClick={() => openModal(e)}
										className='text-xs text-start text-dymAntiPop underline hover:text-blue-700 mt-1'>
										Editar producto
									</button>
								</div>
							</div>
							<div className='flex flex-col justify-between items-end'>
								<button
									onClick={() =>
										removeItem(
											e.product?._id,
											e.size?._id,
											e.color?._id
										)
									}>
									<img
										src={trashIcon.toString()}
										className='w-5 h-5'
									/>
								</button>
								<div className='flex flex-col items-end space-y-2'>
									<div className='flex items-center border-gray-100 border rounded-full'>
										<span
											className='cursor-pointer rounded-full border py-1 px-2 text-xs'
											onClick={() =>
												updateProduct(
													e.product?._id,
													e.quantity - 1,
													e.color?._id,
													e.size?._id
												)
											}>
											-
										</span>
										<input
											className='h-6 w-6 text-center text-xs outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
											type='number'
											value={e.quantity}
											min='1'
											onChange={(event) =>
												updateProduct(
													e.product?._id,
													Number(event.target.value),
													e.color?._id,
													e.size?._id
												)
											}
										/>
										<span
											className='cursor-pointer rounded-full border py-1 px-2 text-xs'
											onClick={() =>
												updateProduct(
													e.product?._id,
													e.quantity + 1,
													e.color?._id,
													e.size?._id
												)
											}>
											+
										</span>
									</div>
									<p className='text-xs text-dymAntiPop'>
										Total: ${e.product?.price * e.quantity}
									</p>
								</div>
							</div>
						</div>
					);
				})}
		</>
	);
};

export default ProductInCartList;
