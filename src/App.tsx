import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Auth, Home, ProductDetail } from './pages';
import NavbarMobile from './components/navbar/NavbarMobile';
import Navbar from './components/navbar/Navbar';
import ResetPassword from './pages/auth/recoverypassword/ResetPassword';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Cart from './pages/cart/Cart';
import DashboardProducts from './pages/dashboard/Products/DashboardProducts';
import DashboardAddProduct from './pages/dashboard/Products/DashboardAddProduct';
import DashboardColorsList from './pages/dashboard/Colors/DashboardColorsList';
import DashboardAddColor from './pages/dashboard/Colors/DashboardAddColor';
import DashboardSizesList from './pages/dashboard/Sizes/DashboardSizesList';
import DashboardCategoriesList from './pages/dashboard/Categories/DashboardCategoriesList';
import DashboardUsersList from './pages/dashboard/Users/DashboardUsersList';
import LowStockDashboard from './pages/dashboard/LowStock/LowStockDashboard';
import DashboardAddSize from './pages/dashboard/Sizes/DashboardAddSize';
import DashboardAddCategory from './pages/dashboard/Categories/DashboardAddCategory';
import DashboardBrandsList from './pages/dashboard/Brands/DashboardBrandsList';
import DashboardAddBrand from './pages/dashboard/Brands/DashboardAddBrand';
import PaymentFinished from './pages/paymentSuccess/PaymentFinished';
import Profile from './pages/profile/Profile';
import Reports from './pages/dashboard/Reports/Reports';
import SalesList from './pages/dashboard/Sales/SalesList';
import NewSale from './pages/dashboard/Sales/NewSale';

function DashboardDefaultRedirect() {
  const sessionData = JSON.parse(localStorage.getItem('user') || 'null');
  const role = sessionData?.role ?? '';
  return <Navigate to={role === 'SELLER' ? 'sales' : 'products'} replace />;
}

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
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardDefaultRedirect />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="add-product" element={<DashboardAddProduct />} />
          <Route path="low-stock" element={<LowStockDashboard />} />
          <Route path="colors" element={<DashboardColorsList />} />
          <Route path="add-color" element={<DashboardAddColor />} />
          <Route path="sizes" element={<DashboardSizesList />} />
          <Route path="add-size" element={<DashboardAddSize />} />
          <Route path="categories" element={<DashboardCategoriesList />} />
          <Route path="add-category" element={<DashboardAddCategory />} />
          <Route path="brands" element={<DashboardBrandsList />} />
          <Route path="add-brand" element={<DashboardAddBrand />} />
          <Route path="users" element={<DashboardUsersList />} />
          <Route path="reports" element={<Reports />} />
          <Route path="sales" element={<SalesList />} />
          <Route path="sales/new" element={<NewSale />} />
        </Route>
        <Route path="/PaymentFinished" element={<PaymentFinished />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      <NavbarMobile />
    </Router>
  );
}

export default App;
