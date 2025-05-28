import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext/CartContext';
import { Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { Container, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './ListaProductos.module.css';
import ComparadorProductos from '../Comparador/ComparadorProductos';

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

export default function ListaProductosGenerica({ categoria = 'PYPC', subcategoria = '', titulo = '', numProductos = 5, verMasRuta = '' }) {
  const [comparar, setComparar] = useState([]);
  const [showComparador, setShowComparador] = useState(false);

  // Permitir añadir producto desde el buscador del comparador
  useEffect(() => {
    function handleAdd(event) {
      const prod = event.detail;
      setComparar(prev => {
        if (prev.length < 4 && !prev.some(p => p.id === prod.id)) {
          // Abrir modal si ahora hay dos
          if (prev.length === 1) setShowComparador(true);
          return [...prev, prod];
        }
        return prev;
      });
    }
    window.addEventListener('comparar:add', handleAdd);
    return () => window.removeEventListener('comparar:add', handleAdd);
  }, []);

  // Añadir o quitar producto de la lista de comparación
  const toggleComparar = (producto) => {
    setComparar(prev => {
      if (prev.some(p => p.id === producto.id)) {
        return prev.filter(p => p.id !== producto.id);
      } else {
        // Limitar a 4 productos
        if (prev.length >= 4) return prev;
        // Abrir modal solo cuando haya exactamente 1 seleccionado y se añade el segundo
        if (prev.length === 1) setShowComparador(true);
        return [...prev, producto];
      }
    });
  };



  const removeFromComparar = (id) => {
    setComparar(prev => prev.filter(p => p.id !== id));
  };

  const navigate = useNavigate();
  const { setCart, cart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState({});
  const [alert, setAlert] = useState(null);
  // Nuevo estado para feedback tipo toast
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `/api/productos?categoria=${encodeURIComponent(categoria)}`;
    if (subcategoria) {
      url += `&subcategoria=${encodeURIComponent(subcategoria)}`;
    }
    fetch(url)
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
          productosAleatorios = copia.slice(0, numProductos);
        }
        setProductos(productosAleatorios);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setProductos([]);
        setLoading(false);
      });
  }, [categoria, subcategoria, numProductos]);

  return (
    <Container maxWidth="xl" disableGutters>
      <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
        <h2 className="fw-bold" style={{ color: '#1976d2', fontSize: '1.4rem', margin: 0 }}>
          {titulo}
        </h2>
        {verMasRuta && (
          <Link
            to={verMasRuta}
            className="text-decoration-none fw-semibold ver-mas-link"
            style={{
              color: '#00c6fb',
              fontSize: '1rem',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            Ver más <span style={{ fontSize: '1.2em', marginLeft: 2 }}>→</span>
          </Link>
        )}
      </div>
      <style>{`
        .ver-mas-link:hover {
          color: #1976d2 !important;
          text-decoration: underline;
          transform: translateX(2px) scale(1.04);
        }
      `}</style>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Row className="g-4 w-100 m-0" style={{width: '100%'}}>
        {productos.map((prod) => (
          <Col xs={12} sm={6} md={4} lg={3} xl={2} className="d-flex" key={prod.id}>
            <div
              className="card h-100 border-0 shadow-sm product-card position-relative overflow-hidden"
              style={{
                borderRadius: 14,
                background: '#fff',
                minHeight: 370,
                transition: 'box-shadow 0.22s cubic-bezier(.4,2.2,.6,1), transform 0.18s',
                cursor: 'pointer',
              }}
              onClick={e => {
                if (e.target.closest('button')) return;
                navigate(`/producto/${prod.id}`);
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(25,118,210,0.12)';
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = '';
              }}
            >
              {/* Botón comparar */}
              <Button
                variant={comparar.some(p => p.id === prod.id) ? 'primary' : 'outline-primary'}
                size="sm"
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, borderRadius: 20, fontWeight: 600 }}
                onClick={e => {
                  e.stopPropagation();
                  toggleComparar(prod);
                }}
              >
                {comparar.some(p => p.id === prod.id) ? '✓ Comparando' : 'Comparar'}
              </Button>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: '#fff',
                  minHeight: 140,
                  height: 'auto',
                  padding: 18,
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                }}
              >
                <img
                  src={prod.imatgeurl || "/placeholder.png"}
                  alt={prod.nombre}
                  className="img-fluid"
                  height={170}
                  width={170}
                  style={{
                    maxHeight: 170,
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <div className="card-body d-flex flex-column p-3" style={{ height: '65%' }} onClick={() => navigate(`/producto/${prod.id}`)}>
              <div style={{ flex: 1 }}
              onClick={e => {
                if (e.target.closest('button')) return;
                navigate(`/producto/${prod.id}`);
              }}
              >
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: 16, color: '#222' }}>{prod.nombre}</h5>
                <div className="mb-2" style={{ fontSize: 15, color: '#fbc02d', display: 'flex', alignItems: 'center' }}>
                  {(() => {
                    const rating = prod.mediaResenas || 0;
                    const total = 5;
                    const fullStars = Math.floor(rating);
                    const halfStar = rating - fullStars >= 0.5;
                    const emptyStars = total - fullStars - (halfStar ? 1 : 0);
                    return (
                      <>
                        {[...Array(fullStars)].map((_, i) => <span key={"full"+i}>★</span>)}
                        {halfStar && <span key="half">☆</span>}
                        {[...Array(emptyStars)].map((_, i) => <span key={"empty"+i}>☆</span>)}
                        <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>({prod.numResenas || 0})</span>
                      </>
                    );
                  })()}
                </div>
                {prod.precioAnterior && (
                  <div style={{ fontSize: 14, color: '#888', textDecoration: 'line-through' }}>
                    {prod.precioAnterior} €
                  </div>
                )}
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <div className="fw-bold mb-1" style={{ fontSize: 22, color: '#1976d2' }}>
                  {prod.precio} €
                </div>
                <div style={{ fontSize: 13, color: '#2e7d32', marginBottom: 6 }}>
                  Recíbelo el {obtenerTextoEntrega()}
                </div>
                <button
                  className={styles.addButton + " rounded-pill w-100 fw-semibold shadow-sm d-flex align-items-center justify-content-center"}
                  disabled={prod.stock <= 0 || (prod.id && loadingAdd[prod.id])}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoadingAdd(prev => ({...prev, [prod.id]: true}));
                    try {
                      const token = localStorage.getItem('jwt');
                      const headers = { 'Content-Type': 'application/json' };
                      if (token) {
                        headers['Authorization'] = `Bearer ${token}`;
                      }
                      const res = await fetch(`http://localhost:8000/api/cart/add`, {
                        method: 'POST',
                        headers,
                        credentials: 'include',
                        body: JSON.stringify({ productId: prod.id, qty: 1 })
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setAlert({ type: 'danger', message: data.error || 'No se pudo añadir al carrito.' });
                        setToastContent({
                          success: false,
                          message: data.error || 'No se pudo añadir al carrito.'
                        });
                        setShowToast(true);
                      } else {
                        setCart(data);
                        setToastContent({
                          success: true,
                          nombre: prod.nombre,
                          img: prod.imagen || prod.img || '',
                          message: 'Producto añadido al carrito',
                          verCarrito: true
                        });
                        setShowToast(true);
                      }
                    } catch (err) {
                      setAlert({ type: 'danger', message: 'Error de red al añadir al carrito.' });
                      setToastContent({
                        success: false,
                        message: 'Error de red al añadir al carrito.'
                      });
                      setShowToast(true);
                    } finally {
                      setLoadingAdd(prev => ({...prev, [prod.id]: false}));
                      setTimeout(() => setAlert(null), 2500);
                    }
                  }}
                  style={{
                    fontSize: 15,
                    marginTop: 6,
                    padding: '10px 0',
                    transition: 'background 0.18s, box-shadow 0.18s',
                    boxShadow: '0 2px 8px #1976d233',
                  }}
                >
                  {loadingAdd && loadingAdd[prod.id] ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : (
                    <ShoppingCartIcon style={{ fontSize: 21, marginRight: 7, color: '#1976d2' }} />
                  )}
                  <span>
                    {prod.stock > 0 ? 'Añadir' : 'Sin stock'}
                  </span>
                  {/* Badge si ya está en el carrito */}
                  {cart && cart.items && cart.items.some(item => item.product.id === prod.id) && (
                    <span style={{
                      background: '#1976d2',
                      color: '#fff',
                      borderRadius: '50%',
                      fontSize: 12,
                      marginLeft: 8,
                      minWidth: 22,
                      minHeight: 22,
                      padding: '0 7px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      {cart.items.find(item => item.product.id === prod.id)?.qty || 1}
                    </span>
                  )}
                </button>
              </div>
            </div>
            </div>
          </Col>
        ))}
      </Row>
      {!loading && productos.length === 0 && (
        <Alert variant="info" className="mt-4">No hay productos disponibles.</Alert>
      )}
    {/* Botón flotante para abrir comparador */}
    {comparar.length > 0 && (
      <Button
        variant="success"
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1050,
          borderRadius: 30,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          fontWeight: 600,
          padding: '12px 22px',
        }}
        onClick={() => setShowComparador(true)}
      >
        Comparar ({comparar.length})
      </Button>
    )}
    {/* Modal comparador */}
    <ComparadorProductos
      productos={comparar}
      show={showComparador}
      onHide={() => setShowComparador(false)}
      onRemove={removeFromComparar}
      categoria={categoria}
      subcategoria={subcategoria}
    />
      {/* Toast tipo tienda real */}
      <Snackbar
        open={showToast}
        autoHideDuration={2800}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ zIndex: 3000 }}
      >
        <div style={{
          background: toastContent.success ? '#fff' : '#ffebee',
          color: toastContent.success ? '#1976d2' : '#c62828',
          border: toastContent.success ? '2px solid #1976d2' : '2px solid #c62828',
          borderRadius: 18,
          boxShadow: '0 2px 18px #1976d277',
          minWidth: 260,
          maxWidth: 370,
          padding: '18px 16px 14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 13
        }}>
          {toastContent.success ? (
            <CheckCircleIcon sx={{ color: '#43a047', fontSize: 32 }} />
          ) : (
            <ShoppingCartIcon sx={{ color: '#c62828', fontSize: 32 }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
              {toastContent.success ? '¡Añadido al carrito!' : 'No se pudo añadir'}
            </div>
            {toastContent.nombre && (
              <div style={{ fontSize: 15, color: '#222', fontWeight: 500, marginBottom: 1 }}>
                {toastContent.nombre}
              </div>
            )}
            <div style={{ fontSize: 14, color: toastContent.success ? '#1976d2' : '#c62828' }}>
              {toastContent.message}
            </div>
            {toastContent.verCarrito && (
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2 fw-bold rounded-pill"
                onClick={() => { setShowToast(false); navigate('/cart'); }}
                style={{ fontSize: 14, padding: '4px 18px' }}
              >
                Ver carrito
              </Button>
            )}
          </div>
        </div>
      </Snackbar>
    </Container>
  );
}
