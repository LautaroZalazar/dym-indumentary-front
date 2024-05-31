import { useState, useRef, useEffect } from 'react';
import HamburguerButton from '../../HamburguerButton';
import searchIcon from '../../../assets/SVG/searchIcon.svg';

const SubNavbarMobile = () => {
	const [showInput, setShowInput] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const toggleSearchInput = () => {
		setShowInput(!showInput);
	};

	useEffect(() => {
		if (showInput && inputRef.current) {
		  setTimeout(() => {
			inputRef.current?.focus();
		  }, 100); // Retraso de 100 milisegundos
		}
	  }, [showInput]);

	return (
		<nav className='bg-dymOrange p-1 fixed top-0 w-full flex justify-around items-center'>
			<div className='flex w-full'>
				<div className='relative w-full flex items-center'>
					<HamburguerButton />
					<div className='w-full absolute flex justify-end items-center'>
						<input
							type='text'
							ref={inputRef}
							className={`transition-all duration-300 ease-in-out transform ${
								showInput
									? 'w-full ml-10 px-2 opacity-100'
									: 'w-0 ml-0 opacity-0'
							} border rounded-md bg-white text-black`}
							placeholder='Buscar...'
							style={{
								visibility: showInput ? 'visible' : 'hidden',
							}}
						/>
						<button
							className={`text-white cursor-pointer hover:text-gray-300 transition mx-2 ${
								showInput ? 'ml-2' : ''
							}`}
							onClick={toggleSearchInput}>
							<img src={searchIcon.toString()} />
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default SubNavbarMobile;
