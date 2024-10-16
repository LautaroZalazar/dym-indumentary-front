import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth, Home, ProductDetail } from './pages';
import NavbarMobile from './components/navbar/NavbarMobile';
import Navbar from './components/navbar/Navbar';
import ResetPassword from './pages/auth/recoverypassword/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Cart from './pages/cart/Cart';
import DashboardProducts from './pages/dashboard/Products/DashboardProducts';
import DashboardAddProduct from './pages/dashboard/Products/DashboardAddProduct';
import DashboardColorsList from './pages/dashboard/Colors/DashboardColorsList';
import DashboardAddColor from './pages/dashboard/Colors/DashboardAddColor';
import DashboardSizesList from './pages/dashboard/Sizes/DashboardSizesList';
import DashboardCategoriesList from './pages/dashboard/Categories/DashboardCategoriesList';
import DashboardUsersList from './pages/dashboard/Users/DashboardUsersList';
import DashboardAddSize from './pages/dashboard/Sizes/DashboardAddSize';
import DashboardAddCategory from './pages/dashboard/Categories/DashboardAddCategory';
import DashboardBrandsList from './pages/dashboard/Brands/DashboardBrandsList';
import DashboardAddBrand from './pages/dashboard/Brands/DashboardAddBrand';
import PaymentFinished from './pages/paymentSuccess/PaymentFinished';
import Profile from './pages/profile/Profile';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const checkSessionExpiration = () => {
      const sessionData = JSON.parse(localStorage.getItem("user") || "null");

      if (sessionData) {
        const currentTime = new Date().getTime();

        if (currentTime > sessionData.expiryTime) {
          localStorage.removeItem("user");
        }
      }
    };

    checkSessionExpiration();

    const interval = setInterval(checkSessionExpiration, 180000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/detail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/PaymentFinished" element={<PaymentFinished />} />
        <Route path="/dashboard-products" element={<DashboardProducts />} />
        <Route path="/dashboard-add-product" element={<DashboardAddProduct />} />
        <Route path="/dashboard-colors" element={<DashboardColorsList />} />
        <Route path="/dashboard-add-color" element={<DashboardAddColor />} />
        <Route path="/dashboard-sizes" element={<DashboardSizesList />} />
        <Route path="/dashboard-add-size" element={<DashboardAddSize />} />
        <Route path="/dashboard-categories" element={<DashboardCategoriesList />} />
        <Route path="/dashboard-add-category" element={<DashboardAddCategory />} />
        <Route path="/dashboard-brands" element={<DashboardBrandsList />} />
        <Route path="/dashboard-add-brand" element={<DashboardAddBrand />} />
        <Route path="/dashboard-users" element={<DashboardUsersList />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      <NavbarMobile />
    </Router>
  );
}

export default App;
