import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IFilterState } from './models/filter-state.interface'

const initialState: IFilterState = {
	productType: [],
	gender: [],
	brand: [],
	size: [],
	sort: 'Todos los productos',
};

interface ToggleFilterPayload {
	category: keyof Omit<IFilterState, 'sort'>;
	value: string;
}

const filterSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		toggleFilter: (state, action: PayloadAction<ToggleFilterPayload>) => {
			const { category, value } = action.payload;
			const index = state[category].indexOf(value);
			if (index >= 0) {
				state[category].splice(index, 1);
			} else {
				state[category].push(value);
			}
		},
		setSort: (state, action: PayloadAction<string>) => {
			state.sort = action.payload;
		},
		clearFilters: (state) => {
			state.productType = [];
			state.gender = [];
			state.brand = [];
			state.size = [];
			state.sort = 'Todos los productos';
		},
	},
});

export const { toggleFilter, setSort, clearFilters } = filterSlice.actions;

export const selectFilters = (state: RootState) => state.filters;

export default filterSlice.reducer;
