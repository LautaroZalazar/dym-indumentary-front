interface IRole {
	_id: string;
	name: string;
}

export interface IUserMap {
	_id: string;
	name: string;
	email: string;
	password: string;
	phone: string;
	isActive: boolean;
	newsletter: boolean;
	address: null;
	role: IRole;
	cart: {};
}
