import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_BACK_URL;

const getAuthHeaders = () => {
	const raw = localStorage.getItem('user');
	const token = raw ? JSON.parse(raw)?.user?.token : '';
	return {
		'Content-Type': 'application/json; charset=UTF-8',
		Authorization: `Bearer ${token}`,
	};
};

export const salesSlice = createApi({
	reducerPath: 'salesSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	tagTypes: ['Sales'],
	endpoints: (builder) => ({
		fetchSales: builder.query<any[], void>({
			query: () => ({
				url: '/v1/sale',
				method: 'GET',
				headers: getAuthHeaders(),
			}),
			providesTags: ['Sales'],
		}),

		fetchSaleById: builder.query<any, string>({
			query: (id) => ({
				url: `/v1/sale/${id}`,
				method: 'GET',
				headers: getAuthHeaders(),
			}),
		}),

		createSale: builder.mutation<any, any>({
			query: (data) => ({
				url: '/v1/sale',
				method: 'POST',
				body: data,
				headers: getAuthHeaders(),
			}),
			invalidatesTags: ['Sales'],
		}),

		searchProducts: builder.query<any[], string>({
			query: (q) => ({
				url: `/v1/sale/search/products?q=${encodeURIComponent(q)}`,
				method: 'GET',
				headers: getAuthHeaders(),
			}),
		}),

		searchUsers: builder.query<any[], string>({
			query: (q) => ({
				url: `/v1/sale/search/users?q=${encodeURIComponent(q)}`,
				method: 'GET',
				headers: getAuthHeaders(),
			}),
		}),

		createCustomer: builder.mutation<any, { name: string; email: string; phone: string }>({
			query: (data) => ({
				url: '/v1/sale/customer',
				method: 'POST',
				body: data,
				headers: getAuthHeaders(),
			}),
		}),
	}),
});

export const {
	useFetchSalesQuery,
	useFetchSaleByIdQuery,
	useCreateSaleMutation,
	useSearchProductsQuery,
	useSearchUsersQuery,
	useCreateCustomerMutation,
} = salesSlice;
