import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const productSlice = createApi({
	reducerPath: 'productSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		fetchProducts: builder.query<
			any,
			{ limit?: number; page?: number; name?: string; isActive?: boolean }
		>({
			query: ({ limit, page, name, isActive }) => {
				const params = new URLSearchParams();
				if (limit !== undefined) params.append('limit', String(limit));
				if (page !== undefined) params.append('page', String(page));
				if (name !== undefined) params.append('productName', name);
				if (isActive !== undefined)
					params.append('isActive', String(isActive));
				return {
					url: `/v1/product?${params.toString()}`,
					credentials: 'include',
					method: 'GET',
					headers: COMMON_HEADERS,
				};
			},
		}),

		fetchProduct: builder.query({
			query: (id) => ({
				url: `/v1/product/${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
	}),
});

export const { useFetchProductsQuery, useFetchProductQuery } = productSlice;
