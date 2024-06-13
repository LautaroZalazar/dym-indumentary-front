import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userSlice } from './slices/user.slice';
import { productSlice } from './slices/product.slice';
import { authSlice } from './slices/auth.slice';
import { cartSlice } from './slices/cart.slice';

export const store = configureStore({
	reducer: {
		[userSlice.reducerPath]: userSlice.reducer,
		[productSlice.reducerPath]: productSlice.reducer,
		[authSlice.reducerPath]: authSlice.reducer,
		[cartSlice.reducerPath]: cartSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			userSlice.middleware,
			productSlice.middleware,
			authSlice.middleware,
			cartSlice.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
