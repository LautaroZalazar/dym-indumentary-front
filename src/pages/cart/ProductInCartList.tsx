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
							className='justify-between mb-6 rounded-lg p-6 shadow-md sm:flex sm:justify-start border border-dymOrange'>
							<img
								src={e.product?.image[0]}
								alt='product-image'
								className='w-full rounded-lg sm:w-40'
							/>
							<div className='sm:ml-4 sm:flex sm:w-full sm:justify-between max-h-full overflow-hidden'>
								<div className='mt-5 sm:mt-0'>
									<h2 className='text-lg font-bold text-dymAntiPop'>
										{e.product?.name}
									</h2>
									<p className='text-sm text-dymAntiPop mt-2'>
										Talle: {e.size?.name}
									</p>
									<p className='flex items-centermt-1 text-sm text-dymAntiPop mt-2 text-center'>
										<span className='flex items-center'>
											Color:
										</span>
										<button
											disabled
											key={e.color?._id}
											className={`border ml-2 rounded-full w-6 h-6 focus:outline-none`}
											style={{
												backgroundColor: e.color?.hex,
												borderColor: e.color?.hex,
											}}
										/>
									</p>
									<p className='flex items-centermt-1 text-sm text-dymAntiPop mt-2 text-center'>
										<button
											onClick={() => openModal(e)}
											className='mt-1 text-dymAntiPop underline hover:text-blue-700'>
											Editar producto
										</button>
									</p>
								</div>
								<div className='mt-4 flex justify-between sm:mt-0 sm:block sm:space-x-6'>
									<div className='flex justify-end'>
										<button
											onClick={() =>
												removeItem(
													e.product?._id,
													e.size?._id,
													e.color?._id
												)
											}>
											<img src={trashIcon.toString()} />
										</button>
									</div>
									<div className='flex flex-col md:flex-row space-x-6 items-end md:items-center justify-end h-full'>
										{/* <div className='flex flex-col items-center space-y-1'>
											<p className='text-sm text-dymAntiPop'>
												Precio
											</p>
											<p className='text-sm'>
												${e.product?.price}
											</p>
										</div> */}
										<div className='flex justify-end items-center border-gray-100 border rounded-full'>
											<span
												className='cursor-pointer rounded-full border py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50'
												onClick={() =>
													updateProduct(
														e.product?._id,
														e.quantity - 1,
														e.color?._id,
														e.size?._id
													)
												}>
												{' '}
												-{' '}
											</span>
											<input
												className='h-8 w-8 text-center text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0'
												type='number'
												value={e.quantity}
												min='1'
												onChange={(event) =>
													updateProduct(
														e.product?._id,
														Number(
															event.target.value
														),
														e.color?._id,
														e.size?._id
													)
												}
											/>
											<span
												className='cursor-pointer rounded-full border py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50'
												onClick={() =>
													updateProduct(
														e.product?._id,
														e.quantity + 1,
														e.color?._id,
														e.size?._id
													)
												}>
												{' '}
												+{' '}
											</span>
										</div>
										<div className='flex md:flex-col items-end space-y-2 w-full justify-center'>
											<p className='text-md text-dymAntiPop'>
												Total&nbsp;
											</p>
											<p className='text-lg'>
											&nbsp;${e.product?.price * e.quantity}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
		</>
	);
};

export default ProductInCartList;
