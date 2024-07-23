import IModalProps from '../models/modalImage.model'
import useOutsideClick from "../../../hooks/handleClickOutside";


const ModalImage:React.FC<IModalProps> = ( {images, activeIndex, isModalOpen, setIsModalOpen} ) => {
    
	const modalRef = useOutsideClick(() => {
        if (isModalOpen) {
            setIsModalOpen(false);
}})
    
    if (!isModalOpen) return null;


    return (
        <div className='fixed inset-0 bg-dymBlack bg-opacity-75 z-50 flex items-center justify-center p-4'>
            <div className='relative' ref={modalRef}>
                <button
                    className='absolute top-0 right-0 m-4 text-black text-2xl'
                    onClick={() => {setIsModalOpen(!isModalOpen)}}>
                    &times;
                </button>
                <img
                    src={images[activeIndex].url.toString()}
                    alt={`Pantalla completa de ${activeIndex + 1}`}
                    className='max-w-full max-h-[90vh] object-contain'
                />
            </div>
        </div>
    );
};

export default ModalImage;