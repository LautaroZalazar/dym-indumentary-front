interface IStock {
	color: string;
	quantity: number;
  }

  export default interface ICombination {
	size: string;
	stock: IStock[];
  }