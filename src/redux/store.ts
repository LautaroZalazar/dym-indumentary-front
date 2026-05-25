import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userSlice } from './slices/user.slice';
import { productSlice } from './slices/product.slice';
import { authSlice } from './slices/auth.slice';
import { cartSlice } from './slices/cart.slice';
import { catalogsSlice } from './slices/catalogs.silce'
import { adminSlice } from './slices/admin.slice';
import { variantSlice } from './slices/variant.slice';
import { reportsSlice } from './slices/reports.slice';
import { salesSlice } from './slices/sales.slice';
import filterReducer from './slices/filter.silce';

export const store = configureStore({
	reducer: {
		[userSlice.reducerPath]: userSlice.reducer,
		[productSlice.reducerPath]: productSlice.reducer,
		[authSlice.reducerPath]: authSlice.reducer,
		[cartSlice.reducerPath]: cartSlice.reducer,
		[catalogsSlice.reducerPath]: catalogsSlice.reducer,
		[adminSlice.reducerPath]: adminSlice.reducer,
		[variantSlice.reducerPath]: variantSlice.reducer,
		[reportsSlice.reducerPath]: reportsSlice.reducer,
		[salesSlice.reducerPath]: salesSlice.reducer,
		filter: filterReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			userSlice.middleware,
			productSlice.middleware,
			authSlice.middleware,
			cartSlice.middleware,
			catalogsSlice.middleware,
			adminSlice.middleware,
			variantSlice.middleware,
			reportsSlice.middleware,
			salesSlice.middleware,
		),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
