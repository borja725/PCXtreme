import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import styles from '../Login/loginCard.module.css';
import { useNavigate } from 'react-router-dom';
const logoUrl = "../../public/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 p-0" style={{background: '#f3f3f3'}}>
      <Row className="g-0 min-vh-100">
        <Col md={5} className="d-none d-md-flex flex-column align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #1976d2 0%, rgb(0,0,0) 100%)', color: '#fff', minHeight: '100vh', padding: '48px 0'}}>
          <button
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img src={logoUrl} alt="PC Xtreme" style={{ width: 60, marginBottom: 60, scale: 8, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
          </button>
          <h2 className="fw-bold mb-3" style={{letterSpacing: 1}}>¡Crea tu cuenta gratis!</h2>
          <ul className="list-unstyled" style={{fontSize: 22, lineHeight: 2}}>
            <li>✔ Accede a ofertas exclusivas y personalizadas.</li>
            <li>✔ Consulta tu historial de compras.</li>
            <li>✔ Accede a compra de productos.</li>
            <li>✔ Guarda tus configuraciones y listas.</li>
          </ul>
        </Col>
        <Col xs={12} md={7} className="d-flex align-items-center justify-content-center" style={{minHeight: '100vh', background: '#fff'}}>
          <Card className={`shadow p-4 w-100 ${styles.loginCardAnim}`} style={{maxWidth: 400, borderRadius: 16}}>
            <h4 className="mb-3 text-primary fw-bold">Crear cuenta</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="registerUsername">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="Introduce tu usuario"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Introduce tu email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPassword">
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
  {password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password) && (
    <div style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
      La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
    </div>
  )}
</Form.Group>
<Form.Group className="mb-3" controlId="registerConfirmPassword">
  <Form.Label>Confirmar contraseña</Form.Label>
  <div style={{ position: 'relative' }}>
    <Form.Control
      type={showConfirmPassword ? 'text' : 'password'}
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
      required
      placeholder="Confirmar contraseña"
    />
    <span
      onClick={() => setShowConfirmPassword(s => !s)}
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
      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
    </span>
  </div>
  {confirmPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(confirmPassword) && (
    <div style={{ color: '#d32f2f', fontSize: 13, marginTop: 4 }}>
      La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
    </div>
  )}
</Form.Group>
              <Button type="submit" variant="primary" className="w-100 fw-bold mb-2" disabled={loading}>
                {loading ? "Cargando..." : "Registrarse"}
              </Button>
            </Form>
            <hr />
            <Button variant="outline-warning" className="w-100 mb-2 fw-bold">Regístrate con Google</Button>
            <div className="text-center mt-2">
              ¿Ya tienes cuenta?
              <Button variant="link" className="p-0 ms-1 fw-semibold text-primary" onClick={() => navigate('/login')}>Inicia sesión</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

