import React from 'react';
import './PromoBanner.css';
import { Container } from '@mui/material';

export default function PromoBanner() {
  return (
    <div
      className="w-100 promo-banner-hero-efecto py-5 mb-3"
      style={{
        background: 'linear-gradient(90deg, #111827 0%, #1976d2 60%, #111827 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <div className="row align-items-center justify-content-center g-4 flex-nowrap">
          <div className="col-12 col-md-6 d-flex flex-row align-items-center justify-content-center mb-4 mb-md-0" style={{ gap: 28 }}>
            <div className="glass-card p-4" style={{
              background: 'rgba(28,40,48,0.72)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 #1976d255',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              maxWidth: '100%',
              width: '100%',

            }}>
              <h1 className="fw-bold mb-2" style={{
                color: '#1fd219',
                fontSize: '2.2rem',
                letterSpacing: 1.2,
                lineHeight: 1.08,
                textShadow: '0 4px 24px #1fd21955, 0 1px 8px #0008',
                fontWeight: 900,
              }}>
                ¡Productos Nvidia!
              </h1>
              <h4 className="mb-4" style={{
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 500,
                textShadow: '0 1px 6px #1976d2cc',
                fontSize: '1.1rem',
              }}>
                Siente la potencia de la tecnología Nvidia con nuestros productos seleccionados.
              </h4>
              <div className="d-flex flex-row align-items-center justify-content-between mt-3" style={{ gap: 16 }}>
                <a href="/productos/PYPC" className="btn btn-lg promo-btn-glass" style={{
                  fontWeight: 700,
                  fontSize: '1.09rem',
                  padding: '12px 30px',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 16px #1fd21955',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#1fd219',
                  border: '2px solid #1fd219',
                  transition: 'all 0.18s',
                }}>
                  Ver productos
                </a>
                <img src="/Nvidia.png" alt="NVIDIA" style={{ width: 68, height: 68, objectFit: 'contain', opacity: 0.97, marginLeft: 8, filter: 'drop-shadow(0 0 8px #1fd21988)' }} />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex flex-row align-items-center justify-content-center" style={{ gap: 28 }}>
            <div className="glass-card p-4" style={{
              background: 'rgba(48,28,28,0.72)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px 0 #ff4d5a55',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.13)',
              maxWidth: '100%',
              width: '100%',
              minWidth: 230,
            }}>
              <h1 className="fw-bold mb-2" style={{
                color: '#ff4d5a',
                fontSize: '2.2rem',
                letterSpacing: 1.2,
                lineHeight: 1.08,
                textShadow: '0 4px 24px #ff4d5a55, 0 1px 8px #0008',
                fontWeight: 900,
              }}>
                ¡Productos AMD!
              </h1>
              <h4 className="mb-4" style={{
                color: 'rgba(255,255,255,0.92)',
                fontWeight: 500,
                textShadow: '0 1px 6px #ff4d5acc',
                fontSize: '1.1rem',
              }}>
                Descubre la potencia y eficiencia de AMD en nuestra tienda.
              </h4>
              <div className="d-flex flex-row align-items-center justify-content-between mt-3" style={{ gap: 16 }}>
                <a href="/productos/PYPC" className="btn btn-lg promo-btn-glass-amd" style={{
                  fontWeight: 700,
                  fontSize: '1.09rem',
                  padding: '12px 30px',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 16px #ff4d5a55',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#ff4d5a',
                  border: '2px solid #ff4d5a',
                  transition: 'all 0.18s',
                }}>
                  Ver productos
                </a>
                <img src="/AMD.png" alt="AMD" style={{ width: 68, height: 68, objectFit: 'contain', opacity: 0.97, marginLeft: 8, filter: 'drop-shadow(0 0 8px #ff4d5a88)' }} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
