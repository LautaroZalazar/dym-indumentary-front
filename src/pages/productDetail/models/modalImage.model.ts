export default interface IModalProps {
    images: [string],
    activeIndex: number,
    isModalOpen: boolean,
    setIsModalOpen:  React.Dispatch<React.SetStateAction<boolean>>;
 }