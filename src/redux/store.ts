import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userSlice } from './slices/user.slice';
import { productSlice } from './slices/product.slice';
import { authSlice } from './slices/auth.slice';
import { cartSlice } from './slices/cart.slice';
import { catalogsSlice } from './slices/catalogs.silce'
import { adminSlice } from './slices/admin.slice';
import filterReducer from './slices/filter.silce';

export const store = configureStore({
	reducer: {
		[userSlice.reducerPath]: userSlice.reducer,
		[productSlice.reducerPath]: productSlice.reducer,
		[authSlice.reducerPath]: authSlice.reducer,
		[cartSlice.reducerPath]: cartSlice.reducer,
		[catalogsSlice.reducerPath]: catalogsSlice.reducer,
		[adminSlice.reducerPath]: adminSlice.reducer,
		filter: filterReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			userSlice.middleware,
			productSlice.middleware,
			authSlice.middleware,
			cartSlice.middleware,
			catalogsSlice.middleware,
			adminSlice.middleware
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
