export interface ISessionData {
	user?: { token?: string; _id?: string; email?: string };
	role?: string;
	expiryTime?: number;
}

export const readSession = (): ISessionData | null => {
	try {
		const raw = localStorage.getItem('user');
		if (!raw) return null;
		const data = JSON.parse(raw) as ISessionData;
		if (data.expiryTime && Date.now() > data.expiryTime) return null;
		return data;
	} catch {
		return null;
	}
};

export const isAdmin = (): boolean => readSession()?.role === 'ADMIN';

export const userIconHref = (): string => {
	const session = readSession();
	if (!session) return '/auth';
	return session.role === 'ADMIN' ? '/dashboard' : '/profile';
};
