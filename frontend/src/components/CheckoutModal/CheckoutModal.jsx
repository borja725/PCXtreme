import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

function randomOrderNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

export default function CheckoutModal({ show, onHide, onOrderCompleted }) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', city: '', province: '', postal: '', phone: '', email: '',
    card: '', expiry: '', cvv: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validateStep1 = () => {
    return form.name && form.address && form.city && form.province && form.postal && form.phone && form.email;
  };

  const validateStep2 = () => {
    return (/^\d{16}$/.test(form.card) && /^(0[1-9]|1[0-2])\/(\d{2})$/.test(form.expiry) && /^\d{3}$/.test(form.cvv));
  };

  const handleNext = e => {
    e.preventDefault();
    setValidated(true);
    if (validateStep1()) {
      setStep(2);
      setValidated(false);
    }
  };

  const handleOrder = e => {
    e.preventDefault();
    setValidated(true);
    if (validateStep2()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
        const orderNum = randomOrderNumber();
        setOrderNumber(orderNum);
        if (onOrderCompleted) onOrderCompleted(orderNum);
      }, 5000);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCompleted(false);
    setOrderNumber(null);
    setValidated(false);
    setForm({ name: '', address: '', city: '', province: '', postal: '', phone: '', email: '', card: '', expiry: '', cvv: '' });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{completed ? '¡Compra completada!' : 'Finalizar pedido'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary mb-3" style={{width: 50, height: 50}} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="fw-bold text-primary">Procesando pago...</div>
          </div>
        ) : completed ? (
          <div className="text-center">
            <Alert variant="success" className="fw-bold mb-4">¡Gracias por tu compra!</Alert>
            <div className="mb-2">Tu número de pedido es:</div>
            <div className="display-6 fw-bold text-primary mb-4">#{orderNumber}</div>
            <Button variant="primary" onClick={handleClose}>Cerrar</Button>
          </div>
        ) : (
          <Form noValidate validated={validated} onSubmit={step === 1 ? handleNext : handleOrder}>
            {step === 1 && (
              <>
                <h5 className="mb-3">Datos de envío</h5>
                <Row>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="name">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control required name="name" value={form.name} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">Introduce tu nombre</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="phone">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control required name="phone" value={form.phone} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">Introduce tu teléfono</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="address" className="mb-2">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control required name="address" value={form.address} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Introduce tu dirección</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={5} className="mb-2">
                    <Form.Group controlId="city">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control required name="city" value={form.city} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">Introduce la ciudad</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-2">
                    <Form.Group controlId="province">
                      <Form.Label>Provincia</Form.Label>
                      <Form.Control required name="province" value={form.province} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">Introduce la provincia</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-2">
                    <Form.Group controlId="postal">
                      <Form.Label>Código Postal</Form.Label>
                      <Form.Control required name="postal" value={form.postal} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">Introduce el código postal</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="email" className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control required type="email" name="email" value={form.email} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Introduce un email válido</Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="primary" type="submit">Siguiente</Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h5 className="mb-3">Método de pago</h5>
                <Form.Group controlId="card" className="mb-2">
                  <Form.Label>Número de tarjeta</Form.Label>
                  <Form.Control required name="card" value={form.card} onChange={handleChange} maxLength={16} minLength={16} pattern="\d{16}" placeholder="1234 5678 9012 3456" />
                  <Form.Control.Feedback type="invalid">Introduce los 16 dígitos</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="expiry">
                      <Form.Label>Fecha caducidad (MM/AA)</Form.Label>
                      <Form.Control required name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/AA" pattern="^(0[1-9]|1[0-2])/(\d{2})$" />
                      <Form.Control.Feedback type="invalid">Formato MM/AA</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control required name="cvv" value={form.cvv} onChange={handleChange} maxLength={3} minLength={3} pattern="\d{3}" placeholder="123" />
                      <Form.Control.Feedback type="invalid">3 dígitos</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={() => { setStep(1); setValidated(false); }}>Atrás</Button>
                  <Button variant="primary" type="submit">Confirmar pedido</Button>
                </div>
              </>
            )}
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
