import React, { useState, useEffect } from 'react';
import { Row, Alert, Spinner } from 'react-bootstrap';
import { Container } from '@mui/material';
import CarruselDestacado from '../Carrusel/CarruselDestacado';
import ListaProductosGenerica from './ListaProductosGenerica';
import BannerDoble from '../PromoBanner/BannerDoble';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_URL_API}/api/productos?categoria=PYPC&subcategoria=Procesador`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then(data => {
        let productosAleatorios = [];
        if (Array.isArray(data)) {
          const copia = [...data];
          for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
          }
          productosAleatorios = copia.slice(0, 6);
        }
        setProductos(productosAleatorios);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setProductos([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <CarruselDestacado />
      <Container maxWidth="xl" disableGutters>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="g-4">
          <ListaProductosGenerica
            categoria="PYPC"
            subcategoria="Procesador"
            titulo="¡Procesadores que te podrían interesar!"
            numProductos={6}
            verMasRuta="/productos/PYPC/Procesador"
          />
        </Row>
        <Row className="g-4">
          <ListaProductosGenerica
            categoria="PYPC"
            subcategoria="Placa Base"
            titulo="¡Placas base que te podrían interesar!"
            numProductos={6}
            verMasRuta="/productos/PYPC/Placa%20Base"
          />
        </Row>
        <Row className="g-4">
          <ListaProductosGenerica
            categoria="PYPC"
            subcategoria="Tarjeta Gráfica"
            titulo="¡Tarjetas gráficas que te podrían interesar!"
            numProductos={6}
            verMasRuta="/productos/PYPC/Tarjeta%20Gráfica"
          />
        </Row>
        {!loading && productos.length === 0 && (
          <Alert variant="info" className="mt-4">No hay productos disponibles.</Alert>
        )}
        <BannerDoble />
      </Container>
    </>
  );
}

export default ListaProductos;