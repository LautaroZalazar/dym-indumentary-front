import { NavLink } from 'react-router-dom';

const Dashboard = () => {
	const cards = [
		{ name: 'Lista de colores', ref: '/dashboard-colors' },
		{ name: 'Agregar color', ref: '/dashboard-add-color' },
		{ name: 'Lista de talles', ref: '/dashboard-sizes' },
		{ name: 'Agregar talle', ref: '/dashboard-add-size' },
		{ name: 'Lista de categorías', ref: '/dashboard-categories' },
		{ name: 'Agregar categoría', ref: '/dashboard-add-category' },
		{ name: 'Lista de productos', ref: '/dashboard-products' },
		{ name: 'Lista de usuarios', ref: '/dashboard-users' },
		{ name: 'Crear producto', ref: '/dashboard-add-product' },
	];

	return (
		<div className='w-full min-h-screen flex flex-col items-center px-4'>
			<h1 className='text-3xl md:text-5xl text-dymAntiPop mt-4'>
				Dashboard
			</h1>
			<div className='w-full flex flex-wrap justify-center items-center mt-8'>
				{cards.map((c) => (
					<div key={c.ref} className='w-full md:w-1/2 lg:w-1/2 p-2'>
						<NavLink
							className='block text-lg md:text-xl text-dymAntiPop font-bold border border-dymOrange rounded-lg'
							to={c.ref}>
							<div className='w-full h-24 md:h-32 lg:h-20 bg-oasisGradient-antiFlashWhite flex justify-center items-center rounded-2xl'>
								{c.name}
							</div>
						</NavLink>
					</div>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
