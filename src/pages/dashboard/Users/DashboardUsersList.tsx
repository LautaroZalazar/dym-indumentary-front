import { useState, useMemo } from 'react';
import Loader from '../../../components/loader';
import { useFecthAllUsersQuery } from '../../../redux/slices/user.slice';
import { useUpdateUserMutation } from '../../../redux/slices/admin.slice';
import { useFetchRoleQuery } from '../../../redux/slices/catalogs.silce';
import { IUserMap } from './models/user-map.interface';
import ICatalogMap from '../Products/models/catalog-map.interface';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';

const DashboardUsersList = () => {
	const {
		data: userData,
		isLoading: userIsLoading,
		refetch: userRefetch,
	} = useFecthAllUsersQuery('');
	const { data: roleData } = useFetchRoleQuery('');
	const [userUpdate] = useUpdateUserMutation();
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();
	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('');
	const [filter, setFilter] = useState('');

	const updateUserRole = (
		userId: string,
		roleId: string,
		userName: string
	) => {
		showConfirmModal({
			message: `¿Estás seguro que quieres modificar el rol del usuario "${userName}"?`,
			onAccept: async () => {
				try {
					await userUpdate({ id: userId, data: roleId }).unwrap();
					await userRefetch();
					showMessage(
						'success',
						`Se cambió correctamente el rol de "${userName}"`,
						3000
					);
				} catch (error: any) {
					showMessage(
						'error',
						`Error al cambiar el rol del usuario "${userName}"`,
						3000
					);
					throw new Error(error);
				}
			},
		});
	};

	const sortedAndFilteredUsers = useMemo(() => {
		if (!userData) return [];

		let filtered = userData.filter((user: IUserMap) =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (filter === 'suscripto') {
			filtered = filtered.filter((user: IUserMap) => user.newsletter);
		} else if (filter === 'no suscripto') {
			filtered = filtered.filter((user: IUserMap) => !user.newsletter);
		} else if (filter === 'activo') {
			filtered = filtered.filter((user: IUserMap) => user.isActive);
		} else if (filter === 'no activo') {
			filtered = filtered.filter((user: IUserMap) => !user.isActive);
		} else if (filter === 'admin') {
			filtered = filtered.filter(
				(user: IUserMap) => user.role.name === 'ADMIN'
			);
		} else if (filter === 'user') {
			filtered = filtered.filter(
				(user: IUserMap) => user.role.name === 'USER'
			);
		}

		if (sortOrder === 'asc') {
			filtered = filtered.sort((a: IUserMap, b: IUserMap) =>
				a.name.localeCompare(b.name)
			);
		} else if (sortOrder === 'desc') {
			filtered = filtered.sort((a: IUserMap, b: IUserMap) =>
				b.name.localeCompare(a.name)
			);
		}

		return filtered;
	}, [userData, searchTerm, sortOrder, filter]);

	const handleReset = () => {
		setSearchTerm('');
		setSortOrder('');
		setFilter('');
	};



	if (userIsLoading) return <Loader />;

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 md:space-y-0 h-10 mt-4'>
					<input
						className='md:w-1/2 w-44% rounded-md p-2 border border-gray-300'
						placeholder='Buscar usuario por email'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42'>
						<select
							className='w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={sortOrder}
							onChange={(e) => setSortOrder(e.target.value)}>
							<option value='' hidden>
								Ordenar
							</option>
							<option value='asc'>Ascendente</option>
							<option value='desc'>Descendente</option>
						</select>
						<select
							className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={filter}
							onChange={(e) => setFilter(e.target.value)}>
							<option value='' hidden>
								Filtrar
							</option>
							<option value='suscripto'>Suscripto</option>
							<option value='no suscripto'>No suscripto</option>
							<option value='activo'>Activo</option>
							<option value='no activo'>No activo</option>
							<option value='admin'>Administrador</option>
							<option value='user'>Usuario</option>
						</select>
						{(sortOrder || filter) && (
							<button
								className='p-2 bg-red-500 text-white rounded-md'
								onClick={handleReset}>
								Deshacer
							</button>
						)}
					</div>
				</div>
				<div
					className='overflow-y-auto mt-24'
					style={{ maxHeight: 'calc(100vh - 150px)' }}>
					<table className='w-full'>
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
							{sortedAndFilteredUsers.length ? (
								sortedAndFilteredUsers.map(
									(user: IUserMap, userIndex: number) => (
										<tr
											className='border-b border-gray-300 text-dymAntiPop'
											key={userIndex}>
											<td className='py-4 px-4'>
												<p>{user.name}</p>
											</td>
											<td className='py-4 px-4'>
												{user.email.length < 46 ? (
													<p className='pl-2'>
														{user.email}
													</p>
												) : (
													<p
														className='pl-2'
														title={user.email}>
														{user.email
															.slice(0, 12)
															.concat('...')}
													</p>
												)}
											</td>
											<td className='py-4 px-4'>
												<p>{user.phone}</p>
											</td>
											<td className='py-4 px-4'>
												<div>
													{user.newsletter
														? 'Suscripto'
														: 'No suscripto'}
												</div>
											</td>
											<td className='py-4 px-4'>
												<div>
													{user.isActive
														? 'Activo'
														: 'No activo'}
												</div>
											</td>
											<td className='py-4 px-4'>
												<div>
													{roleData && (
														<select
															className='p-2'
															onChange={(e) =>
																updateUserRole(
																	user._id,
																	e.target
																		.value,
																	user.name
																)
															}
															value={
																user.role._id
															}>
															{roleData.map(
																(
																	r: ICatalogMap
																) => (
																	<option
																		key={
																			r._id
																		}
																		value={
																			r._id
																		}>
																		{r.name}
																	</option>
																)
															)}
														</select>
													)}
												</div>
											</td>
										</tr>
									)
								)
							) : (
								<tr>
									<td
										colSpan={6}
										className='text-center py-4'>
										No hay usuarios disponibles
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardUsersList;
