import {IProduct} from '../../../models/product/product.model'
import {IColor} from '../../../models/product/color.model'
import {ISize} from '../../../models/product/size.model'

export default interface ICartItem {
	product: IProduct;
	color: IColor;
	size: ISize;
	quantity: number;
}
