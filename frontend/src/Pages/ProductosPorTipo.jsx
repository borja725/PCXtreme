import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

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
    titulo = "RAM";
  } else if (subcategoria === "Fuente Alimentacion") {
    titulo = "Fuentes de Alimentacion";
  } else if (subcategoria === "Refrigeracion") {
    titulo = "Refrigeraciones";
  } else if (subcategoria === "Perifericos") {
    titulo = "Perifericos";
  } else if (subcategoria === "Caja") {
    titulo = "Cajas";
  } else {
    titulo = "Todos los Componentes";
  }

  const subcat = subcategoria && subcategoria.trim() !== "" ? subcategoria : undefined;

  useEffect(() => {
    const url = `/api/productos?categoria=${encodeURIComponent(categoria)}${subcat ? `&subcategoria=${encodeURIComponent(subcat)}` : ''}`;
    console.log("URL FETCH:", url);
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setProductos([]);
        setLoading(false);
      });
  }, [categoria, subcat]);

  return (
    <Container className="py-4">
      <h2
        className="mb-4 fw-bold text-center"
        style={{
          fontSize: '2.6rem',
          background: 'linear-gradient(90deg, #1976d2 0%, #00c6fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 24px rgba(25, 118, 210, 0.13)',
          letterSpacing: 1.5,
          animation: 'fadeSlideIn 1s cubic-bezier(.4,2,.6,1)'
        }}
      >
        <span style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #1976d2 0%, #00c6fb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 3px 12px #00c6fb44)'
        }}>{titulo}</span>
        <style>{`
          @keyframes fadeSlideIn {
            0% { opacity: 0; transform: translateY(-28px) scale(.95); }
            60% { opacity: 1; transform: translateY(6px) scale(1.03); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        {productos.map((prod) => (
          <Col xs={12} md={6} lg={4} xl={3} key={prod.id}>
          <div
            className="card h-100 border-0 shadow-sm product-card position-relative overflow-hidden"
            style={{
              borderRadius: 14,
              background: '#fff',
              minHeight: 370,
              transition: 'box-shadow 0.22s cubic-bezier(.4,2.2,.6,1), transform 0.18s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(25,118,210,0.12)';
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.025)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.transform = '';
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                background: '#fff',
                minHeight: 140,
                padding: 18,
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}
            >
              <img
                src={prod.imatgeurl || "/placeholder.png"}
                alt={prod.nombre}
                className="img-fluid"
                height={150}
                width={150}
                style={{
                  maxHeight: 150,
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="card-body d-flex flex-column justify-content-between p-3">
              <div>
                <h5 className="card-title fw-semibold mb-1" style={{ fontSize: 16, color: '#222' }}>{prod.nombre}</h5>
                <div className="mb-2" style={{ fontSize: 15, color: '#fbc02d' }}>
                  <span>★★★★★</span>
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>(0)</span>
                </div>
                {prod.precioAnterior && (
                  <div style={{ fontSize: 14, color: '#888', textDecoration: 'line-through' }}>
                    {prod.precioAnterior} €
                  </div>
                )}
                <div className="fw-bold mb-1" style={{ fontSize: 22, color: '#1976d2' }}>
                  {prod.precio} €
                </div>
                <div style={{ fontSize: 13, color: '#2e7d32', marginBottom: 6 }}>
                  Recíbelo el {obtenerTextoEntrega()}
                </div>
              </div>
              <button
                className="btn btn-primary rounded-pill w-100 fw-semibold shadow-sm"
                style={{
                  fontSize: 15,
                  background: '#1976d2',
                  border: 'none',
                  marginTop: 6,
                  padding: '10px 0'
                }}
              >
                Añadir
              </button>
            </div>
          </div>
        </Col>
        ))}
      </Row>
      {!loading && productos.length === 0 && (
        <Alert variant="info" className="mt-4">No hay productos de este tipo.</Alert>
      )}
    </Container>
  );
}
