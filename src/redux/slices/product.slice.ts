import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS, COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const productSlice = createApi({
    reducerPath: 'productSlice',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        fetchProducts: builder.query({
            query: () => ({
                url: '/v1/product',
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

        createProduct: builder.mutation({
            query: (data) => ({
                url: '/v1/product',
                method: 'POST',
                body: data,
                headers: AUTH_HEADERS,
            }),
        }),

        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/v1/product`,
                method: 'PUT',
                body: data,
                headers: AUTH_HEADERS,
            }),
        }),
    }),
})

export const { useFetchProductsQuery, useFetchProductQuery, useCreateProductMutation, useUpdateProductMutation } = productSlice;