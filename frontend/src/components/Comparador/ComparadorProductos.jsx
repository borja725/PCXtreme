import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';

export default function ComparadorProductos({ productos, show, onHide, onRemove, categoria, subcategoria }) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [allProductos, setAllProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const mostrarKeys = ['nombre', 'precio', 'marca', 'modelo'];

  // Cargar productos de la misma categoría/subcategoría (solo si hay uno seleccionado)
  useEffect(() => {
    if (show && productos.length === 1 && categoria && subcategoria) {
      setLoading(true);
      fetch(`/api/productos?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoria)}`)
        .then(res => res.json())
        .then(data => {
          // Excluir el producto ya seleccionado
          setAllProductos(data.filter(p => p.id !== productos[0].id));
          setLoading(false);
        });
    } else {
      setAllProductos([]);
      setBusqueda('');
      setResultados([]);
    }
  }, [show, productos, categoria, subcategoria]);

  // Filtrar resultados
  useEffect(() => {
    if (busqueda && allProductos.length > 0) {
      setResultados(
        allProductos.filter(p =>
          p.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
      );
    } else {
      setResultados([]);
    }
  }, [busqueda, allProductos]);

  if (!productos || productos.length === 0) return null;
  if (productos.length === 2) {
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Comparar productos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered responsive>
            <thead>
              <tr>
                <th style={{textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', width: '100%'}}>Características</th>
                {productos.map((prod, idx) => (
                  <th key={prod.id || idx}>
                    {prod.nombre}
                    <Button variant="link" size="sm" onClick={() => onRemove(prod.id)} style={{color: '#d32f2f'}} title="Quitar">✕</Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mostrarKeys.map(key => (
                <tr key={key}>
                  <td style={{fontWeight: 'bold', textTransform: 'capitalize'}}>{key}</td>
                  {productos.map((prod, idx) => (
                    <td key={prod.id || idx}>{prod[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Si solo hay un producto seleccionado, mostrar especificaciones + buscador
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Comparar productos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {/* Izquierda: especificaciones del producto */}
          <div className="col-md-6 border-end">
            <h5 className="fw-bold mb-3">{productos[0].nombre}</h5>
            <Table bordered size="sm">
              <tbody>
                {mostrarKeys.map(key => (
                  <tr key={key}>
                    <td className="fw-semibold" style={{width: 120, textTransform: 'capitalize'}}>{key}</td>
                    <td>{productos[0][key]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="link" size="sm" onClick={() => onRemove(productos[0].id)} style={{color: '#d32f2f'}} title="Quitar">Quitar producto</Button>
          </div>

          {/* Derecha: buscador y resultados */}
          <div className="col-md-6">
            <h6 className="fw-semibold">Buscar producto para comparar</h6>
            <InputGroup className="mb-2">
              <Form.Control
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                disabled={loading || allProductos.length === 0}
              />
            </InputGroup>
            {loading && <Spinner animation="border" size="sm" />}
            <ListGroup style={{maxHeight: 220, overflowY: 'auto'}}>
              {resultados.map(prod => (
                <ListGroup.Item
                  key={prod.id}
                  action
                  onClick={() => {
                    // Añadir el producto al comparador
                    if (typeof window !== 'undefined' && window.dispatchEvent) {
                      // Emite evento para que ListaProductosGenerica añada este producto
                      window.dispatchEvent(new CustomEvent('comparar:add', { detail: prod }));
                    }
                  }}
                >
                  {prod.nombre} <span className="text-muted">({prod.marca} {prod.modelo})</span>
                </ListGroup.Item>
              ))}
              {!loading && busqueda && resultados.length === 0 && (
                <ListGroup.Item disabled>No hay resultados</ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

