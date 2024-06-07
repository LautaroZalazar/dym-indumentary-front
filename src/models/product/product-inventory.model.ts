import { Size } from './size.model';
import { Color } from './color.model';

export interface IProductInventory {
	size: Size;
	stock: Array<{
		quantity: number;
		color: Color;
	}>;
}
