import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { useCart } from '../../components/CartContext/CartContext';
import ResenasProducto from '../../components/Reseñas/ResenasProducto';
import ResumenResenasProducto from '../../components/Reseñas/ResumenResenasProducto';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


export default function ProductoDetalle() {

  function RelacionadosAleatorios({ idActual }) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      setLoading(true);
      fetch('/api/productos')
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar el catálogo');
          return res.json();
        })
        .then(data => {
          const otros = data.filter(p => p.id !== idActual);
          for (let i = otros.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otros[i], otros[j]] = [otros[j], otros[i]];
          }
          setProductos(otros.slice(0, 5));
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }, [idActual]);

    if (loading) return <div className="px-2 pb-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
    if (error) return <div className="text-danger px-2 pb-4">Error cargando recomendaciones.</div>;
    if (!productos.length) return <div className="text-secondary px-2 pb-4">No hay recomendaciones por ahora.</div>;

    return (
      <Row className="g-4 w-100 px-2 d-flex justify-content-between">
        {productos.map((rel, idx) => (
          <Col key={rel.id || idx} xs={12} sm={6} md={4} lg={2} className="d-flex">
            <Card
              className="shadow-sm border-0 rounded-4 p-4 w-100 h-100 d-flex flex-column"
              style={{ width: '100%', maxWidth: '100%', minWidth: 0, background: '#fff', transition: 'box-shadow 0.16s', cursor: 'pointer', height: '100%' }}
              onClick={() => window.location.href = `/producto/${rel.id}`}
            >
              <img
                src={rel.imatgeurl || '/noimg.png'}
                alt={rel.nombre}
                className="img-fluid mb-4 rounded"
                style={{ height: 180, objectFit: 'contain', background: '#fafbfc' }}
              />
              <div style={{ flex: 1 }}>
                <div className="fw-bold text-truncate mb-2" title={rel.nombre} style={{ fontSize: 22 }}>{rel.nombre}</div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div className="text-primary fw-semibold mb-2" style={{ fontSize: 26 }}>{Number(rel.precio).toFixed(2)} €</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  const { id } = useParams();
  const { setCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [alertAdd, setAlertAdd] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el producto');
        return res.json();
      })
      .then(data => {
        setProducto(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;
  if (!producto) return null;

  let imagenes = [];
  if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
    imagenes = producto.imagenes;
  } else if (producto.imatgeurl) {
    imagenes = [producto.imatgeurl];
  } else {
    imagenes = ['/noimg.png'];
  }

  return (
    <>
      <div style={{ background: '#f7f8fa', minHeight: '100vh', padding: '40px 0' }}>
        <Container fluid style={{ maxWidth: 1500, padding: '0 32px' }}>
          <Row className="g-5 flex-column flex-lg-row align-items-stretch justify-content-center" style={{ minHeight: 600 }}>
            <Col lg={4} className="d-flex flex-column align-items-center justify-content-center mb-5 mb-lg-0">
              <div className="bg-white d-flex align-items-center justify-content-center rounded-5 shadow-lg position-relative"
                style={{ width: '100%', maxWidth: 480, minHeight: 440, height: 'auto', aspectRatio: '1/1', overflow: 'hidden', border: 'none' }}>
                <img
                  src={imagenes[imgIdx] || '/noimg.png'}
                  alt={producto.nombre}
                  style={{ width: 'auto', height: '80%', maxHeight: 430, maxWidth: '95%', objectFit: 'contain', transition: 'transform 0.18s', cursor: 'zoom-in' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              {imagenes.length > 1 && (
                <div className="d-flex gap-3 mt-4 justify-content-center flex-wrap">
                  {imagenes.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={producto.nombre + ' miniatura ' + (idx + 1)}
                      className={"rounded-3 border " + (imgIdx === idx ? 'border-primary shadow' : 'border-light')}
                      style={{ width: 58, height: 58, objectFit: 'contain', background: '#f8fafd', cursor: 'pointer', borderWidth: 2, transition: 'box-shadow 0.18s' }}
                      onClick={() => setImgIdx(idx)}
                    />
                  ))}
                </div>
              )}
            </Col>
            <Col lg={5} className="d-flex flex-column justify-content-center mb-5 mb-lg-0">
              <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
                <span className="text-secondary fw-semibold" style={{ fontSize: 18 }}>{producto.marca}</span>
                {producto.modelo && <span className="text-secondary small">· {producto.modelo}</span>}
                {producto.tipo && <Badge bg="info" className="ms-2 text-light">{producto.tipo}</Badge>}
              </div>
              <h1 className="fw-bold mb-2" style={{ fontSize: 28, color: '#1976d2' }}>{producto.nombre}</h1>
              <div className="mb-3" style={{ fontSize: 18, color: '#fbc02d', marginTop: 20 }}>
                <ResumenResenasProducto productId={producto.id} />
              </div>
              <div className="mb-4 d-flex align-items-center gap-3">
                {producto.opiniones && <span className="text-primary small">({producto.opiniones} opiniones)</span>}
              </div>
              {producto.descripcion && (
                <div className="mb-4 p-4 bg-light rounded-4 shadow-sm" style={{ fontSize: 18, color: '#222', minHeight: 80 }}>{producto.descripcion}</div>
              )}
              {producto.caracteristicas && Array.isArray(producto.caracteristicas) && producto.caracteristicas.length > 0 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Ficha técnica</h5>
                  <table className="table table-borderless mb-0" style={{ fontSize: 17 }}>
                    <tbody>
                      {producto.caracteristicas.slice(0, 8).map((c, i) => (
                        <tr key={i}>
                          <td className="fw-semibold text-secondary" style={{ width: 160 }}>{c.nombre}</td>
                          <td>{c.valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {producto.experto && (
                <div className="mb-4 p-4 bg-primary bg-opacity-10 border-0 rounded-4 shadow-sm">
                  <div className="fw-bold mb-2 text-primary">Recomendado por nuestro experto</div>
                  <div style={{ fontSize: 16 }}>{producto.experto}</div>
                </div>
              )}
            </Col>
            <Col lg={3} className="d-flex flex-column justify-content-center">
              <Card className="shadow-lg border-0 rounded-5 p-4 sticky-top" style={{ top: 40, zIndex: 2, minWidth: 440, maxWidth: 500, background: '#fff' }}>
                <div className="d-flex align-items-end gap-3 mb-3">
                  <span className="fw-bold" style={{ fontSize: 38, color: '#1976d2' }}>{Number(producto.precio).toFixed(2)} €</span>
                  {producto.precioAnterior && (
                    <span className="text-danger fw-semibold ms-2" style={{ textDecoration: 'line-through', fontSize: 20 }}>{Number(producto.precioAnterior).toFixed(2)} €</span>
                  )}
                  {producto.precioAnterior && (
                    <Badge bg="danger" className="ms-2" style={{ fontSize: 17 }}>-{Math.round((1 - producto.precio / producto.precioAnterior) * 100)}%</Badge>
                  )}
                </div>
                <div className="mb-4">
                  <div className="d-flex flex-column align-items-start gap-2">
                    <div style={{ fontSize: 15, color: '#2e7d32' }}>
                      {producto.stock > 0 ? `📦 Recíbelo a partir del ${(() => {
                        let resultado = new Date();
                        let sumados = 0;
                        while (sumados < 2) {
                          resultado.setDate(resultado.getDate() + 1);
                          if (resultado.getDay() !== 0 && resultado.getDay() !== 6) sumados++;
                        }
                        return resultado.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                      })()}` : 'No disponible para envío inmediato'}
                    </div>
                    <Button
                      className="w-100 fw-bold py-3 fs-5 rounded-4 shadow-sm d-flex align-items-center justify-content-center"
                      style={{ background: '#1976d2', border: 'none', color: '#fff', letterSpacing: 1, fontWeight: 600, gap: 10 }}
                      disabled={producto.stock <= 0 || loadingAdd}
                      onClick={async () => {
                        if (producto.stock <= 0 || loadingAdd) return;
                        setLoadingAdd(true);
                        setAlertAdd(null);
                        try {
                          const res = await fetch('/api/cart/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: producto.id, qty: 1 })
                          });
                          if (!res.ok) throw new Error('No se pudo añadir al carrito');
                          const data = await res.json();
                          setCart(data);
                          setToastContent({
                            success: true,
                            nombre: producto.nombre,
                            message: '¡Producto añadido al carrito!',
                            verCarrito: true
                          });
                          setShowToast(true);
                        } catch (e) {
                          setToastContent({
                            success: false,
                            nombre: producto.nombre,
                            message: e.message || 'Error al añadir al carrito',
                            verCarrito: false
                          });
                          setShowToast(true);
                        } finally {
                          setLoadingAdd(false);
                          setTimeout(() => setAlertAdd(null), 1800);
                        }
                      }}
                    >
                      <ShoppingCartIcon style={{ fontSize: 22, marginRight: 5 }} />
                      {loadingAdd ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                      Añadir al carrito
                    </Button>
                    {producto.stock <= 0 && <div className="text-danger mt-2 fw-semibold">Este producto está agotado.</div>}
                    {alertAdd && <Alert variant={alertAdd.type} className="mt-2 py-2 px-3 small">{alertAdd.msg}</Alert>}
                  </div>
                </div>
                <div className="mb-2 d-flex align-items-center gap-2">
                  <span role="img" aria-label="camion">🚚</span>
                  <b>Envío:</b> <span style={{ color: '#388e3c' }}>Gratis</span>
                  <span className="ms-3" role="img" aria-label="devolucion">↩️</span>
                  <b>Devolución:</b> <span style={{ color: '#388e3c' }}>Gratis 30 días</span>
                </div>
                <div className="mb-2 d-flex align-items-center justify-content-center gap-2">
                  <span role="img" aria-label="garantia">🛡️</span>
                  <b>Garantía:</b> <span style={{ color: '#1976d2' }}>2 años oficial</span>
                </div>
                {producto.servicios && Array.isArray(producto.servicios) && producto.servicios.length > 0 && (
                  <div className="mb-2">
                    <h6 className="fw-bold mb-2">Servicios disponibles</h6>
                    <ul className="list-group list-group-flush">
                      {producto.servicios.map((s, i) => (
                        <li key={i} className="list-group-item px-0 py-1 border-0 small">
                          <input type="checkbox" className="form-check-input me-2" id={"servicio" + i} />
                          <label htmlFor={"servicio" + i}>{s}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
          <ResenasProducto productId={producto.id} />
          <div className="w-100 px-0" style={{ background: '#fff', marginLeft: 0, marginRight: 0, justifyContent: 'space-between' }}>
            <div className="container-fluid py-5 px-0">
              <h2 className="fw-bold mb-4" style={{ fontSize: 28, color: '#1976d2' }}>¡También te podría interesar!</h2>
              {producto.relacionados && Array.isArray(producto.relacionados) && producto.relacionados.length > 0 ? (
                <Row className="g-4 w-100 m-0 justify-content-between">
                  {producto.relacionados.slice(0, 5).map((rel, idx) => (
                    <Col key={rel.id || idx} xs={12} sm={6} md={4} lg={2} className="d-flex">
                      <Card
                        className="shadow-sm border-0 rounded-4 p-4 w-100 h-100 d-flex flex-column"
                        style={{ width: '100%', maxWidth: '100%', minWidth: 0, background: '#fff', transition: 'box-shadow 0.16s', cursor: 'pointer', height: '100%' }}
                        onClick={() => window.location.href = `/producto/${rel.id}`}
                      >
                        <img
                          src={rel.imatgeurl || '/noimg.png'}
                          alt={rel.nombre}
                          className="img-fluid mb-4 rounded"
                          style={{ height: 180, objectFit: 'contain', background: '#fafbfc' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div className="fw-bold text-truncate mb-2" title={rel.nombre} style={{ fontSize: 22 }}>{rel.nombre}</div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                          <div className="text-primary fw-semibold mb-2" style={{ fontSize: 26 }}>{Number(rel.precio).toFixed(2)} €</div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <RelacionadosAleatorios idActual={producto.id} />
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
