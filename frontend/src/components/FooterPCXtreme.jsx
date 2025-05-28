import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FooterPCXtreme() {
  const navigate = useNavigate();
  if (typeof window !== 'undefined' && localStorage.getItem('jwt')) {
    return null;
  }
  return (
    <footer style={{ background: 'linear-gradient(90deg, #111827 60%, #1976d2 100%)', color: '#fff', padding: '48px 0 24px 0', marginTop: 48 }}>
      <div className="container-xl">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 text-center">
            <h2 className="fw-bold mb-2" style={{ fontSize: 36, letterSpacing: 1 }}>Únete Gratis</h2>
            <p style={{ color: '#c9e0ff', fontSize: 18, marginBottom: 32 }}>
              Regístrate para guardar tus productos favoritos, recibir ofertas exclusivas y recomendaciones personalizadas.
            </p>
            <div className="row gy-3 gx-4 mb-4 justify-content-center">
              <div className="col-12 col-sm-6">
                <button
                  className="btn w-100 fw-bold promo-btn"
                  style={{ color: '#1976d2', minHeight: 48, borderRadius: 24, fontSize: 17, boxShadow: '0 2px 16px rgba(25,118,210,0.07)' }}
                  onClick={() => navigate('/register')}
                  onMouseOver={e => { e.currentTarget.style.background = '#1976d2'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1976d2'; }}
                >
                  <span role="img" aria-label="user">👤</span> Regístrate
                </button>
              </div>
              <div className="col-12 col-sm-6">
                <button
                  className="btn w-100 fw-bold promo-btn"
                  style={{ color: '#1976d2', minHeight: 48, borderRadius: 24, fontSize: 17, boxShadow: '0 2px 16px rgba(25,118,210,0.07)' }}
                  onClick={() => navigate('/login')}
                  onMouseOver={e => { e.currentTarget.style.background = '#1976d2'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1976d2'; }}
                >
                  <span role="img" aria-label="login">🔑</span> Inicia sesión
                </button>
              </div>
            </div>
            <div style={{ color: '#c9e0ff', fontSize: 16, marginTop: 16 }}>
              ¿Ya tienes cuenta?{' '}
              <a onClick={() => navigate('/login')} style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Inicia sesión</a>
            </div>
            <div style={{ color: '#b1c2e7', fontSize: 13, marginTop: 32, textAlign: 'center' }}>
              © {new Date().getFullYear()} PCXtreme. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
