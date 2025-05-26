import React from 'react';
import { CartProvider } from '../components/CartContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ListaProductos from '../components/ListaProductos/ListaProductos';
import MainHeader from './Header/MainHeader';
import PromoBanner from '../components/PromoBanner/PromoBanner';
import CategoriasMenu from '../components/CategoriasMenu/CategoriasMenu';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Profile from '../Pages/Profile';
import ChangePassword from '../Pages/ChangePassword';
import CartPage from '../Pages/CartPage';
import ProductosPorTipo from '../Pages/ProductosPorTipo';
import FooterPCXtreme from '../components/FooterPCXtreme';
import FooterMinimal from '../components/FooterMinimal';

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="App">
      {!hideHeader && <MainHeader />}
      <Routes>
        <Route path="/" element={
          <>
            <PromoBanner />
            <CategoriasMenu />
            <ListaProductos />
            <FooterPCXtreme />
            <FooterMinimal />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/productos/:categoria/:subcategoria?" element={<ProductosPorTipo />} />
      </Routes>
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