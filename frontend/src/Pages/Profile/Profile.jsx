import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserName, getToken, removeToken, setToken } from '../../utils/auth';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const response = await fetch('http://localhost:8000/api/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('No se pudo cargar el perfil');
        const data = await response.json();
        setName(data.name || '');
        setEmail(data.email || '');
        setProfileImage(data.profileImage || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profileImage) formData.append('profileImage', profileImage);
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');
      const data = await response.json();
      if (data.token) setToken(data.token);
      setSuccess('¡Datos actualizados correctamente!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar la cuenta');
      setSuccess('¡Cuenta eliminada correctamente! Redirigiendo...');
      setTimeout(() => {
        removeToken();
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar la cuenta');
      setSuccess('¡Cuenta eliminada correctamente! Redirigiendo...');
      setTimeout(() => {
        removeToken();
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    navigate('/change-password');
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-0" style={{background: 'linear-gradient(135deg, #f5faff 0%, #1976d2 100%)'}}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6} className="bg-white rounded shadow p-4 mt-5 mb-5">
          <h2 className="mb-4 text-primary">Mi Perfil</h2>
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Button variant="success" onClick={handleSave} disabled={loading}>Guardar cambios</Button>
              <Button variant="secondary" onClick={handleLogout}>Cerrar sesión</Button>
              <Button variant="danger" onClick={handleDeleteAccount} disabled={loading}>Eliminar cuenta</Button>
              <Button variant="primary" onClick={handlePasswordChange}>Cambiar contraseña</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
