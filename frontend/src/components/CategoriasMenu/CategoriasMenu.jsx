import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container } from '@mui/material';
import { Link } from 'react-router-dom';

const categorias = [
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/21/212209/1.jpg",
    label: "Torres PC",
    category: "caja de torre"
  },
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/1066/10665103/1498-amd-ryzen-7-7800x3d-42-ghz-5-ghz-opiniones.jpg",
    label: "Procesadores",
    category: "Procesador"
  },
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/1063/10632846/1381-asus-rog-strix-z790-e-gaming-wifi.jpg",
    label: "Placas Base",
    category: "Placa Base"
  },
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/1063/10639331/1649-gigabyte-geforce-rtx-4080-aero-oc-16gb-gddr6x.jpg",
    label: "Tarjetas Gráficas",
    category: "Tarjeta Gráfica"
  },
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/35/351295/1838-corsair-vengeance-rgb-pro-ddr4-3200-pc4-25600-32gb-2x16gb-cl16.jpg",
    label: "Memoria RAM",
    category: "RAM"
  },
  {
    icon: "https://thumb.pccomponentes.com/w-530-530/articles/1064/10648534/1952-samsung-990-pro-2tb-ssd-pcie-40-nvme-m2.jpg",
    label: "Almacenamiento SSD",
    category: "SSD"
  }
];

export default function CategoriasMenu() {
  return (
    <>
      <Container maxWidth="xl" disableGutters>
        <Row className="justify-content-center g-4 align-items-start">
          {categorias.map((cat, i) => (
            <Col key={cat.label} xs={6} sm={4} md={3} lg={2} className="d-flex flex-column align-items-center">
              <Link
                to={`/productos/PYPC/${cat.category}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="bg-white shadow-sm border border-3 border-primary d-flex flex-column align-items-center justify-content-center mb-2 mt-2 rounded-circle"
                  style={{
                    width: 200,
                    height: 200,
                    transition: 'transform 0.18s cubic-bezier(.4,2.2,.6,1), box-shadow 0.18s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(25,118,210,0.18)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <img
                    src={cat.icon}
                    alt={cat.label}
                    className="img-fluid"
                    style={{ maxWidth: 135, maxHeight: 135, objectFit: 'contain', zIndex: 2 }}
                  />
                </div>
              </Link>
              <span className="fw-semibold text-primary text-center px-2 mt-2" style={{ fontSize: 16, lineHeight: 1 }}>
                {cat.label}
              </span>
            </Col>
          ))}
        </Row>
      </Container>
      <hr className="my-5 border-primary opacity-50" />
    </>
  );
}