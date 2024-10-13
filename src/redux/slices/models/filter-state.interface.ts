export interface IFilterState {
	filter: {
		category: string[];
		subCategory: string[];
		gender: string[];
		brand: string[];
		size: string[];
	  };
	  sort: string;
	  page: number;
}