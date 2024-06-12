import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS, COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const userSlice = createApi({
	reducerPath: 'userSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		userRegister: builder.mutation({
			query: (data) => ({
				url: '/v1/user',
				method: 'POST',
				body: data,
				headers: COMMON_HEADERS,
			}),
		}),

		userLogin: builder.mutation({
			query: (data) => ({
				url: '/v1/auth/login',
				method: 'POST',
				body: data,
				headers: COMMON_HEADERS,
			}),
		}),
		getUserById: builder.query({
            query: () => ({
                url: '/v1/user/detail',
                method: 'GET',
                headers: AUTH_HEADERS,
            }),
        }),
	}),
});

export const { useUserRegisterMutation, useUserLoginMutation, useGetUserByIdQuery } = userSlice;
