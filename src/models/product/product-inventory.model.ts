import { ISize } from './size.model';
import { IColor } from './color.model';

export interface IProductInventory {
	size: ISize;
	stock: Array<{
		quantity: number;
		color: IColor;
	}>;
}
