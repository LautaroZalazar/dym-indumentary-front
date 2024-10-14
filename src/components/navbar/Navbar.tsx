import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/SVG/searchIcon.svg';
import shoppingBag from '../../assets/SVG/shoppingBag.svg';
import userIcon from '../../assets/SVG/userIcon.svg';
import { INavbarProps } from './models/navbar-props.interface';
import UserDropdown from './components/UserDropdown';
import useOutsideClick from '../../hooks/handleClickOutside';

const Navbar: React.FC<INavbarProps> = ({ onSearch }) => {
	const [showInput, setShowInput] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const dropdownRef = useOutsideClick(() => {
		if (showDropdown) {
			setShowDropdown(false);
		}
	});

	const toggleSearch = () => {
		if (inputRef.current?.value) {
			onSearch(inputRef.current.value);
			setSearchTerm(inputRef.current.value);
			navigate('/');
		} else {
			setShowInput(!showInput);
		}

		if (!showInput) {
			setSearchTerm('');
			onSearch('');
		} else if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const enterKeySearch = () => {
		if (inputRef.current?.value) {
			onSearch(inputRef.current.value);
			setSearchTerm(inputRef.current.value);
			navigate('/');
		} else {
			onSearch('');
			setSearchTerm('');
		}
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (searchTerm) {
			onSearch('');
		}
	};

	useEffect(() => {
		if (showInput && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [showInput]);

	return (
		<nav className='bg-dymOrange top-0 w-full fixed flex justify-around items-center z-20'>
			<div className='flex w-full justify-end items-center mr-4 h-12'>
				<div className='w-full flex justify-end space-x-8 items-center pr-4'>
					<div className='flex justify-end'>
						<input
							type='text'
							ref={inputRef}
							className={`md:w-full transition-all duration-300 ease-in-out transform ${
								showInput
									? 'w-full ml-10 px-2 opacity-100'
									: 'w-0 ml-0 opacity-0'
							} border rounded-md bg-white text-black`}
							placeholder='Buscar...'
							style={{
								visibility: showInput ? 'visible' : 'hidden',
							}}
							value={searchTerm}
							onChange={handleSearch}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									enterKeySearch();
								}
							}}
						/>
						<button
							className={`text-white cursor-pointer hover:text-gray-300 transition ml-4
							`}
							onClick={toggleSearch}>
							<img src={searchIcon.toString()} />
						</button>
					</div>
					<a
						href='/cart'
						className='text-white text-center hidden md:flex'>
						<img src={shoppingBag.toString()} />
					</a>
					<div
						ref={dropdownRef}
						className='text-white text-center relative'>
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className='text-white text-center hidden md:flex'>
							<img src={userIcon.toString()} alt='User Icon' />
						</button>

						{showDropdown && (
							<div>
								<UserDropdown />
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
