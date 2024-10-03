export const COMMON_HEADERS = {
	'Content-Type': 'application/json; charset=UTF-8',
};

const user = (localStorage.getItem('user'));

export const AUTH_HEADERS = {
	'Content-Type': 'application/json; charset=UTF-8',
	'Authorization': `Bearer ${user && JSON.parse(user).user.token}`,
};
