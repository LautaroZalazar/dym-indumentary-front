import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterState } from './models/filter-state.interface'

const initialState: IFilterState = {
	filter: {
		category: [],
		subCategory: [],
		gender: [],
		brand: [],
		size: [],
	},
	sort: '',
	page: 1,
};

const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilter: (
			state,
			action: PayloadAction<Partial<IFilterState['filter']>>
		) => {
			state.filter = { ...state.filter, ...action.payload };
		},
		setSort: (state, action: PayloadAction<string>) => {
			state.sort = action.payload;
		},
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		}
	},
});

export const { setFilter, setSort, setPage } = filterSlice.actions;
export default filterSlice.reducer;
