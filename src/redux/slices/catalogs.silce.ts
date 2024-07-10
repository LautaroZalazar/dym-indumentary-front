import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS, COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const catalogsSlice = createApi({
	reducerPath: 'catalogsSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		fetchCategories: builder.query({
			query: (id) => ({
				url: `/v1/category?id=${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
		createCategory: builder.mutation({
			query: (data) => ({
				url: '/v1/category',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),

		fetchBrands: builder.query({
			query: (id) => ({
				url: `/v1/brand?id=${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
		createbrand: builder.mutation({
			query: (data) => ({
				url: '/v1/brand',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
		fetchColors: builder.query({
			query: (id) => ({
				url: `/v1/color?id=${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
		createColor: builder.mutation({
			query: (data) => ({
				url: '/v1/color',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
		fetchSize: builder.query({
			query: (id) => ({
				url: `/v1/size?id=${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
		createSize: builder.mutation({
			query: (data) => ({
				url: '/v1/size',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
		fetchSubCategories: builder.query({
			query: (id) => ({
				url: `/v1/sub-category?id=${id}`,
				method: 'GET',
				headers: COMMON_HEADERS,
			}),
		}),
		createSubCategories: builder.mutation({
			query: (data) => ({
				url: '/v1/sub-category',
				method: 'POST',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
	}),
});

export const {
	useFetchCategoriesQuery,
	useCreateCategoryMutation,
	useFetchBrandsQuery,
	useCreatebrandMutation,
	useFetchColorsQuery,
	useCreateColorMutation,
	useFetchSizeQuery,
	useCreateSizeMutation,
	useFetchSubCategoriesQuery,
	useCreateSubCategoriesMutation,
} = catalogsSlice;
