import React from 'react';
import { CartProvider } from '../components/CartContext/CartContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ListaProductos from '../components/ListaProductos/ListaProductos';
import MainHeader from './Header/MainHeader';
import PromoBanner from '../components/PromoBanner/PromoBanner';
import CategoriasMenu from '../components/CategoriasMenu/CategoriasMenu';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Profile from '../Pages/Profile/Profile';
import ChangePassword from '../Pages/Password/ChangePassword';
import CartPage from '../Pages/Cart/CartPage';
import ProductosPorTipo from '../Pages/ProductoTipo/ProductosPorTipo';
import ProductoDetalle from '../Pages/ProductoDetail/ProductoDetalle';
import FooterPCXtreme from '../components/Footers/FooterPCXtreme';
import FooterMinimal from '../components/Footers/FooterMinimal';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="App" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      {!hideHeader && <MainHeader />}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <Routes>
        <Route path="/" element={
          <>
            <PromoBanner />
            <CategoriasMenu />
            <ListaProductos />
            <FooterPCXtreme />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/productos/:categoria/:subcategoria?" element={<ProductosPorTipo />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Routes>
      </div>
      {!hideFooter && <FooterMinimal />}

    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;