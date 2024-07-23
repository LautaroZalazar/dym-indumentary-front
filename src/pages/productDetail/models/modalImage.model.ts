interface IImageProps {
    url: string;
    public_id: string;
    _id: string;
}

export default interface IModalProps {
    images: IImageProps[],
    activeIndex: number,
    isModalOpen: boolean,
    setIsModalOpen:  React.Dispatch<React.SetStateAction<boolean>>;
 }