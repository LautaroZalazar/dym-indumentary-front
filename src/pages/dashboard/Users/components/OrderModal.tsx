import xIcon from '../../../../assets/SVG/x.svg';
import { IOrderModalProps } from '../models/order-modal-props.interface';
import { IOrderMap } from '../models/order-map.interface';
import useOutsideClick from '../../../../hooks/handleClickOutside';


const OrderModal: React.FC<IOrderModalProps> = ({
    closeModal,
	orders,
	email,
}) => {

    const parseArray = (jsonString: string) => {
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error: any) {
            throw new Error (error)
            return [];
        }
    };

	const orderModalRef = useOutsideClick(closeModal);

	return (
		<div className='fixed inset-0 flex justify-center items-center z-50 bg-dymBlack bg-opacity-80'>
			<div
				ref={orderModalRef}
				className='bg-dymBlack border border-dymOrange p-4 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3 xl:w-2/4 h-3/4 flex flex-col mx-2'>
				<div className='overflow-y-auto'>
					<div className='flex justify-between items-center mb-4 md:mb-6'>
						<h2 className='text-lg font-bold'>
							Compras - {email}
						</h2>
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
									<th className='py-2 px-4'>Producto/s</th>
									<th className='py-2 px-4'>Status</th>
									<th className='py-2 px-4'>Total</th>
								</tr>
							</thead>
							<tbody>
								{orders && orders.length > 0 ? (
									orders.map((order: IOrderMap) => {
										const parsedCart = parseArray(
											order.cart
										);

										return parsedCart.map((item: any) => (
											<tr
												key={item.product._id}
												className='border'>
												<td className='py-1'>
													{item.product.name}
												</td>
												<td>
													{order.status ===
													'completed'
														? 'Procesado'
														: 'Cancelado'}
												</td>
												<td>${order.total}</td>
											</tr>
										));
									})
								) : (
									<tr>
										<td colSpan={3} className='p-4'>
											No realizó ninguna compra
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderModal;
