import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import styles from './ListaProductos.module.css';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos')
    .then(res => {
        if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          console.error("La respuesta de la API no es un array:", res.data);
          setProductos([]); 
        }
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      });
  }, []);

  return (
      <Container style={{maxWidth: 1400, paddingLeft: 24, paddingRight: 24}}>
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <Card className="shadow-sm px-4 py-2 mb-2" style={{ borderRadius: 16, background: '#fff', border: 'none' }}>
              <h4 className="fw-bold text-primary mb-0" style={{ letterSpacing: 1 }}>
                ¡Nuestros Procesadores Más Vendidos!
              </h4>
            </Card>
          </Col>
        </Row>
        {alert && (
          <Row className="justify-content-center mb-2">
            <Col xs={12} md={8} lg={6}>
              <div className={`alert alert-${alert.type} fw-semibold text-center`} role="alert">
                {alert.message}
              </div>
            </Col>
          </Row>
        )}
        <Row className="g-4 justify-content-center">
          {productos.map((producto) => (
            <Col key={producto.id} xs={12} sm={6} md={4} lg={3} xl={2} className="d-flex align-items-stretch justify-content-center">
              <Card
                className={`shadow-sm mb-3 w-100 ${styles.productCardAnim}`}
                style={{ maxWidth: 280, borderRadius: 16, border: '1px solid #f3f3f3', cursor: 'pointer', background: '#fff' }}
                onClick={() => console.log("Producto clickeado:", producto.nombre)}
              >
                <Card.Img
                  variant="top"
                  src={producto.imatgeurl || 'https://via.placeholder.com/300x200.png?text=No+Image'}
                  alt={producto.nombre}
                  style={{ height: 180, objectFit: 'contain', borderRadius: '16px 16px 0 0', padding: 8, background: '#f6f6f6' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title as="h6" className="fw-bold mb-1" style={{ minHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', letterSpacing: 0.5, color: '#111827' }}>
                    {producto.nombre || 'Nombre no disponible'}
                  </Card.Title>
                  <div className="mb-1" style={{ color: '#1976d2', fontWeight: 500, fontSize: 15 }}>
                    Categoría: {producto.categoria || 'N/A'}
                  </div>
                  <div className="mb-1" style={{ fontWeight: 900, color: '#1976d2', fontSize: 22, letterSpacing: 1 }}>
                    {typeof producto.precio === 'number' ? `${producto.precio.toFixed(2)}€` : 'Precio no disponible'}
                  </div>
                  <div className="mb-2" style={{ color: producto.stock > 0 ? '#2ecc40' : '#e53935', fontWeight: 600, fontSize: 15 }}>
                    Stock: {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-auto fw-bold" 
                    disabled={producto.stock <= 0 || loadingAdd[producto.id]} 
                    style={{ borderRadius: 8 }}
                    onClick={async () => {
                      setLoadingAdd(prev => ({...prev, [producto.id]: true}));
                      try {
                        const token = localStorage.getItem('jwt');
                        const headers = { 'Content-Type': 'application/json' };
                        if (token) {
                          headers['Authorization'] = `Bearer ${token}`;
                        }
                        const res = await fetch(`http://localhost:8000/api/cart/add`, {
                          method: 'POST',
                          headers,
                          credentials: 'include', // Importante para la sesión
                          body: JSON.stringify({ productId: producto.id, qty: 1 })
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setAlert({ type: 'danger', message: data.error || 'No se pudo añadir al carrito.' });
                        } else {
                          setAlert({ type: 'success', message: data.message || '¡Producto añadido al carrito!' });
                        }
                      } catch (err) {
                        setAlert({ type: 'danger', message: 'Error de red al añadir al carrito.' });
                      } finally {
                        setLoadingAdd(prev => ({...prev, [producto.id]: false}));
                        setTimeout(() => setAlert(null), 2500);
                      }
                    }}
                  >
                    {loadingAdd && loadingAdd[producto.id] ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {producto.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
}

export default ListaProductos;