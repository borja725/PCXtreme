import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { getToken } from '../utils/auth';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetch('http://localhost:8000/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar el carrito');
        setLoading(false);
      });
  }, [token, navigate]);

  const handleRemove = productId => {
    fetch('http://localhost:8000/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId })
    })
      .then(res => res.json())
      .then(data => setCart(data));
  };

  const handleClear = () => {
    fetch('http://localhost:8000/api/cart/clear', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCart(data));
  };

  const handleQty = (productId, qty) => {
    fetch('http://localhost:8000/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, qty })
    })
      .then(res => res.json())
      .then(data => setCart(data));
  };

  if (!token) return null;
  if (loading) return <div className="w-100 d-flex justify-content-center align-items-center" style={{minHeight:300}}><Spinner animation="border" /></div>;

  return (
    <Container className="py-4" style={{maxWidth: 1400}}>
      <Row>
        <Col md={8}>
          <Card className="mb-4 p-3">
            <h3 className="mb-3">Mi cesta</h3>
            {cart && cart.items && cart.items.length === 0 && (
              <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Carrito vacío" style={{width: 90, opacity: 0.5, marginBottom: 24}} />
                <h4 className="fw-bold mb-2">No hay productos en tu cesta</h4>
                <div className="mb-3 text-muted">¡Échale un vistazo a nuestros productos!</div>
                <Button variant="warning" size="lg" className="fw-bold px-4" onClick={() => navigate('/')}>
                  Ver productos
                </Button>
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {cart && cart.items && cart.items.map(item => (
              <Row key={item.product.id} className="align-items-center border-bottom py-3 g-0">
                <Col xs={2} className="text-center">
                  <img src={item.product.image} alt={item.product.name} style={{maxWidth: '75px', maxHeight: '75px', objectFit:'contain'}} />
                </Col>
                <Col xs={4}>
                  <div className="fw-bold">{item.product.name}</div>
                  <div className="text-muted small">{item.product.category}</div>
                  <div className="text-success small">Stock: {item.product.stock}</div>
                </Col>
                <Col xs={2} className="fw-bold">{item.product.price.toFixed(2)}€</Col>
                <Col xs={2} className="d-flex align-items-center gap-2">
                  <Button variant="outline-secondary" size="sm" onClick={() => handleQty(item.product.id, item.qty-1)} disabled={item.qty <= 1}>-</Button>
                  <span className="mx-2">{item.qty}</span>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleQty(item.product.id, item.qty+1)} disabled={item.qty >= item.product.stock}>+</Button>
                </Col>
                <Col xs={2} className="text-end">
                  <Button variant="outline-danger" size="sm" onClick={() => handleRemove(item.product.id)}>
                    Eliminar
                  </Button>
                </Col>
              </Row>
            ))}
            {cart && cart.items && cart.items.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button variant="outline-danger" onClick={handleClear}>Vaciar cesta</Button>
                <div className="fw-bold fs-5">Total: {cart.total.toFixed(2)} €</div>
              </div>
            )}
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 mb-4">
            <h5 className="mb-3">Resumen</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal artículos</span>
              <span>{cart ? cart.total.toFixed(2) : '0.00'} €</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Impuestos incluidos</span>
              <span>✔</span>
            </div>
            <Button variant="warning" className="w-100 mt-3 fw-bold">Realizar pedido</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
