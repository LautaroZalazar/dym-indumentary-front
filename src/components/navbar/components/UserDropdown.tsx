import { useNavigate } from 'react-router-dom';

const UserDropdown = () => {
	const user = localStorage.getItem('user');
	const parsedUser = user && JSON.parse(user).user;
	const navigate = useNavigate();

	const logOut = () => {
		localStorage.removeItem('user');
		navigate('/');
	};

	return (
		<div className='absolute -left-20 top-10 transform -translate-x-1/2 mt-2 z-50 bg-dymBlack border border-dymOrange text-base list-none divide-y rounded px-2 shadow my-1'>
			{!parsedUser ? (
				<ul className='' aria-labelledby='dropdown'>
					<li className='w-52 h-12 pt-1.5'>
						<a
							href={'/auth'}
							className='text-sm hover:bg-dymOrange text-dymAntiPop rounded-md block text-center px-4 py-2'>
							Inicia sesión o registrate
						</a>
					</li>
				</ul>
			) : (
				<>
					<ul className='py-2' aria-labelledby='dropdown'>
						<li className='pb-2'>
							<a
								href={'/profile'}
								className='text-sm hover:bg-dymOrange text-dymAntiPop rounded-md block text-center px-4 py-2'>
								Perfil
							</a>
						</li>
						{parsedUser.roles.name === 'ADMIN' && (
							<li>
								<a
									className='text-sm hover:bg-dymOrange text-dymAntiPop rounded-md block text-center px-4 py-2'
									href={'/dashboard'}>
									Panel de administrador
								</a>
							</li>
						)}
					</ul>
					<div className='py-4'>
						<button
							onClick={() => logOut()}
							className='text-dymAntiPop bg-dymOrange w-52 h-12 flex rounded-md flex-col justify-center items-center py-2'>
							Cerrar Sesión
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default UserDropdown;
