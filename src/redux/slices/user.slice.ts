import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			}),
		}),

		userLogin: builder.mutation({
			query: (data) => ({
				url: '/v1/auth/login',
				method: 'POST',
				body: data,
				headers: { 'Content-type': 'application/json; charset=UTF-8' },
			}),
		}),
	}),
});

export const { useUserRegisterMutation, useUserLoginMutation } = userSlice;
