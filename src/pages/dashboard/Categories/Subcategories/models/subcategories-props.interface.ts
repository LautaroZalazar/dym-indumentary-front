export interface ISubcategoriesModalProps {
    categoryId: string;
	subCategories: { _id: string; name: string }[];
	closeModal: () => void;
    categoryRefetch: any
}