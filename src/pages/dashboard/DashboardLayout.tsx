import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';

const ChevronLeftIcon = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M15 18l-6-6 6-6" />
	</svg>
);

const ChevronRightIcon = () => (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9 18l6-6-6-6" />
	</svg>
);

const ChevronDownIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 9l6 6 6-6" />
	</svg>
);

const XIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);

const MenuIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M3 12h18M3 6h18M3 18h18" />
	</svg>
);

const ListIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
	</svg>
);

const ChartIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
	</svg>
);

const ShoppingBagIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
	</svg>
);

const PlusIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 5v14M5 12h14" />
	</svg>
);

const AlertIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
		<path d="M12 9v4M12 17h.01" />
	</svg>
);

type NavItem = { label: string; path: string; icon: JSX.Element };
type NavGroup = { label: string; items: NavItem[] };
type NavSection = { label: string; items?: NavItem[]; groups?: NavGroup[] };

const adminNavSections: NavSection[] = [
	{
		label: 'Productos',
		items: [
			{ label: 'Lista de productos', path: '/dashboard/products', icon: <ListIcon /> },
			{ label: 'Crear producto', path: '/dashboard/add-product', icon: <PlusIcon /> },
			{ label: 'Stock bajo', path: '/dashboard/low-stock', icon: <AlertIcon /> },
		],
	},
	{
		label: 'Catálogos',
		groups: [
			{
				label: 'Colores',
				items: [
					{ label: 'Lista de colores', path: '/dashboard/colors', icon: <ListIcon /> },
					{ label: 'Agregar color', path: '/dashboard/add-color', icon: <PlusIcon /> },
				],
			},
			{
				label: 'Talles',
				items: [
					{ label: 'Lista de talles', path: '/dashboard/sizes', icon: <ListIcon /> },
					{ label: 'Agregar talle', path: '/dashboard/add-size', icon: <PlusIcon /> },
				],
			},
			{
				label: 'Categorías',
				items: [
					{ label: 'Lista de categorías', path: '/dashboard/categories', icon: <ListIcon /> },
					{ label: 'Agregar categoría', path: '/dashboard/add-category', icon: <PlusIcon /> },
				],
			},
			{
				label: 'Marcas',
				items: [
					{ label: 'Lista de marcas', path: '/dashboard/brands', icon: <ListIcon /> },
					{ label: 'Agregar marca', path: '/dashboard/add-brand', icon: <PlusIcon /> },
				],
			},
		],
	},
	{
		label: 'Usuarios',
		items: [
			{ label: 'Lista de usuarios', path: '/dashboard/users', icon: <ListIcon /> },
		],
	},
	{
		label: 'Reportería',
		items: [
			{ label: 'Reportes', path: '/dashboard/reports', icon: <ChartIcon /> },
		],
	},
	{
		label: 'Ventas',
		items: [
			{ label: 'Ventas en local', path: '/dashboard/sales', icon: <ShoppingBagIcon /> },
			{ label: 'Nueva venta', path: '/dashboard/sales/new', icon: <PlusIcon /> },
		],
	},
];

const sellerNavSections: NavSection[] = [
	{
		label: 'Ventas',
		items: [
			{ label: 'Ventas en local', path: '/dashboard/sales', icon: <ShoppingBagIcon /> },
			{ label: 'Nueva venta', path: '/dashboard/sales/new', icon: <PlusIcon /> },
		],
	},
];

const DashboardLayout = () => {
	const sessionData = JSON.parse(localStorage.getItem('user') || 'null');
	const role: string = sessionData?.role ?? '';
	const navSections = role === 'SELLER' ? sellerNavSections : adminNavSections;
	const allGroupLabels = navSections.flatMap((s) => s.groups?.map((g) => g.label) ?? []);

	const [collapsed, setCollapsed] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(allGroupLabels));
	const location = useLocation();

	useEffect(() => {
		setMobileOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		navSections.forEach((section) => {
			section.groups?.forEach((group) => {
				const isActive = group.items.some(
					(item) => location.pathname === item.path
				);
				if (isActive) {
					setOpenGroups((prev) => new Set([...prev, group.label]));
				}
			});
		});
	}, [location.pathname]);

	if (!sessionData || (role !== 'ADMIN' && role !== 'SELLER')) {
		return <Navigate to="/" replace />;
	}

	const toggleGroup = (groupLabel: string) => {
		setOpenGroups((prev) => {
			const next = new Set(prev);
			if (next.has(groupLabel)) next.delete(groupLabel);
			else next.add(groupLabel);
			return next;
		});
	};

	const navItemClass = (isActive: boolean, isCollapsed: boolean) =>
		`flex items-center gap-2.5 rounded-md text-sm font-medium transition-all duration-150
		${isCollapsed ? 'justify-center py-2.5 px-0' : 'px-2.5 py-2'}
		${isActive
			? 'bg-dymOrange/[0.13] text-dymOrange'
			: 'text-dymAntiPop/55 hover:bg-white/[0.05] hover:text-dymAntiPop'
		}`;

	return (
		<div className='flex pt-16 h-screen overflow-hidden bg-dymBlack'>
			{mobileOpen && (
				<div
					className='fixed inset-0 z-30 bg-black/60 md:hidden'
					onClick={() => setMobileOpen(false)}
				/>
			)}

			<aside
				className={`
					fixed md:static top-16 bottom-0 left-0 z-40 flex flex-col shrink-0
					bg-[#1E1A21] border-r border-white/[0.07]
					transition-all duration-300 ease-in-out
					${collapsed ? 'w-14' : 'w-60'}
					${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
				`}
			>
				<div className='flex items-center h-11 px-3 border-b border-white/[0.07] shrink-0'>
					{!collapsed && (
						<span className='text-dymAntiPop/70 font-semibold text-sm tracking-wide'>
							{role === 'SELLER' ? 'Ventas' : 'Admin Panel'}
						</span>
					)}
					<button
						onClick={() => setCollapsed(!collapsed)}
						className='hidden md:flex items-center justify-center w-7 h-7 rounded-md text-dymAntiPop/40 hover:text-dymAntiPop hover:bg-white/10 transition-colors ml-auto shrink-0'
						title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
					>
						{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</button>
					<button
						onClick={() => setMobileOpen(false)}
						className='md:hidden flex items-center justify-center w-7 h-7 text-dymAntiPop/40 hover:text-dymAntiPop ml-auto'
					>
						<XIcon />
					</button>
				</div>

				<nav className='flex-1 overflow-y-auto py-3 px-2 space-y-5'>
					{navSections.map((section) => (
						<div key={section.label}>
							{!collapsed ? (
								<p className='px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-dymAntiPop/30'>
									{section.label}
								</p>
							) : (
								<div className='w-6 h-px bg-white/10 mx-auto mb-2' />
							)}

							{/* Flat items (Productos, Usuarios) */}
							{section.items && (
								<div className='space-y-0.5'>
									{section.items.map((item) => (
										<NavLink
											key={item.path}
											to={item.path}
											end
											title={collapsed ? item.label : undefined}
											className={({ isActive }) => navItemClass(isActive, collapsed)}
										>
											<span className='shrink-0'>{item.icon}</span>
											{!collapsed && (
												<span className='truncate'>{item.label}</span>
											)}
										</NavLink>
									))}
								</div>
							)}

							{/* Grouped items (Catálogos) */}
							{section.groups && (
								<div className='space-y-1'>
									{section.groups.map((group) => {
										const isOpen = openGroups.has(group.label);
										const hasActiveItem = group.items.some(
											(item) => location.pathname === item.path
										);

										return (
											<div key={group.label}>
												{!collapsed ? (
													<button
														onClick={() => toggleGroup(group.label)}
														className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors
															${hasActiveItem
																? 'text-dymOrange/80'
																: 'text-dymAntiPop/40 hover:text-dymAntiPop/70'
															}`}
													>
														<span className='uppercase tracking-wider'>{group.label}</span>
														<span
															className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
														>
															<ChevronDownIcon />
														</span>
													</button>
												) : (
													<div className='w-4 h-px bg-white/[0.06] mx-auto my-1' />
												)}

												{(isOpen || collapsed) && (
													<div className='space-y-0.5 mt-0.5'>
														{group.items.map((item) => (
															<NavLink
																key={item.path}
																to={item.path}
																end
																title={collapsed ? item.label : undefined}
																className={({ isActive }) => navItemClass(isActive, collapsed)}
															>
																<span className='shrink-0'>{item.icon}</span>
																{!collapsed && (
																	<span className='truncate'>{item.label}</span>
																)}
															</NavLink>
														))}
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					))}
				</nav>
			</aside>

			<main className='flex-1 overflow-y-auto bg-dymBlack pb-16 md:pb-0 min-w-0'>
				<button
					onClick={() => setMobileOpen(true)}
					className='fixed bottom-20 left-4 z-20 md:hidden w-10 h-10 flex items-center justify-center bg-dymOrange rounded-full shadow-lg text-white'
					title='Abrir menú'
				>
					<MenuIcon />
				</button>
				<Outlet />
			</main>
		</div>
	);
};

export default DashboardLayout;
