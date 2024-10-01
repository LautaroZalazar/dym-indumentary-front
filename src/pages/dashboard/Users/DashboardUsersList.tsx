import { useState } from 'react';
import Loader from '../../../components/loader';
import {
	useUpdateUserMutation,
	useFecthAllAdminUsersQuery,
} from '../../../redux/slices/admin.slice';
import Pagination from '../components/Pagination/Pagination';
import { useFetchRoleQuery } from '../../../redux/slices/catalogs.silce';
import { IUserMap } from './models/user-map.interface';
import ICatalogMap from '../Products/models/catalog-map.interface';
import { useMessage } from '../../../hooks/alertMessage';
import { useConfirmModal } from '../../../components/confirm-modal/ConfirmModalContext';
import { IUserFilters } from '../models/filters.interface';
import searchIcon from '../../../assets/SVG/searchIcon.svg';
import x from '../../../assets/SVG/x.svg';
import OrderModal from './components/OrderModal';

const DashboardUsersList = () => {
	const { data: roleData, isLoading: roleIsLoading } = useFetchRoleQuery('');
	const { MessageComponent, showMessage } = useMessage();
	const { showConfirmModal } = useConfirmModal();
	const [inputValue, setInputValue] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [hasSearched, setHasSearched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOrder, setSortOrder] = useState('');
	const [filters, setFilters] = useState<IUserFilters>({
		role: '',
		newsletter: undefined,
		isActive: undefined,
	});
	const [activeUser, setActiveUser] = useState<string | null>(null);
	const [userUpdate] = useUpdateUserMutation();
	const {
		data: userData,
		isLoading: userIsLoading,
		refetch: userRefetch,
	} = useFecthAllAdminUsersQuery({
		limit: 10,
		page: currentPage,
		isActive: filters.isActive,
		name: searchTerm,
		role: filters.role,
		newsletter: filters.newsletter,
	});

	if (userIsLoading || roleIsLoading) return <Loader />;

	const filterArray = [
		{ label: 'Activo', value: 'active' },
		{ label: 'Inactivo', value: 'inactive' },
		{ label: 'Suscripto', value: 'suscribed' },
		{ label: 'No suscripto', value: 'unsuscribed' },
		roleData.map((e: any) => {
			return { label: e.name, value: e.name };
		}),
	].flat();

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

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleSearch = () => {
		if (inputValue) {
			setSearchTerm(inputValue);
			setHasSearched(true);
		} else {
			setHasSearched(false);
			setSearchTerm('');
		}
	};
	const handleSearchClear = () => {
		setInputValue('');
		setSearchTerm('');
		setHasSearched(false);
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		if (value === 'ADMIN' || value === 'USER') {
			const role = roleData.find((r: any) => r.name === value);
			setFilters({
				...filters,
				role: role._id,
				newsletter: undefined,
				isActive: undefined,
			});
		} else if (value === 'suscribed') {
			setFilters({
				...filters,
				role: '',
				newsletter: true,
				isActive: undefined,
			});
		} else if (value === 'unsuscribed') {
			setFilters({
				...filters,
				role: '',
				newsletter: false,
				isActive: undefined,
			});
		} else if (value === 'active') {
			setFilters({
				...filters,
				role: '',
				newsletter: undefined,
				isActive: true,
			});
		} else if (value === 'inactive') {
			setFilters({
				...filters,
				role: '',
				newsletter: undefined,
				isActive: false,
			});
		} else {
			setFilters({
				...filters,
				newsletter: undefined,
				isActive: undefined,
				role: '',
			});
		}
	};

	const handleReset = () => {
		setSortOrder('');
		setFilters({
			...filters,
			role: '',
			isActive: undefined,
			newsletter: undefined,
		});
	};

	const openOrderModal = (userId: string) => {
		setActiveUser(userId);
	};

	const closeOrderModal = () => {
		setActiveUser(null);
	};

	return (
		<div className='h-screen'>
			<div className='flex flex-col bg-dymBlack h-screen overflow-hidden p-4'>
				<div className='flex flex-col md:flex-row md:space-x-32 space-y-4 md:space-y-0 h-10 mt-4'>
					<div className='flex w-full md:w-1/4'>
						<input
							className='w-full rounded-md rounded-r-none p-2 border border-gray-300'
							placeholder='Buscar usuario'
							value={inputValue}
							onChange={handleInputChange}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									handleSearch();
								}
							}}
						/>
						<button
							className={`p-2 rounded-r-md ${
								hasSearched
									? 'border border-dymOrange'
									: 'bg-dymOrange'
							} text-white`}
							onClick={
								hasSearched ? handleSearchClear : handleSearch
							}>
							{hasSearched ? (
								<img src={x.toString()} />
							) : (
								<img src={searchIcon.toString()} />
							)}
						</button>
					</div>
					<div className='flex md:space-x-10 space-x-2 md:w-1/2 w-42 justify-center'>
						<select
							className='md:w-42 rounded-md p-2 text-dymAntiPop border border-gray-300'
							value={
								filters.role || filters.newsletter !== undefined
									? filters.newsletter?.toString()
									: filters.isActive !== undefined
									? filters.isActive?.toString()
									: ''
							}
							onChange={(e) => {
								handleFilterChange(e);
							}}>
							<option value='' hidden>
								Filtrar
							</option>
							{filterArray.map((f) => {
								return (
									<option value={f.value}>{f.label}</option>
								);
							})}
						</select>
						{(sortOrder ||
							filters.role ||
							filters.isActive != undefined ||
							filters.newsletter != undefined) && (
							<button
								className='p-2 bg-red-500 text-white rounded-md'
								onClick={handleReset}>
								Deshacer
							</button>
						)}
					</div>
				</div>
				<div className='flex flex-col justify-between h-full'>
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
										Compras
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
								{userData?.users.length ? (
									userData.users.map(
										(user: IUserMap, userIndex: number) => (
											<>
												<tr
													className='border-b border-gray-300 text-dymAntiPop'
													key={userIndex}>
													<td className='py-4 px-4'>
														<p>{user.name}</p>
													</td>
													<td className='py-4 px-8'>
														<button
															onClick={() =>
																openOrderModal(
																	user._id
																)
															}
															className='underline'>
															Ver
														</button>
													</td>
													<td className='py-4 px-4'>
														{user.email.length <
														46 ? (
															<p className='pl-2'>
																{user.email}
															</p>
														) : (
															<p
																className='pl-2'
																title={
																	user.email
																}>
																{user.email
																	.slice(
																		0,
																		12
																	)
																	.concat(
																		'...'
																	)}
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
																	onChange={(
																		e
																	) =>
																		updateUserRole(
																			user._id,
																			e
																				.target
																				.value,
																			user.name
																		)
																	}
																	value={
																		user
																			.role
																			._id
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
																				{
																					r.name
																				}
																			</option>
																		)
																	)}
																</select>
															)}
														</div>
													</td>
												</tr>
												{activeUser === user._id && (
													<OrderModal
														closeModal={
															closeOrderModal
														}
														orders={user.orders}
														email={user.email}
													/>
												)}
											</>
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
					<Pagination
						currentPage={currentPage}
						totalItems={userData.totalCount}
						itemsPerPage={10}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>
			{MessageComponent && <MessageComponent />}
		</div>
	);
};

export default DashboardUsersList;
