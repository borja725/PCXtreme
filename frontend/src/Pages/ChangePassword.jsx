import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        // Si el backend devuelve un mensaje de error específico, mostrarlo
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
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-0" style={{background: 'linear-gradient(135deg, #f5faff 0%, #1976d2 100%)'}}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={5} xl={4} className="bg-white rounded shadow p-4 mt-5 mb-5">
          <h3 className="mb-4 text-primary text-center">Cambiar contraseña</h3>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="oldPassword">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Introduce tu contraseña actual"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="newPassword">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Introduce la nueva contraseña"
              />
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
