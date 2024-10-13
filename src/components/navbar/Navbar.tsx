import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/SVG/searchIcon.svg';
import shoppingBag from '../../assets/SVG/shoppingBag.svg';
import userIcon from '../../assets/SVG/userIcon.svg';
import { INavbarProps } from './models/navbar-props.interface';

const Navbar: React.FC<INavbarProps> = ({ onSearch }) => {
	const [showInput, setShowInput] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

  const toggleSearch = () => {
    if (inputRef.current?.value) {
      onSearch(inputRef.current.value);
      setSearchTerm(inputRef.current.value);
      navigate("/");
    } else {
      setShowInput(!showInput);
    }

    if (!showInput) {
      setSearchTerm("");
      onSearch("");
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const enterKeySearch = () => {
    if (inputRef.current?.value) {
      onSearch(inputRef.current.value);
      setSearchTerm(inputRef.current.value);
      navigate("/");
    } else {
      onSearch("");
      setSearchTerm("");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTerm) {
      onSearch("");
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
		<nav className='bg-dymOrange top-0 w-full fixed flex justify-around items-center overflow-hidden z-20'>
			<div className='flex w-full md:justify-center justify-end items-center mr-4 h-12'>
				<div className='w-full flex justify-end md:justify-center space-x-0 md:space-x-24 items-center'>
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
					<a
						href='/auth'
						className='text-white text-center hidden md:flex'>
						<img src={userIcon.toString()} />
					</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
