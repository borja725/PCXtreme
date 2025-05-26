import React from 'react';
import './PromoBanner.css';
import { Container } from '@mui/material';

export default function PromoBanner() {
  return (
    <div
      className="w-100 py-5 mb-3"
      style={{
        background: 'linear-gradient(90deg, #111827 60%, #1976d2 100%)',
        color: '#fff',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <div className="row align-items-center justify-content-between flex-column flex-md-row">
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="fw-bold mb-2" style={{ letterSpacing: 1, lineHeight: 1.1 }}>
              ¡Ofertas Flash NVIDIA!
            </h1>
            <h4 className="mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Hasta un <span style={{ color: '#1976d2', fontWeight: 900, fontSize: '1.4em', margin: '0 0.25em' }}>-40%</span> de descuento en productos seleccionados.
            </h4>
            <a href="#" className="btn btn-lg btn-light promo-btn" >
              Ver ofertas
            </a>
          </div>
          <div className="col-md-6 text-md-end text-center">
            <img src="/logo.png" alt="PC Xtreme" style={{ width: 300, height: 250, opacity: 0.85 }} />
          </div>
        </div>
      </Container>
    </div>
  );
}
