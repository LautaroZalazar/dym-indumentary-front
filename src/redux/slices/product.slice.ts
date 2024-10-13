import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const productSlice = createApi({
	reducerPath: 'productSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		fetchProducts: builder.query<
			any,
			{
				limit?: number;
				page?: number;
				name?: string;
				isActive?: boolean;
				category?: string[];
				subCategory?: string[];
				brand?: string[];
				size?: string[];
				gender?: string[];
				sort?: string;
			}
		>({
			query: ({
				limit,
				page,
				name,
				isActive,
				category,
				subCategory,
				brand,
				size,
				gender,
				sort,
			}) => {
				const params = new URLSearchParams();
				if (limit !== undefined) params.append('limit', String(limit));
				if (page !== undefined) params.append('page', String(page));
				if (name !== undefined) params.append('productName', name);
				if (sort !== undefined) params.append('sort', sort);
				if (category && category.length > 0)
					params.append('category', JSON.stringify(category));
				if (subCategory && subCategory.length > 0)
					params.append('subCategory', JSON.stringify(subCategory));
				if (brand && brand.length > 0)
					params.append('brand', JSON.stringify(brand));
				if (size && size.length > 0)
					params.append('size', JSON.stringify(size));
				if (gender && gender.length > 0)
					params.append('gender', JSON.stringify(gender));
				if (isActive !== undefined)
					params.append('isActive', String(isActive));
				return {
					url: `/v1/product?${params.toString()}`,
					method: 'GET',
					credentials: 'include',
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
