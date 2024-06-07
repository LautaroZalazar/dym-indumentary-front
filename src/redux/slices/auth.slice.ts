import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS, COMMON_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export const authSlice = createApi({
	reducerPath: 'authSlice',
	baseQuery: fetchBaseQuery({ baseUrl }),
	endpoints: (builder) => ({
		authRecoveryPassword: builder.mutation({
			query: (data) => ({
				url: '/v1/auth/recovery-password',
				method: 'POST',
				body: data,
				headers: COMMON_HEADERS,
			}),
		}),

		authResetPassword: builder.mutation({
			query: (data) => ({
				url: '/v1/auth/recovery-password',
				method: 'PUT',
				body: data,
				headers: AUTH_HEADERS,
			}),
		}),
	}),
});

export const { useAuthRecoveryPasswordMutation, useAuthResetPasswordMutation } =
	authSlice;
