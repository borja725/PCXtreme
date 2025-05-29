import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { getUserName } from '../../utils/auth';

export default function ResenasProducto({ productId }) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [reload, setReload] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('jwt');
  const username = getUserName();
  const isLoggedIn = !!token;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/productos/${productId}/reviews`)
      .then(res => res.json())
      .then(data => {
        setResenas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Error cargando reseñas');
        setLoading(false);
      });
  }, [productId, reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setAlerta(null);
    try {
      const res = await fetch(`/api/productos/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user: username, rating: puntuacion, comment: comentario, createdAt: new Date() })
      });
      const data = await res.json();
      if (!res.ok) {
        setAlerta({ type: 'danger', msg: data.error || 'Error al enviar reseña' });
      } else {
        setAlerta({ type: 'success', msg: '¡Reseña publicada correctamente!' });
        setComentario('');
        setPuntuacion(5);
        setShowModal(false);
        setReload(r => r + 1);
      }
    } catch {
      setAlerta({ type: 'danger', msg: 'Error de red' });
    } finally {
      setEnviando(false);
    }
  };

  const media = resenas.length ? (resenas.reduce((acc, r) => acc + Number(r.rating), 0) / resenas.length).toFixed(2) : null;

  return (
    <div className="mt-4">
      <h4 className="fw-bold mb-3">Reseñas</h4>
      {media && (
        <div className="mb-3 d-flex align-items-center gap-3">
          <span className="fw-semibold" style={{ color: '#fbc02d', fontSize: 28, letterSpacing: 2 }}>
            {'★'.repeat(Math.round(media))}{'☆'.repeat(5 - Math.round(media))}
          </span>
          <span className="ms-2" style={{ fontSize: 18 }}>{media} / 5 <span className="text-muted">({resenas.length} reseñas)</span></span>
        </div>
      )}
      {loading ? <div className="text-secondary">Cargando reseñas...</div> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {!loading && !resenas.length && <div className="text-secondary mb-3">Sin reseñas aún.</div>}
      <div className="mb-4">
        {resenas.map((r, i) => (
          <div key={i} className="d-flex align-items-start gap-3 pb-3 mb-3 border-bottom">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, fontSize: 20, fontWeight: 700 }}>
              {r.user?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="fw-semibold" style={{ fontSize: 16 }}>{r.user}</span>
                <span className="text-warning" style={{ fontSize: 18 }}>{'★'.repeat(Math.round(r.rating))}</span>
                <span className="text-muted" style={{ fontSize: 13 }}>{r.createdAt}</span>
              </div>
              <div style={{ fontSize: 15 }}>{r.comment}</div>
            </div>
          </div>
        ))}
      </div>
      {isLoggedIn ? (
        <div>
          <Button variant="primary" className="mb-3 fw-semibold" style={{ fontSize: 18, borderRadius: 24, padding: '10px 28px' }} onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Publicar reseña
          </Button>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Publicar reseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Puntuación</Form.Label>
                  <Form.Select value={puntuacion} onChange={e => setPuntuacion(Number(e.target.value))} required>
                    {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control as="textarea" value={comentario} onChange={e => setComentario(e.target.value)} required minLength={3} maxLength={500} rows={4} placeholder="Escribe tu opinión sobre el producto..." />
                </Form.Group>
                <Button type="submit" disabled={enviando} variant="primary" className="w-100" style={{ fontSize: 17 }}>{enviando ? 'Enviando...' : 'Publicar reseña'}</Button>
              </Form>
              {alerta && <Alert variant={alerta.type} className="mt-3">{alerta.msg}</Alert>}
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <div className="alert alert-info border-0" style={{ fontSize: 16, background: '#f0f6ff' }}>Inicia sesión para poder publicar una reseña.</div>
      )}
    </div>
  );
}
