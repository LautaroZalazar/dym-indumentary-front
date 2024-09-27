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
				body: { roleId: data },
				headers: AUTH_HEADERS,
			}),
		}),
		fetchAdminProducts: builder.query<
			any,
			{
				limit?: number;
				page?: number;
				stock?: boolean;
				isActive?: boolean;
				sort?: string;
				name?: string;
			}
		>({
			query: ({ limit, page, stock, isActive, sort, name }) => {
				const params = new URLSearchParams();
				if (limit !== undefined) params.append('limit', String(limit));
				if (page !== undefined) params.append('page', String(page));
				if (name !== undefined) params.append('productName', name);
				if (sort !== undefined) params.append('sort', sort);
				if (isActive !== undefined)
					params.append('isActive', String(isActive));
				if (stock !== undefined) params.append('stock', String(stock));
				return {
					url: `/v1/product?${params.toString()}`,
					credentials: 'include',
					method: 'GET',
					headers: AUTH_HEADERS,
				};
			},
		}),
		fecthAllAdminUsers: builder.query<
			any,
			{
				limit?: number;
				page?: number;
				isActive?: boolean;
				name?: string;
				role?: string;
				newsletter?: boolean
				
			}
		>({
			query: ({ limit, page, isActive, name, role, newsletter }) => {
				const params = new URLSearchParams();
				if (limit !== undefined) params.append('limit', String(limit));
				if (page !== undefined) params.append('page', String(page));
				if (name !== undefined) params.append('productName', name);
				if (role !== undefined) params.append('role', role);
				if (isActive !== undefined)
					params.append('isActive', String(isActive));
				if (newsletter !== undefined)
					params.append('newsletter', String(newsletter));
				return {
					url: `/v1/admin/user?${params.toString()}`,
					method: 'GET',
					headers: AUTH_HEADERS,
				};
			},
		}),
	}),
});

export const {
	useCreateProductMutation,
	useUpdateProductMutation,
	useUpdateUserMutation,
	useFetchAdminProductsQuery,
	useFecthAllAdminUsersQuery,
} = adminSlice;
