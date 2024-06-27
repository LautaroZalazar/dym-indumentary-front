export default interface IEditProductModalProps {
    onClose: () => void;
    product: any;
    updateProduct: (productId: string, quantity: number, colorId: string, sizeId: string, newColorId: string, newSizeId: string) => void;
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}