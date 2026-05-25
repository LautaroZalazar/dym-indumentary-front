interface IStock {
	color: string;
	quantity: number;
	sku?: string;
}

export default interface ICombination {
	size: string;
	stock: IStock[];
}