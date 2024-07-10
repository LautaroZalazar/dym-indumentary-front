import IFormData from '../../../pages/dashboard/Products/models/form-product-data.interface'

export interface IPreset {
    preset: string
    setUrl: React.Dispatch<React.SetStateAction<IFormData>>
    form: IFormData;
    handleMouseEnter: () => void;
	handleMouseLeave: () => void;
}