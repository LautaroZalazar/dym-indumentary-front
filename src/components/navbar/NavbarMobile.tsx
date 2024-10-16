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
		<nav className='bg-dymOrange p-4 fixed bottom-0 w-full md:hidden flex justify-around items-center h-12'>
			<div className='flex justify-around w-full'>
				<a href='/' className='text-white flex align-center'>
					{isIconFill.home ? (
						<img src={homeIconFill.toString()} />
					) : (
						<img src={homeIcon.toString()} />
					)}
				</a>
				<a href='/cart' className='text-white text-center'>
					<img src={shoppingBag.toString()} />
				</a>
				{!parsedUser ? (
					<a href='/auth' className='text-white text-center'>
						<img src={userIcon.toString()} />
					</a>
				) : (
					<a href='/profile' className='text-white text-center'>
						<img src={userIcon.toString()} />
					</a>
				)}
				{parsedUser?.roles.name === 'ADMIN' && (
					<a href='/dashboard' className='text-white text-center'>
						<img src={dashboardIcon.toString()} />
					</a>
				)}
			</div>
		</nav>
	);
};

export default NavbarMobile;
