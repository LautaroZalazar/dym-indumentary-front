const Skeleton_loader = () => {
	return (
		<section className='bg-dymBlack w-full h-full'>
			<div className='container px-6 pt-4 mx-auto animate-pulse w-3/5'>
				<p className='w-32 h-2 mx-auto bg-gray-200 rounded-lg dark:bg-gray-700'></p>
				<p className='w-24 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700'></p>
				<p className='w-16 h-2 mx-auto mt-4 bg-gray-200 rounded-lg dark:bg-gray-700'></p>
			</div>
		</section>
	);
};

export default Skeleton_loader;
