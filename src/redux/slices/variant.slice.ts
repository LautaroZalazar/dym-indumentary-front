import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS, COMMON_HEADERS } from '../constants/custom-headers';
import {
	IMovementsResponse,
	IPublicVariant,
	IVariant,
	IVariantsResponse,
} from '../../models/variant/variant.model';

const baseUrl = import.meta.env.VITE_BACK_URL;

export interface ICreateVariantPayload {
	productId: string;
	size: string;
	color: string;
	quantity?: number;
	minStock?: number;
	sku?: string;
	barcode?: string;
	priceOverride?: number;
}

export interface IUpdateVariantPayload {
	sku?: string;
	quantity?: number;
	minStock?: number;
	barcode?: string;
	priceOverride?: number;
	isActive?: boolean;
	reason?: string;
}

export const variantSlice = createApi({
	reducerPath: 'variantSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	tagTypes: ['Variants', 'LowStock', 'Movements'],
	endpoints: (builder) => ({
		fetchVariantsByProduct: builder.query<IVariantsResponse, string>({
			query: (productId) => ({
				url: `/v1/admin/variant?productId=${productId}&limit=200`,
				method: 'GET',
				headers: AUTH_HEADERS,
			}),
			providesTags: (_r, _e, productId) => [
				{ type: 'Variants', id: productId },
			],
		}),
		fetchVariantBySku: builder.query<IVariant, string>({
			query: (sku) => ({
				url: `/v1/admin/variant/by-sku/${encodeURIComponent(sku)}`,
				method: 'GET',
				headers: AUTH_HEADERS,
			}),
		}),
		fetchLowStock: builder.query<
			IVariantsResponse,
			{ threshold?: number; page?: number; limit?: number }
		>({
			query: ({ threshold, page = 1, limit = 20 }) => {
				const params = new URLSearchParams();
				if (threshold !== undefined)
					params.append('threshold', String(threshold));
				params.append('page', String(page));
				params.append('limit', String(limit));
				return {
					url: `/v1/admin/variant/low-stock?${params.toString()}`,
					method: 'GET',
					headers: AUTH_HEADERS,
				};
			},
			providesTags: ['LowStock'],
		}),
		fetchMovements: builder.query<
			IMovementsResponse,
			{ variantId: string; page?: number; limit?: number }
		>({
			query: ({ variantId, page = 1, limit = 20 }) => ({
				url: `/v1/admin/variant/${variantId}/movements?page=${page}&limit=${limit}`,
				method: 'GET',
				headers: AUTH_HEADERS,
			}),
			providesTags: (_r, _e, { variantId }) => [
				{ type: 'Movements', id: variantId },
			],
		}),
		suggestSku: builder.mutation<
			{ sku: string },
			{ productId: string; size: string; color: string }
		>({
			query: (body) => ({
				url: `/v1/admin/variant/suggest-sku`,
				method: 'POST',
				body,
				headers: AUTH_HEADERS,
			}),
		}),
		createVariant: builder.mutation<IVariant, ICreateVariantPayload>({
			query: (body) => ({
				url: `/v1/admin/variant`,
				method: 'POST',
				body,
				headers: AUTH_HEADERS,
			}),
			invalidatesTags: (_r, _e, body) => [
				{ type: 'Variants', id: body.productId },
				'LowStock',
			],
		}),
		updateVariant: builder.mutation<
			IVariant,
			{ id: string; productId?: string; data: IUpdateVariantPayload }
		>({
			query: ({ id, data }) => ({
				url: `/v1/admin/variant/${id}`,
				method: 'PUT',
				body: data,
				headers: AUTH_HEADERS,
			}),
			invalidatesTags: (_r, _e, args) => [
				...(args.productId
					? [{ type: 'Variants' as const, id: args.productId }]
					: [{ type: 'Variants' as const, id: 'LIST' }]),
				{ type: 'Movements' as const, id: args.id },
				'LowStock',
			],
		}),
		deleteVariant: builder.mutation<
			{ ok: boolean },
			{ id: string; productId?: string }
		>({
			query: ({ id }) => ({
				url: `/v1/admin/variant/${id}`,
				method: 'DELETE',
				headers: AUTH_HEADERS,
			}),
			invalidatesTags: (_r, _e, args) => [
				...(args.productId
					? [{ type: 'Variants' as const, id: args.productId }]
					: [{ type: 'Variants' as const, id: 'LIST' }]),
				'LowStock',
			],
		}),
		fetchPublicVariants: builder.query<IPublicVariant[], string>({
			query: (productId) => ({
				url: `/v1/product/${productId}/variants`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
	}),
});

export const {
	useFetchVariantsByProductQuery,
	useLazyFetchVariantBySkuQuery,
	useFetchLowStockQuery,
	useFetchMovementsQuery,
	useSuggestSkuMutation,
	useCreateVariantMutation,
	useUpdateVariantMutation,
	useDeleteVariantMutation,
	useFetchPublicVariantsQuery,
} = variantSlice;
