import Loader from '../../../components/loader';
import { useFecthAllUsersQuery } from '../../../redux/slices/user.slice';
import { IUserMap } from './models/user-map.interface'

const DashboardUsersList = () => {
	const { data: userData, isLoading: userIsLoading } =
		useFecthAllUsersQuery('');
	console.log(userData);

	if (userIsLoading) return <Loader />;

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-row md:space-x-32 space-x-4 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar usuario'
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Ordenar
							</option>
						</select>
						<select className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'>
							<option selected hidden>
								Filtrar
							</option>
						</select>
					</div>
				</div>
				<table className='w-full mt-20 overflow-y-auto'>
					<thead>
						<tr className='text-dymAntiPop'>
							<th className='w-1/4 text-start py-2 px-4'>
								Nombre
							</th>
							<th className='w-1/4 text-start py-2 px-4'>
								Email
							</th>
							<th className='w-1/4 text-start py-2 px-4'>
								Teléfono
							</th>
							<th className='w-1/6 text-start py-2 px-4'>
								NewsLetter
							</th>
							<th className='w-1/6 text-start py-2 px-4'>
								Activo
							</th>
							<th className='w-1/12 text-start py-2 px-4'>
								Rol
							</th>
						</tr>
					</thead>
					<tbody>
						{userData?.map(
							(user: IUserMap, userIndex: number) => (
								<tr
									className='border-b border-gray-300 text-dymAntiPop'
									key={userIndex}>
									<td className='py-4 px-4'>
										<p>{user.name}</p>
									</td>
									<td className='py-4 px-4'>
										{user.email.length < 46 ? (
											<p className='pl-2'>{user.email}</p>
										) : (
											<p className='pl-2' title={user.email}>
												{user.email
													.slice(0, 12)
													.concat('...')}
											</p>
										)}
									</td>
									<td className='py-4 px-4'>
										<p>
											{user.phone}
										</p>
									</td>
									<td className='py-4 px-4'>
										<div>
											{user.newsletter ? 'Suscripto' : 'No suscripto'}
										</div>
									</td>
									<td className='py-4 px-4'>
										<div>
											{user.isActive ? 'Activo' : 'No activo'}
										</div>
									</td>
									<td className='py-4 px-4'>
										<div>
											<button type='button'>
												{user.role.name === 'USER' ? 'Usuario' : 'Administrador'}
											</button>
										</div>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DashboardUsersList;
