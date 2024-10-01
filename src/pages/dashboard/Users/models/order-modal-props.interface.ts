import { IOrderMap } from "./order-map.interface";
export interface IOrderModalProps {
    orders: IOrderMap[];
	closeModal: () => void;
    email: string
}