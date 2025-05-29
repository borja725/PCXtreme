import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken, getToken } from '../../utils/auth';
import { Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';

export default function AdminPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    nombre: '', precio: '', stock: '', descripcion: '', imatgeurl: '', categoria: '', subcategoria: '', marca: '', modelo: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const payload = decodeToken();
    if (!payload || !payload.roles || !payload.roles.includes('ROLE_ADMIN')) {
      navigate('/');
    }
  }, [navigate]);

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleOpenModal = (mode, prod = null) => {
    setModalMode(mode);
    setSelectedProduct(prod);
    if (mode === 'edit' && prod) {
      console.log('Producto recibido para editar:', prod);
      setForm({ ...prod });
    } else {
      setForm({ nombre: '', precio: '', stock: '', descripcion: '', imatgeurl: '', categoria: '', subcategoria: '', marca: '', modelo: '' });
    }
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/productos/${productToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setSuccessMsg('Producto eliminado');
      fetchProductos();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (prod) => {
    setProductToDelete(prod);
    setShowDeleteModal(true);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const method = modalMode === 'edit' ? 'PUT' : 'POST';
      const url = modalMode === 'edit' ? `/api/productos/${selectedProduct.id}` : '/api/productos';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'No se pudo guardar');
      }
      setSuccessMsg(modalMode === 'edit' ? 'Producto actualizado' : 'Producto añadido');
      setShowModal(false);
      fetchProductos();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Panel de Administración de Productos</h2>
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible>{successMsg}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      <Button variant="primary" className="mb-3" onClick={() => handleOpenModal('add')}>Añadir producto</Button>
      {loading ? <Spinner animation="border" /> : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.precio}</td>
                <td>{prod.stock}</td>
                <td>{prod.categoria}</td>
                <td>{prod.marca}</td>
                <td>{prod.modelo}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => handleOpenModal('edit', prod)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => confirmDelete(prod)} disabled={saving}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={saving}>
            {saving ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'edit' ? 'Editar producto' : 'Añadir producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control name="precio" type="number" value={form.precio} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control name="stock" type="number" value={form.stock} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control name="imatgeurl" value={form.imatgeurl} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Control name="categoria" value={form.categoria} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Subcategoría</Form.Label>
              <Form.Control name="subcategoria" value={form.subcategoria} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Marca</Form.Label>
              <Form.Control name="marca" value={form.marca} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Modelo</Form.Label>
              <Form.Control name="modelo" value={form.modelo} onChange={handleChange} />
            </Form.Group>
            <Button type="submit" variant="success" className="mt-2 w-100" disabled={saving}>
              {saving ? 'Guardando...' : (modalMode === 'edit' ? 'Guardar cambios' : 'Añadir producto')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
