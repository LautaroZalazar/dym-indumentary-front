import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth, Home } from './pages';
import NavbarMobile from '../src/components/navbar/navbarMobile/NavbarMobile';
import SubNavbarMobile from '../src/components/navbar/navbarMobile/SubNavbarMobile';
import ResetPassword from './pages/auth/recoverypassword/ResetPassword';

function App() {
	return (
		<Router>
			<SubNavbarMobile />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/reset-password" element={<ResetPassword />} />
				</Routes>
			<NavbarMobile />
		</Router>
	);
}

export default App;
