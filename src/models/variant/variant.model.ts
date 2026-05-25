import { ISize } from '../product/size.model';
import { IColor } from '../product/color.model';

export interface IVariant {
	_id: string;
	sku: string;
	productId: string | { _id: string; name?: string };
	size: ISize | string;
	color: IColor | string;
	quantity: number;
	minStock: number;
	barcode?: string;
	priceOverride?: number;
	isActive: boolean;
	lowStock: boolean;
}

export interface IVariantsResponse {
	totalCount: number;
	variants: IVariant[];
}

export interface IPublicVariant {
	_id: string;
	productId: string | { _id: string; name?: string };
	size: ISize;
	color: IColor;
	quantity: number;
	isActive: boolean;
	lowStock: boolean;
}

export type StockMovementType = 'in' | 'out' | 'adjust';

export interface IStockMovement {
	_id: string;
	variantId: string;
	productId: string;
	type: StockMovementType;
	qtyDelta: number;
	qtyAfter: number;
	reason?: string;
	userId?: string;
	createdAt: string;
}

export interface IMovementsResponse {
	totalCount: number;
	movements: IStockMovement[];
}
