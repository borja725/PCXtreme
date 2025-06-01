import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import styles from './loginCard.module.css';
import { useNavigate } from 'react-router-dom';
const logoUrl = "/logo.png";
import { setToken } from '../../utils/auth';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setToken(data.token);
        setSuccess(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 p-0" style={{ background: '#f3f3f3' }}>
      <Row className="g-0 min-vh-100">
        <Col md={5} className="d-none d-md-flex flex-column align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1976d2 0%, rgb(0,0,0) 100%)', color: '#fff', minHeight: '100vh', padding: '48px 0' }}>
          <button
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img src={logoUrl} alt="PC Xtreme" style={{ width: 60, marginBottom: 60, scale: 8, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
          </button>
          <h2 className="fw-bold mb-3" style={{ letterSpacing: 1 }}>¡Identifícate o crea una nueva cuenta!</h2>
          <ul className="list-unstyled" style={{ fontSize: 22, lineHeight: 2 }}>
            <li>✔ Accede a ofertas exclusivas y personalizadas.</li>
            <li>✔ Consulta tu historial de compras.</li>
            <li>✔ Accede a compra de productos.</li>
            <li>✔ Guarda tus configuraciones y listas.</li>
          </ul>
        </Col>
        <Col xs={12} md={7} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#fff' }}>
          <Card className={`shadow p-4 w-100 ${styles.loginCardAnim}`} style={{ maxWidth: 400, borderRadius: 16 }}>
            <h4 className="mb-3 text-primary fw-bold">Inicia sesión</h4>
            {success && <Alert variant="success">¡Sesión iniciada correctamente!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {passwordWarning && <Alert variant="warning">{passwordWarning}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="loginUsername">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="Introduce tu usuario"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Contraseña</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Introduce tu contraseña"
                  />
                  <span
                    onClick={() => setShowPassword(s => !s)}
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
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </span>
                </div>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 fw-bold mb-2" disabled={loading}>
                {loading ? "Cargando..." : "Acceder"}
              </Button>
            </Form>
            <hr />
            <div className="text-center mt-2">
              ¿No tienes cuenta?
              <Button variant="link" className="p-0 ms-1 fw-semibold text-primary" onClick={() => navigate('/register')}>Regístrate</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}



