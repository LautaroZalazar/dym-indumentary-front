import { IHamburgerButtonProps } from './models/hamburguerbutton-props.interface'

const HamburgerButton: React.FC<IHamburgerButtonProps> = ({ isOpen, onClick }) => {
	return (
		<button
			className={`flex z-20 relative h-10 text-dymBlack mx-2 focus:outline-none`}
			onClick={onClick}>
			<div className='absolute w-5 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'>
				<span
					className={`absolute h-0.5 w-5 ${isOpen ? 'bg-dymAntiPop' : 'bg-dymBlack'} transform transition duration-300 ease-in-out ${
						isOpen ? 'rotate-45 delay-200' : '-translate-y-1.5'
					}`}></span>
				<span
					className={`absolute h-0.5 ${isOpen ? 'bg-dymAntiPop' : 'bg-dymBlack'} transform transition-all duration-200 ease-in-out ${
						isOpen ? 'w-0 opacity-50' : 'w-5 delay-200 opacity-100'
					}`}></span>
				<span
					className={`absolute h-0.5 w-5 ${isOpen ? 'bg-dymAntiPop' : 'bg-dymBlack'} transform transition duration-300 ease-in-out ${
						isOpen ? '-rotate-45 delay-200' : 'translate-y-1.5'
					}`}></span>
			</div>
		</button>
	);
};

export default HamburgerButton;
