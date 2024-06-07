import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth, Home, ProductDetail } from './pages';
import NavbarMobile from '../src/components/navbar/navbarMobile/NavbarMobile';
import SubNavbarMobile from '../src/components/navbar/navbarMobile/SubNavbarMobile';
import ResetPassword from './pages/auth/recoverypassword/ResetPassword';

function App() {
	return (
		<Router>
			<SubNavbarMobile />
				<Routes>
					<Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
					<Route path="/auth" element={<Auth />} />
					<Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div>Not Found</div>} />
				</Routes>
			<NavbarMobile />
		</Router>
	);
}

export default App;
