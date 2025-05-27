import React, { useState, useEffect } from 'react';
import { Row, Alert, Spinner } from 'react-bootstrap';
import { Container } from '@mui/material';
import CarruselDestacado from '../CarruselDestacado';
import ListaProductosGenerica from './ListaProductosGenerica';

function sumarDiasLaborables(fecha, dias) {
  let resultado = new Date(fecha);
  let sumados = 0;
  while (sumados < dias) {
    resultado.setDate(resultado.getDate() + 1);
    if (resultado.getDay() !== 0 && resultado.getDay() !== 6) {
      sumados++;
    }
  }
  return resultado;
}

function obtenerTextoEntrega() {
  const hoy = new Date();
  const entrega = sumarDiasLaborables(hoy, 2);
  return entrega.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/productos?categoria=PYPC&subcategoria=Procesador')
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
    </Container>
    </>
  );
}

export default ListaProductos;