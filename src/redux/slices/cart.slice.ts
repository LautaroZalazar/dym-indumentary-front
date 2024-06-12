import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const cartSlice = createApi({
	reducerPath: 'cartSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		getCart: builder.query({
			query: (id) => ({
				url: `/v1/cart?id=${id}`,
				method: 'GET',
				headers: AUTH_HEADERS,
			}),
		}),

		addProductToCart: builder.mutation({
			query: ({ products, cartId }) => ({
				url: '/v1/cart',
				method: 'POST',
				body: { products, cartId },
				headers: AUTH_HEADERS,
			}),
		}),
		updateProductInCart: builder.mutation({
			query: ({ products, cartId }) => ({
			  url: `/v1/cart`,
			  method: 'PUT',
			  body: {products, cartId},
			  headers: AUTH_HEADERS,
			}),
		  }),
		removeProductFromCart: builder.mutation({
			query: ({ cartId, productId }) => ({
				url: `/v1/cart`,
				method: 'DELETE',
				body: { productId, cartId },
				headers: AUTH_HEADERS,
			}),
		}),
	}),
});
export const { useGetCartQuery, useAddProductToCartMutation, useRemoveProductFromCartMutation, useUpdateProductInCartMutation } = cartSlice;
