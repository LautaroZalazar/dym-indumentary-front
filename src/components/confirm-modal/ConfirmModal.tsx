import { IConfirmModalProps } from './models/confirm-modal.interface';

const ConfirmModal: React.FC<IConfirmModalProps> = ({
	message,
	onAccept,
	onCancel,
}) => {
	return (
		<div className='fixed inset-0 flex justify-center items-center z-[100] bg-dymBlack bg-opacity-80'>
			<div className='bg-dymBlack border border-dymOrange rounded-md p-4 shadow-lg'>
				<p className='text-dymAntiPop '>{message}</p>
				<div className='mt-4 flex justify-around'>
					<button
						type='button'
						onClick={onAccept}
						className='px-4 py-2 bg-dymOrange text-dymAntiPop rounded mr-2'>
						Accept
					</button>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 bg-tansparent border border-dymOrange text-dymAntiPop rounded'>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
