import React from "react";
const SideBar = () => {
	return (
		<div className='hidden xl:flex flex-col p-4 max-w-[25rem] w-full'>
			<div className='mb-4'>
				<select className='block w-full border border-zinc-300 rounded p-2'>
					<option>Más relevantes</option>
					<option>Menos relevantes</option>
				</select>
			</div>
			<div className='mb-4'>
				<div className='border-b border-zinc-300 pb-2'>
					<button className='flex justify-between w-full text-left font-bold'>
						Tipo de producto
						<span className='transform rotate-0 transition-transform'>
							&#9660;
						</span>
					</button>
					<div className="mt-2">
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Bermudas
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Buzos
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Calzas
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Camisetas
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Camperas
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Chombas
						</label>
					</div>
				</div>
			</div>
			<div className='mb-4'>
				<div className='border-b border-zinc-300 pb-2'>
					<button className='flex justify-between w-full text-left font-bold'>
						Género
						<span className='transform rotate-0 transition-transform'>
							&#9660;
						</span>
					</button>
					<div className='mt-2'>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Hombre
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Mujer
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Niña
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Niño
						</label>
						<label className='block'>
							<input type='checkbox' className='mr-2' /> Unisex
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
