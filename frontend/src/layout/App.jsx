import React from 'react';
import ListaProductos from '../components/ListaProductos/ListaProductos';
import MainHeader from './Header/MainHeader';

function App() {
  return (
    <div className="App">
      <MainHeader />
      <ListaProductos />
    </div>
  );
}

export default App;