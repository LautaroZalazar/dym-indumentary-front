export interface ISelectedProduct {
	color: { _id: string; hex: string; name?: string };
	quantity: string;
	size: { _id: string; name: string };
}