import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import FiltrosProductos from "../../components/Filtros/FiltrosProductos";
import styles from '../../components/ListaProductos/ListaProductos.module.css';
import { useCart } from '../../components/CartContext/CartContext';
import Container from '@mui/material/Container';

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




export default function ProductosPorTipo() {
  const navigate = useNavigate();
  const { setCart } = useCart();
  const [loadingAdd, setLoadingAdd] = useState({});
  const [alert, setAlert] = useState(null);
  const PRODUCTOS_POR_PAGINA = 12;
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtros, setFiltros] = useState({
    marcas: [],
    modelos: [],
    precioMin: '',
    precioMax: '',
    stock: false,
    nombre: '',
    orden: ''
  });
  const { categoria, subcategoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let titulo = '';
  if (subcategoria === "Procesador") {
    titulo = "Procesadores";
  } else if (subcategoria === "Placa Base") {
    titulo = "Placas Base";
  } else if (subcategoria === "Tarjeta Gráfica") {
    titulo = "Tarjetas Gráficas";
  } else if (subcategoria === "RAM") {
    titulo = "Memorias RAM";
  } else if (subcategoria === "SSD") {
    titulo = "Discos SSD";
  } else if (subcategoria === "Fuente de Alimentación") {
    titulo = "Fuentes de Alimentación";
  } else if (subcategoria === "Refrigeracion") {
    titulo = "Refrigeraciones";
  } else if (subcategoria === "Caja de Torre") {
    titulo = "Torres de PC";
  } else {
    titulo = "Todos los Componentes";
  }

  const subcat = subcategoria && subcategoria.trim() !== "" ? subcategoria : undefined;

  useEffect(() => {
    const url = `/api/productos?categoria=${encodeURIComponent(categoria)}${subcat ? `&subcategoria=${encodeURIComponent(subcat)}` : ''}`;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setPaginaActual(1); 
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setProductos([]);
        setLoading(false);
      });
  }, [categoria, subcat]);

  const productosFiltrados = useMemo(() => {
    let filtrados = productos;
    if (filtros.marcas.length > 0) filtrados = filtrados.filter(p => filtros.marcas.includes(p.marca));
    if (filtros.modelos.length > 0) filtrados = filtrados.filter(p => filtros.modelos.includes(p.modelo));
    if (filtros.precioMin !== '') filtrados = filtrados.filter(p => p.precio >= Number(filtros.precioMin));
    if (filtros.precioMax !== '') filtrados = filtrados.filter(p => p.precio <= Number(filtros.precioMax));
    if (filtros.stock) filtrados = filtrados.filter(p => p.stock > 0);
    if (filtros.nombre) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()));
    // Shuffle aleatorio Fisher-Yates SIEMPRE
    filtrados = [...filtrados];
    for (let i = filtrados.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtrados[i], filtrados[j]] = [filtrados[j], filtrados[i]];
    }
    if (filtros.orden === 'precio_asc') filtrados = [...filtrados].sort((a,b) => a.precio - b.precio);
    if (filtros.orden === 'precio_desc') filtrados = [...filtrados].sort((a,b) => b.precio - a.precio);
    return filtrados;
  }, [productos, filtros, titulo]);

  return (
    <Container maxWidth="xl" disableGutters>
      <div
        className="mb-4 d-flex align-items-center"
        style={{
          background: 'linear-gradient(90deg, #e3f2fd 0%, #e0f0ff 50%, #1976d2 100%)',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          padding: '12px 38px',
          margin: '0 0 30px 0',
          width: '100%',
          maxWidth: '100%',
          minHeight: 56,
          boxShadow: '0 4px 18px 0 rgba(25,118,210,0.10)',
          border: '1.5px solid #e3e6ee',
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        <h2
          className="fw-bold text-center"
          style={{
            fontSize: '2.2rem',
            margin: 0,
            color: '#134ca7',
            letterSpacing: 1.5,
            textShadow: '0 2px 12px rgba(25, 118, 210, 0.12)',
            lineHeight: 1.18,
            zIndex: 2,
            width: '100%',
            fontWeight: 800,
            textTransform: 'capitalize',
            background: 'none',
            WebkitBackgroundClip: 'unset',
            WebkitTextFillColor: 'unset'
          }}
        >
          {titulo}
        </h2>
      </div>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col xs={12} md={3} lg={3} xl={2} className="mb-4">
          <FiltrosProductos productos={productos} filtros={filtros} setFiltros={setFiltros} mostrarModelos={titulo !== "Todos los Componentes"} />
        </Col>
        <Col xs={12} md={9} lg={9} xl={10}>
          <Row className="g-4">
            {productosFiltrados
              .slice((paginaActual - 1) * PRODUCTOS_POR_PAGINA, paginaActual * PRODUCTOS_POR_PAGINA)
              .map((prod) => (
                <Col xs={12} md={6} lg={4} xl={3} key={prod.id}>
          <div
          className={styles.productCardAnim + " card h-100 border-0 shadow-sm product-card position-relative overflow-hidden"}
          style={{
            borderRadius: 14,
            background: '#fff',
            minHeight: 370,
            transition: 'box-shadow 0.22s cubic-bezier(.4,2.2,.6,1), transform 0.18s',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/producto/${prod.id}`)}
        >
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
          <div className="card-body d-flex flex-column p-3" style={{height: '65%'}}>
            <div style={{ flex: 1 }}>
              <h5 className="card-title fw-semibold mb-1" style={{ fontSize: 16, color: '#222' }}>{prod.nombre}</h5>
              <div className="mb-2" style={{ fontSize: 15, color: '#fbc02d' }}>
                <span>★★★★★</span>
                <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>(0)</span>
              </div>
              {prod.precioAnterior && (
                <div style={{ fontSize: 14, color: '#888', textDecoration: 'line-through' }}>
                  {Number(prod.precioAnterior).toFixed(2)} €
                </div>
              )}
            </div>
            <div style={{ marginTop: 'auto', width: '100%' }}>
              <div className="fw-bold mb-1" style={{ fontSize: 22, color: '#1976d2' }}>
                {Number(prod.precio).toFixed(2)} €
              </div>
              <div style={{ fontSize: 13, color: '#2e7d32', marginBottom: 6 }}>
                Recíbelo el {obtenerTextoEntrega()}
              </div>
              <button
                className={styles.addButton + " rounded-pill w-100 fw-semibold shadow-sm"}
                disabled={prod.stock <= 0 || loadingAdd[prod.id]}
                onClick={async (e) => {
                  e.stopPropagation();
                  setLoadingAdd(prev => ({ ...prev, [prod.id]: true }));
                  try {
                    const token = localStorage.getItem('jwt');
                    const headers = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    const res = await fetch(`http://localhost:8000/api/cart/add`, {
                      method: 'POST',
                      headers,
                      credentials: 'include',
                      body: JSON.stringify({ productId: prod.id, qty: 1 })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setAlert({ type: 'danger', message: data.error || 'No se pudo añadir al carrito.' });
                    } else {
                      setCart(data);
                    }
                  } catch (err) {
                    setAlert({ type: 'danger', message: 'Error de red al añadir al carrito.' });
                  } finally {
                    setLoadingAdd(prev => ({ ...prev, [prod.id]: false }));
                    setTimeout(() => setAlert(null), 2500);
                  }
                }}
                style={{
                  fontSize: 15,
                  marginTop: 6,
                  padding: '10px 0',
                }}
              >
                {loadingAdd[prod.id] ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {prod.stock > 0 ? 'Añadir' : 'Sin stock'}
              </button>
            </div>
          </div>
        </div>
        </Col>
        ))}
       </Row>
      {alert && <Alert variant={alert.type} className="mt-3">{alert.message}</Alert>}
      {!loading && productosFiltrados.length > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          <nav>
            <ul className="pagination pagination-lg mb-0">
              <li className={`page-item${paginaActual === 1 ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(p => Math.max(1, p - 1))}>&laquo;</button>
              </li>
              {Array.from({ length: Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) }, (_, i) => (
                <li key={i+1} className={`page-item${paginaActual === i + 1 ? ' active' : ''}`}>
                  <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item${paginaActual === Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) ? ' disabled' : ''}`}>
                <button className="page-link" onClick={() => setPaginaActual(p => Math.min(Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA), p + 1))}>&raquo;</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {!loading && productosFiltrados.length === 0 && (
        <Alert variant="info" className="mt-4">No hay productos de este tipo.</Alert>
      )}
        </Col>
      </Row>
    </Container>
  );
}
