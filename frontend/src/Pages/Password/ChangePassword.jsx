import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError('La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword, confirmNewPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }
      setSuccess(data.message || 'Contraseña cambiada correctamente');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-0" style={{ background: 'linear-gradient(135deg, #f5faff 0%, #1976d2 100%)' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={5} xl={4} className="bg-white rounded shadow p-4 mt-5 mb-5">
          <h3 className="mb-4 text-primary text-center">Cambiar contraseña</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="oldPassword">
              <Form.Label>Contraseña actual</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Introduce tu contraseña actual"
                />
                <span
                  onClick={() => setShowOld(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#1976d2',
                    fontSize: 22,
                    userSelect: 'none',
                    zIndex: 2
                  }}
                  aria-label={showOld ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showOld ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>Nueva contraseña</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Introduce la nueva contraseña"
                />
                <span
                  onClick={() => setShowNew(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#1976d2',
                    fontSize: 22,
                    userSelect: 'none',
                    zIndex: 2
                  }}
                  aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showNew ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                />
                <span
                  onClick={() => setShowConfirm(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#1976d2',
                    fontSize: 22,
                    userSelect: 'none',
                    zIndex: 2
                  }}
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                </span>
              </div>
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" onClick={handleChange} disabled={loading} size="lg">
                Cambiar contraseña
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
