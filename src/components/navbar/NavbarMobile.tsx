import shoppingBag from '../../assets/SVG/shoppingBag.svg';
import userIcon from '../../assets/SVG/userIcon.svg';
import homeIcon from '../../assets/SVG/homeIcon.svg';
import homeIconFill from '../../assets/SVG/homeIconFill.svg';
import dashboardIcon from '../../assets/SVG/dashboardIcon.svg'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavbarMobile = () => {
	const location = useLocation();
	const [isIconFill, setIsIconFill] = useState({
		home: false,
		cart: false,
		user: false,
	});
	const user = localStorage.getItem('user');
	const parsedUser = user && JSON.parse(user).user;

	useEffect(() => {
		if (location.pathname === '/') {
			setIsIconFill({ ...isIconFill, home: true });
		}
		if (location.pathname === '/auth') {
			setIsIconFill({ ...isIconFill, user: true });
		}
		if (location.pathname === '') {
			setIsIconFill({ ...isIconFill, cart: true });
		}
	}, [location.pathname]);

	return (
		<nav className='bg-dymOrange fixed bottom-0 w-full md:hidden flex justify-around items-center h-16 border-t border-orange-700/30 shadow-lg'>
			<div className='flex justify-around w-full px-2'>
				<a href='/' className='flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/15 transition-colors duration-200'>
					{isIconFill.home ? (
						<img src={homeIconFill.toString()} className='size-6'/>
					) : (
						<img src={homeIcon.toString()} className='size-6'/>
					)}
				</a>
				<a href='/cart' className='flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/15 transition-colors duration-200'>
					<img src={shoppingBag.toString()} className='size-6'/>
				</a>
				{!parsedUser ? (
					<a href='/auth' className='flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/15 transition-colors duration-200'>
						<img src={userIcon.toString()} className='size-6'/>
					</a>
				) : (
					<a href='/profile' className='flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/15 transition-colors duration-200'>
						<img src={userIcon.toString()} className='size-6'/>
					</a>
				)}
				{parsedUser?.roles.name === 'ADMIN' && (
					<a href='/dashboard' className='flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/15 transition-colors duration-200'>
						<img src={dashboardIcon.toString()} className='size-6'/>
					</a>
				)}
			</div>
		</nav>
	);
};

export default NavbarMobile;
