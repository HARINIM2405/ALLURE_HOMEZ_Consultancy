import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Enquiry from "./pages/Enquiry.jsx";
import Login from "./pages/Login.jsx";
import Shop from "./pages/Shop.jsx";
import GoogleAuthCallback from "./pages/GoogleAuthCallback.jsx";
import ProductDetail from './pages/ProductDetail.jsx'; 
import Dashboard from './admin/Dashboard';
import Clients from './admin/Clients';
import Workers from './admin/Workers';
import Stock from './admin/Stock';
import Enquiriespage from './admin/Enquiriespage.jsx';
import Portfoliopage from './admin/Portfoliopage.jsx';
import Checkout from './pages/Checkout';

// Import Order and Product admin components (create these files)
import Order from './admin/Order.jsx';
import Product from './admin/Product.jsx';

const clientId = '27923803435-ga0mh83oo23huk3pojpoe4km427vlqhi.apps.googleusercontent.com';

// Handles layout: Navbar or Sidebar
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Public routes get Navbar */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />

      
        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={<Sidebar />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="workers" element={<Workers />} />
          <Route path="stock" element={<Stock />} />
          <Route path="order" element={<Order />} />            
          <Route path="product" element={<Product />} />       
          <Route path="enquiriespage" element={<Enquiriespage />} />
          <Route path="portfoliopage" element={<Portfoliopage />} />
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
