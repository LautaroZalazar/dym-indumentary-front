import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const adminSlice = createApi({
	reducerPath: 'adminSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({

		createProduct: builder.mutation({
			query: (data) => ({
				url: '/v1/admin/product',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),

		updateProduct: builder.mutation({
			query: ({ id, data }) => ({
				url: `/v1/admin/product/${id}`,
				method: 'PUT',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
		updateUser: builder.mutation({
			query: ({ id, data }) => ({
				url: `/v1/admin/user?userId=${id}`,
				method: 'PATCH',
				body: {roleId: data},
				headers: AUTH_HEADERS,
			}),
		}),
        
	}),
});

export const {
	useCreateProductMutation,
	useUpdateProductMutation,
    useUpdateUserMutation,
} = adminSlice;