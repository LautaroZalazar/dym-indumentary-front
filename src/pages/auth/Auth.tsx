import { useState } from 'react';
import BasicAuth from './components/BasicAuth';
import Login from './login/Login';
import Signin from './signin/Signin';
import logo from '../../assets/SVG/logo.svg';
import BackButton from '../../components/BackButton';

const Auth = () => {
	const [isSelected, setIsSelected] = useState('BasicAuth');

	return (
		<div className='flex flex-col md:flex-row w-full h-screen md:items-center md:justify-center bg-[#18151A]'>
			<div
				className={`${
					isSelected === 'BasicAuth' ? 'hidden' : 'absolute md:top-1/4 md:left-[56%]'
				}`}>
				{setIsSelected ? (
					<BackButton onClick={() => setIsSelected('BasicAuth')} />
				) : (
					<BackButton />
				)}
			</div>
			<div className='flex justify-center items-center w-full md:w-2/4 h-2/5'>
				<img
					src={logo.toString()}
					alt='logo'
					className='as:size-40 size-full'
				/>
			</div>
			<div className='flex justify-center items-center w-full md:w-2/4 h-2/5'>
				{isSelected === 'LogIn' ? (
					<Login setIsSelected={setIsSelected} />
				) : isSelected === 'SignIn' ? (
					<Signin setIsSelected={setIsSelected} />
				) : (
					<BasicAuth setIsSelected={setIsSelected} />
				)}
			</div>
		</div>
	);
};

export default Auth;
