import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ListaProductos from '../components/ListaProductos/ListaProductos';
import MainHeader from './Header/MainHeader';
import PromoBanner from '../components/PromoBanner/PromoBanner';
import CategoriasMenu from '../components/CategoriasMenu/CategoriasMenu';
import Login from '../Pages/Login';
import Register from '../Pages/Register';

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
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;