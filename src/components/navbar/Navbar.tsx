import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/SVG/searchIcon.svg';
import shoppingBag from '../../assets/SVG/shoppingBag.svg';
import userIcon from '../../assets/SVG/userIcon.svg';
import logo from '../../assets/SVG/logo.svg'
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
		<nav className='bg-dymOrange top-0 w-full fixed flex items-center z-20 h-16 shadow-md'>
			<div className='flex w-full justify-between items-center px-4 md:px-6'>
				<a href='/' className='flex items-center flex-shrink-0'>
					<img src={logo.toString()} className='size-9'/>
				</a>
				<div className='flex items-center gap-1 md:gap-2'>
					<div className='flex items-center'>
						<input
							type='text'
							ref={inputRef}
							className={`transition-all duration-300 ease-in-out ${
								showInput
									? 'w-36 sm:w-52 md:w-64 px-3 opacity-100'
									: 'w-0 px-0 opacity-0'
							} h-8 rounded-full bg-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 border-0`}
							placeholder='Buscar...'
							style={{ visibility: showInput ? 'visible' : 'hidden' }}
							value={searchTerm}
							onChange={handleSearch}
							onKeyPress={(e) => {
								if (e.key === 'Enter') enterKeySearch();
							}}
						/>
						<button
							className='text-white hover:bg-white/20 transition-colors duration-200 p-2 rounded-full cursor-pointer'
							onClick={toggleSearch}>
							<img src={searchIcon.toString()} className='size-5'/>
						</button>
					</div>
					<a
						href='/cart'
						className='text-white hover:bg-white/20 transition-colors duration-200 p-2 rounded-full hidden md:flex'>
						<img src={shoppingBag.toString()} className='size-5'/>
					</a>
					<div ref={dropdownRef} className='relative hidden md:flex'>
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className='text-white hover:bg-white/20 transition-colors duration-200 p-2 rounded-full'>
							<img src={userIcon.toString()} alt='User Icon' className='size-5'/>
						</button>
						{showDropdown && <UserDropdown />}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
