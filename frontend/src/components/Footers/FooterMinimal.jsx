import React from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FooterMinimal() {
  return (
    <footer style={{ background: 'linear-gradient(90deg, #111827 60%, #1976d2 100%)', color: '#fff', fontSize: 13, padding: '10px 0', width: '100%', borderTop: '1px solid #fff' }}>
      <Container fluid className="px-0">
        <div className="container">
          <div className="row align-items-center flex-wrap" style={{ minHeight: 32 }}>
            <div className="col d-flex align-items-center flex-wrap gap-2" style={{ gap: 10 }}>
              <span>© {new Date().getFullYear()} PCXtreme.</span>
              <a href="/about" className="ms-2 text-white text-decoration-none" style={{ opacity: 0.8 }}>About</a>
              <a href="/privacy" className="ms-2 text-white text-decoration-none" style={{ opacity: 0.8 }}>Privacy</a>
              <a href="/terms" className="ms-2 text-white text-decoration-none" style={{ opacity: 0.8 }}>Terms</a>
            </div>
            <div className="col-auto d-flex align-items-center gap-3" style={{ gap: 12 }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white" style={{ opacity: 0.85 }}><i className="bi bi-twitter" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white" style={{ opacity: 0.85 }}><i className="bi bi-instagram" /></a>
              <a href="https://facebook.com" rel="noopener noreferrer" className="text-white" style={{ opacity: 0.85 }}><i className="bi bi-facebook" /></a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
