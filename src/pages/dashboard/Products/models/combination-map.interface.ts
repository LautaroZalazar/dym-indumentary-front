interface IStock {
    color: {_id: string, name: string, hex: string}
    quantity: number
}

export interface ICombinationMap {
	size: { _id: string; name: string };
	stock: IStock[];
}
