import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const productSlice = createApi({
	reducerPath: 'productSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		fetchProducts: builder.query<any, { limit?: number; page?: number, name?: string }>({
			query: ({ limit, page, name }) => ({
				url: `/v1/product?limit=${limit}&page=${page}&${name}`,
				credentials: 'include',
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
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

export const {
	useFetchProductsQuery,
	useFetchProductQuery,
} = productSlice;
