import logo from '../../assets/SVG/logo.svg';
import SigninButton from './components/signin-button';
import LoginButton from './components/login-button';

const Auth = () => {
	return (
		<div className='flex flex-col w-full h-screen bg-[#18151A]'>
			<div className='flex justify-center items-center w-full h-2/4'>
				<img src={logo} alt='logo' className='as:size-40 size-full' />
			</div>
			<div className='flex flex-col justify-center items-center w-full h-2/4 gap-y-5'>
				<SigninButton />
				<LoginButton />
			</div>
		</div>
	);
};

export default Auth;
