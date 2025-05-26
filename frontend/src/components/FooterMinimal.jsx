import React from 'react';
import { Container } from '@mui/material';
export default function FooterMinimal() {
  return (
    <footer style={{ background: 'linear-gradient(90deg, #111827 60%, #1976d2 100%)', color: '#fff', fontSize: 13, padding: '10px 0', width: '100%', borderTop: '1px solid #fff' }}>
      <Container maxWidth="xl" disableGutters>
      <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ minHeight: 32 }}>
        <div className="d-flex align-items-center gap-2" style={{ gap: 10 }}>
          <span>© {new Date().getFullYear()} PCXtreme.</span>
          <a href="/about" style={{ color: '#fff', opacity: 0.8, marginLeft: 8, textDecoration: 'none' }}>About</a>
          <a href="/privacy" style={{ color: '#fff', opacity: 0.8, marginLeft: 8, textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: '#fff', opacity: 0.8, marginLeft: 8, textDecoration: 'none' }}>Terms</a>
        </div>
        <div className="d-flex align-items-center gap-3" style={{ gap: 12 }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.85 }}><i className="bi bi-twitter" /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.85 }}><i className="bi bi-instagram" /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', opacity: 0.85 }}><i className="bi bi-facebook" /></a>
        </div>
      </div>
      </Container>
    </footer>
  );
}
