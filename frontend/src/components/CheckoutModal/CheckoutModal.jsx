import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Image, Table } from 'react-bootstrap';
import { useCart } from '../CartContext/CartContext';

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
  const { cart, setCart } = useCart();

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      setOrderNumber(randomOrderNumber());
    }, 2500);
  }


  const handleClose = async () => {
    try {
      const token = localStorage.getItem('jwt');
      await fetch('http://localhost:8000/api/cart/clear', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [], total: 0 });
    } catch (err) {
      setCart({ items: [], total: 0 });
    }
    setStep(1);
    setCompleted(false);
    setOrderNumber(null);
    setValidated(false);
    setForm({ name: '', address: '', city: '', province: '', postal: '', phone: '', email: '', card: '', expiry: '', cvv: '' });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {completed ? '¡Compra completada!' :
            step === 1 ? 'Resumen del pedido' :
              step === 2 ? 'Datos de envío' :
                step === 3 ? 'Confirmar pedido' : 'Finalizar pedido'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: 320, minWidth: '100%'}}>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: 50, height: 50 }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <div className="fw-bold text-primary">Procesando pago...</div>
          </div>
        ) : completed ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120, padding: '0 10px' }}>
            <div className="card shadow-lg border-0 p-4" style={{ maxWidth: 800, minWidth: '100%', borderRadius: 24 }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="bg-success bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 72, height: 72 }}>
                    <i className="bi bi-patch-check-fill text-success fs-1"></i>
                  </span>
                  <h4 className="fw-bold text-success mb-2">¡Gracias por tu compra!</h4>
                  <div className="text-secondary mb-3">Tu número de pedido es:</div>
                  <div className="display-6 fw-bold text-primary mb-4 d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-ticket-perforated-fill text-primary"></i> #{orderNumber}
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold mb-2 text-primary-emphasis">Resumen del pedido</h6>
                  <Table size="sm" bordered responsive className="mb-3 align-middle" style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <thead className="table-light">
                      <tr>
                        <th><i className="bi bi-box-seam me-1 text-secondary"></i>Producto</th>
                        <th className="text-center"><i className="bi bi-stack me-1 text-secondary"></i>Cantidad</th>
                        <th className="text-end"><i className="bi bi-currency-euro me-1 text-secondary"></i>Precio</th>
                        <th className="text-end"><i className="bi bi-cash-coin me-1 text-secondary"></i>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart?.items?.map(item => (
                        <tr key={item.product.id}>
                          <td style={{ minWidth: 360, maxWidth: 420, whiteSpace: 'normal' }} className="d-flex align-items-center gap-2">
                            <Image src={item.product.image || item.product.img || '/noimg.png'} roundedCircle style={{ width: 38, height: 38, objectFit: 'cover', border: '1.5px solid #e3eafc', background: '#fff' }} />
                            <span className="fw-semibold">{item.product.name}</span>
                            {item.product.category && <span className="badge bg-info bg-opacity-25 text-info-emphasis ms-2"><i className="bi bi-tag me-1"></i>{item.product.category}</span>}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-primary bg-opacity-75 px-3 py-2 rounded-pill"><i className="bi bi-stack me-1"></i>{item.qty}</span>
                          </td>
                          <td className="text-end">
                            <span className="fw-bold text-dark"><i className="bi bi-currency-euro me-1"></i>{Number(item.product.price).toFixed(2)}</span>
                          </td>
                          <td className="text-end">
                            <span className="fw-bold text-primary-emphasis"><i className="bi bi-cash-coin me-1"></i>{(item.product.price * item.qty).toFixed(2)} €</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="fw-bold fs-5 mb-4 text-end">
                    <span className="me-2 text-secondary-emphasis">Total:</span>
                    <span className="text-primary"><i className="bi bi-currency-euro me-1"></i>{cart?.total?.toFixed(2)} €</span>
                  </div>
                </div>
                <Button variant="primary" size="lg" className="px-5 py-2 rounded-pill fw-bold shadow" onClick={handleClose}>
                  <i className="bi bi-house-door me-2"></i>Cerrar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Form noValidate validated={validated} onSubmit={e => {
            e.preventDefault();
            if (step === 1) {
              setStep(2);
            } else if (step === 2) {
              setValidated(true);
              if (validateStep1() && validateStep2()) setStep(3);
            } else if (step === 3) {
              handleOrder(e);
            }
          }}>
            {step === 1 && (
              <>
                {!cart?.items?.length ? (
                  <Alert variant="info">Tu carrito está vacío.</Alert>
                ) : (
                  <div className="card shadow-sm border-0 mb-4" style={{ background: '#f8fafc', borderRadius: 18 }}>
                    <div className="card-header bg-white border-0 d-flex align-items-center gap-2 px-4 py-3" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                      <i className="bi bi-bag-check-fill text-primary fs-4 me-2"></i>
                      <span className="fw-bold fs-5 text-primary-emphasis">Resumen del pedido</span>
                      <span className="badge bg-secondary bg-opacity-25 text-dark ms-2">{cart.items.length} productos</span>
                    </div>
                    <div className="card-body p-0">
                      <Table hover responsive className="mb-0 align-middle" style={{ borderRadius: 18, overflow: 'hidden' }}>
                        <thead className="table-light">
                          <tr>
                            <th className="ps-4" style={{ minWidth: 180 }}><i className="bi bi-box-seam me-2 text-secondary"></i>Producto</th>
                            <th className="text-center"><i className="bi bi-hash me-1"></i>Cantidad</th>
                            <th className="text-end"><i className="bi bi-currency-euro me-1"></i>Precio</th>
                            <th className="text-end pe-4"><i className="bi bi-cash-coin me-1"></i>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item, idx) => {
                            const prod = item.product || {};
                            const nombre = prod.name || prod.nombre || 'Producto desconocido';
                            const precio = typeof prod.price === 'number' ? prod.price : (typeof prod.precio === 'number' ? prod.precio : 0);
                            const subtotal = typeof item.total === 'number' ? item.total : precio * (item.qty || 1);
                            const imagen = prod.image || prod.imagen || '/noimg.png';
                            const categoria = prod.category || prod.categoria || null;

                            return (
                              <tr key={prod.id || idx} className="border-top">
                                <td className="d-flex align-items-center gap-3 ps-4 py-3 bg-white">
                                  <Image
                                    src={imagen}
                                    onError={(e) => { e.target.src = '/noimg.png'; }}
                                    roundedCircle
                                    style={{
                                      width: 62, height: 62, objectFit: 'cover',
                                      boxShadow: '0 2px 12px #1976d233',
                                      border: '2px solid #e3eafc',
                                      background: '#fff'
                                    }}
                                    className="me-2"
                                  />
                                  <div>
                                    <span className="fw-semibold lh-sm d-block" style={{ fontSize: 16 }}>{nombre}</span>
                                    {categoria && <span className="badge bg-info bg-opacity-25 text-info-emphasis mt-1"><i className="bi bi-tag me-1"></i>{categoria}</span>}
                                  </div>
                                </td>
                                <td className="align-middle text-center bg-white">
                                  <span className="badge bg-primary bg-opacity-75 fs-6 px-3 py-2 shadow-sm rounded-pill"><i className="bi bi-stack me-1"></i>{item.qty || 1}</span>
                                </td>
                                <td className="align-middle text-end bg-white">
                                  <span className="text-dark fw-bold"><i className="bi bi-currency-euro me-1"></i>{precio.toFixed(2)}</span>
                                </td>
                                <td className="align-middle text-end pe-4 bg-white">
                                  <span className="fw-bold text-primary-emphasis"><i className="bi bi-cash-coin me-1"></i>{subtotal.toFixed(2)} €</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      <div className="d-flex justify-content-end align-items-center mb-4 mt-3 pe-4" style={{ gap: 18 }}>
                        <span className="fs-5 fw-bold text-secondary-emphasis"><i className="bi bi-receipt-cutoff me-2"></i>Total:</span>
                        <span className="fs-4 fw-bold text-primary shadow-sm px-4 py-2 rounded bg-light border border-1 border-primary-emphasis"><i className="bi bi-currency-euro me-2"></i>{cart.total?.toFixed(2)} €</span>
                      </div>
                      <div className="d-flex justify-content-end pb-3 pe-4">
                        <Button variant="primary" type="submit" className="fw-bold px-4 py-2 rounded-pill shadow"><i className="bi bi-arrow-right-circle me-2"></i>Continuar</Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <div className="card shadow-sm border-0 mb-4" style={{ background: '#f8fafc', borderRadius: 18 }}>
                  <div className="card-body p-4">
                    <h5 className="mb-4 fw-bold text-primary-emphasis" style={{ letterSpacing: 0.2 }}>Datos de envío</h5>
                    <Row className="g-3 mb-2">
                      <Col md={6}>
                        <Form.Group controlId="name">
                          <Form.Label className="fw-semibold">Nombre completo</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="name" value={form.name} onChange={handleChange} autoComplete="name" />
                          <Form.Control.Feedback type="invalid">Introduce tu nombre</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label className="fw-semibold">Teléfono</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
                          <Form.Control.Feedback type="invalid">Introduce tu teléfono</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group controlId="address" className="mb-3">
                      <Form.Label className="fw-semibold">Dirección</Form.Label>
                      <Form.Control required size="lg" className="rounded-pill shadow-sm" name="address" value={form.address} onChange={handleChange} autoComplete="street-address" />
                      <Form.Control.Feedback type="invalid">Introduce tu dirección</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="g-3 mb-2">
                      <Col md={5}>
                        <Form.Group controlId="city">
                          <Form.Label className="fw-semibold">Ciudad</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="city" value={form.city} onChange={handleChange} autoComplete="address-level2" />
                          <Form.Control.Feedback type="invalid">Introduce la ciudad</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="province">
                          <Form.Label className="fw-semibold">Provincia</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="province" value={form.province} onChange={handleChange} autoComplete="address-level1" />
                          <Form.Control.Feedback type="invalid">Introduce la provincia</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group controlId="postal">
                          <Form.Label className="fw-semibold">Código Postal</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="postal" value={form.postal} onChange={handleChange} autoComplete="postal-code" />
                          <Form.Control.Feedback type="invalid">Introduce el código postal</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label className="fw-semibold">Email</Form.Label>
                      <Form.Control required type="email" size="lg" className="rounded-pill shadow-sm" name="email" value={form.email} onChange={handleChange} autoComplete="email" />
                      <Form.Control.Feedback type="invalid">Introduce un email válido</Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <div className="card shadow-sm border-0" style={{ background: '#f8fafc', borderRadius: 18 }}>
                  <div className="card-body p-4">
                    <h5 className="mb-4 fw-bold text-primary-emphasis">Método de pago</h5>
                    <Form.Group controlId="card" className="mb-3">
                      <Form.Label className="fw-semibold">Número de tarjeta</Form.Label>
                      <Form.Control required size="lg" className="rounded-pill shadow-sm" name="card" value={form.card} onChange={handleChange} maxLength={16} minLength={16} pattern="\d{16}" placeholder="1234 5678 9012 3456" autoComplete="cc-number" />
                      <Form.Control.Feedback type="invalid">Introduce los 16 dígitos</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="expiry">
                          <Form.Label className="fw-semibold">Fecha caducidad (MM/AA)</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/AA" pattern="^(0[1-9]|1[0-2])/(\d{2})$" autoComplete="cc-exp" />
                          <Form.Control.Feedback type="invalid">Formato MM/AA</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="cvv">
                          <Form.Label className="fw-semibold">CVV</Form.Label>
                          <Form.Control required size="lg" className="rounded-pill shadow-sm" name="cvv" value={form.cvv} onChange={handleChange} maxLength={3} minLength={3} pattern="\d{3}" placeholder="123" autoComplete="cc-csc" />
                          <Form.Control.Feedback type="invalid">3 dígitos</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="secondary" onClick={() => { setStep(1); setValidated(false); }} className="fw-bold px-4 py-2 rounded-pill shadow">Atrás</Button>
                      <Button variant="primary" type="submit" className="fw-bold px-4 py-2 rounded-pill shadow" onClick={() => setStep(3)}>Siguiente</Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="card shadow-sm border-0 mb-4" style={{ background: '#f8fafc', borderRadius: 18 }}>
                  <div className="card-header bg-white border-0 d-flex align-items-center gap-2 px-4 py-3" style={{borderTopLeftRadius:18, borderTopRightRadius:18}}>
                    <i className="bi bi-clipboard-check text-success fs-4 me-2"></i>
                    <span className="fw-bold fs-5 text-success-emphasis">Confirmar pedido</span>
                  </div>
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <h6 className="fw-bold mb-2">Datos de envío</h6>
                      <div className="mb-1"><i className="bi bi-person me-2"></i>{form.name}</div>
                      <div className="mb-1"><i className="bi bi-telephone me-2"></i>{form.phone}</div>
                      <div className="mb-1"><i className="bi bi-geo-alt me-2"></i>{form.address}, {form.city}, {form.province}, {form.postal}</div>
                      <div className="mb-1"><i className="bi bi-envelope me-2"></i>{form.email}</div>
                    </div>
                    <h6 className="fw-bold mb-2">Resumen del pedido</h6>
                    <Table hover responsive className="mb-0 align-middle" style={{ borderRadius: 12, overflow: 'hidden' }}>
                      <thead className="table-light">
                        <tr>
                          <th>Producto</th>
                          <th className="text-center">Cantidad</th>
                          <th className="text-end">Precio</th>
                          <th className="text-end">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.items.map((item, idx) => {
                          const prod = item.product || {};
                          const nombre = prod.name || prod.nombre || 'Producto desconocido';
                          const precio = typeof prod.price === 'number' ? prod.price : (typeof prod.precio === 'number' ? prod.precio : 0);
                          const subtotal = typeof item.total === 'number' ? item.total : precio * (item.qty || 1);
                          return (
                            <tr key={prod.id || idx}>
                              <td>{nombre}</td>
                              <td className="text-center">{item.qty || 1}</td>
                              <td className="text-end">{precio.toFixed(2)} €</td>
                              <td className="text-end">{subtotal.toFixed(2)} €</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-end align-items-center mb-4 mt-3 pe-4" style={{gap: 18}}>
                      <span className="fs-5 fw-bold text-secondary-emphasis">Total:</span>
                      <span className="fs-4 fw-bold text-primary shadow-sm px-4 py-2 rounded bg-light border border-1 border-primary-emphasis">{cart.total?.toFixed(2)} €</span>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <Button variant="secondary" onClick={() => setStep(2)} className="fw-bold px-4 py-2 rounded-pill shadow">Atrás</Button>
                      <Button variant="success" type="submit" className="fw-bold px-4 py-2 rounded-pill shadow" disabled={loading}>
                      {loading ? (
                        <span className="d-flex align-items-center"><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...</span>
                      ) : (
                        <><i className="bi bi-check-circle me-2"></i>Confirmar pedido</>
                      )}
                    </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

