import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Container } from '@mui/material';

const categorias = [
  { icon: '/categorias/portatil.png', label: 'Los mejores portátiles' },
  { icon: '/categorias/procesador.png', label: 'Componentes de PC' },
  { icon: '/categorias/monitor.png', label: 'Monitores en tendencia' },
  { icon: '/categorias/televisor.png', label: 'Novedades en televisores' },
  { icon: '/categorias/smartphone.png', label: 'Estrena smartphone' },
  { icon: '/categorias/altavoz.png', label: 'Mejores altavoces' },
];

export default function CategoriasMenu() {
  return (
    <>
    <Container maxWidth="xl" disableGutters>
        <Row className="justify-content-center g-4 align-items-start">
        {categorias.map((cat, i) => (
          <Col key={cat.label} xs={6} sm={4} md={3} lg={2} className="d-flex flex-column align-items-center">
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
              {i >= 3 && (
                <div style={{
                  width: 135,
                  height: 35,
                  marginTop: -10,
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <img
                    src={cat.icon}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: 135,
                      height: 110,
                      objectFit: 'contain',
                      transform: 'scaleY(-1)',
                      opacity: 0.15,
                      filter: 'blur(1px)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 145,
                    height:10,
                    background: 'linear-gradient(to top, rgba(255,255,255,0.9) 80%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              )}
            </div>
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