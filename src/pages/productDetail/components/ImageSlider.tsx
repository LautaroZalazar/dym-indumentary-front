import React, { useState } from 'react';
import ModalImage from './modalImage'

const ImageSlider = ({ images }: any) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [touchStartX, setTouchStartX] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleThumbnailClick = (index: any) => {
		setActiveIndex(index);
	};

	const handleMouseEnter = (index: any) => {
		if (activeIndex !== index) {
			setActiveIndex(index);
		}
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		setTouchStartX(e.touches[0].clientX);
	};

	const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
		const touchEndX = e.changedTouches[0].clientX;
		const touchDifference = touchEndX - touchStartX;

		if (touchDifference > 50 && activeIndex > 0) {
			setActiveIndex(activeIndex - 1);
		} else if (touchDifference < -50 && activeIndex < images.length - 1) {
			setActiveIndex(activeIndex + 1);
		}
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<>
			{' '}
			<ModalImage images={images} activeIndex={activeIndex} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
			<div
				className='flex items-center'
				onMouseEnter={() => handleMouseEnter(activeIndex)}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}>
				<div className='flex justify-end w-full flex-col md:flex-row-reverse'>
					<div className='relative md:w-4/5 h-72 sm:h-80 md:h-96 lg:h-[40rem] rounded overflow-hidden'>
						{images.map((image: string, index: number) => (
							<div
								key={index}
								className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
									index === activeIndex
										? 'opacity-100 z-10'
										: 'opacity-0 z-0'
								}`}
								data-carousel-item={
									index === activeIndex ? 'active' : ''
								}>
								<img
									src={image.toString()}
									className='w-full h-full object-cover md:object-fill object-center p-2 border border-gray-200 cursor-pointer'
									alt={`Slide ${index + 1}`}
									onClick={toggleModal}
								/>
							</div>
						))}
					</div>
					<div className='flex flex-row md:flex-col space-x-2 space-y-0 md:space-x-0 md:space-y-2 justify-center md:justify-normal mt-4 md:mt-0 md:mr-4'>
						{images.map((image: string, index: number) => (
							<button
								key={index}
								className={`h-10 w-10 md:h-16 md:w-16 overflow-hidden border-2 ${
									index === activeIndex
										? 'border-orange-500'
										: 'border-gray-400'
								} rounded`}
								onClick={() => handleThumbnailClick(index)}
								onMouseEnter={() => handleMouseEnter(index)}>
								<img
									src={image.toString()}
									className='h-full w-full object-cover'
									alt={`Thumbnail ${index + 1}`}
								/>
							</button>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default ImageSlider;
