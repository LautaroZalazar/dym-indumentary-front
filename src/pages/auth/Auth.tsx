import { useState } from 'react';
import BasicAuth from './components/BasicAuth';
import Login from './login/Login';
import Signin from './signin/Signin';
import logo from '../../assets/SVG/logo.svg';
import BackButton from '../../components/BackButton';

const Auth = () => {
	const [isSelected, setIsSelected] = useState('BasicAuth');

	return (
		<div className='flex flex-col w-full h-screen bg-[#18151A]'>
      <div className={`${isSelected === 'BasicAuth' ? 'hidden' : 'absolute top-0'}`}>
      {setIsSelected ? (
				<BackButton onClick={() => setIsSelected('BasicAuth')} />
			) : (
				<BackButton />
			)}
      </div>
			<div className='flex justify-center items-center w-full h-2/5'>
				<img
					src={logo.toString()}
					alt='logo'
					className='as:size-40 size-full'
				/>
			</div>
			{isSelected === 'LogIn' ? (
				<Login setIsSelected={setIsSelected} />
			) : isSelected === 'SignIn' ? (
				<Signin setIsSelected={setIsSelected} />
			) : (
				<BasicAuth setIsSelected={setIsSelected} />
			)}
		</div>
	);
};

export default Auth;
