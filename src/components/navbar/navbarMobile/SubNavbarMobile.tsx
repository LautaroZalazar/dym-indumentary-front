import { useState, useRef, useEffect } from 'react';
import HamburguerButton from '../../HamburguerButton';
import searchIcon from '../../../assets/SVG/searchIcon.svg';
import shoppingBag from '../../../assets/SVG/shoppingBag.svg';
import userIcon from '../../../assets/SVG/userIcon.svg';

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
			}, 100);
		}
	}, [showInput]);

	return (
		<nav className='bg-dymOrange p-1 top-0 w-full flex justify-around items-center'>
			<div className='flex w-full'>
				<div className='relativ w-full flex items-center mr-4'>
					<HamburguerButton />
						<div className='w-full flex justify-end space-x-6 items-center p-2'>
						<input
							type='text'
							ref={inputRef}
							className={`md:w-2/12 transition-all duration-300 ease-in-out transform ${
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
							<a href='/cart' className='text-white text-center hidden md:flex'>
								<img src={shoppingBag.toString()} />
							</a>
							<a href='/auth' className='text-white text-center hidden md:flex'>
								<img src={userIcon.toString()} />
							</a>
						</div>
				</div>
			</div>
		</nav>
	);
};

export default SubNavbarMobile;
