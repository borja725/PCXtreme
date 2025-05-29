import React, { useMemo } from "react";
import { Form, Button } from "react-bootstrap";

export default function FiltrosProductos({ productos, filtros, setFiltros, mostrarModelos = true }) {
  const marcas = useMemo(() => Array.from(new Set(productos.map(p => p.marca).filter(Boolean))), [productos]);
  const modelos = useMemo(() => Array.from(new Set(productos.map(p => p.modelo).filter(Boolean))), [productos]);
  const precios = productos.map(p => p.precio);
  const minPrecio = Math.min(...precios);
  const maxPrecio = Math.max(...precios);

  const handleMarca = (marca) => {
    setFiltros(f => ({ ...f, marcas: f.marcas.includes(marca) ? f.marcas.filter(m => m !== marca) : [...f.marcas, marca] }));
  };
  const handleModelo = (modelo) => {
    setFiltros(f => ({ ...f, modelos: f.modelos.includes(modelo) ? f.modelos.filter(m => m !== modelo) : [...f.modelos, modelo] }));
  };
  const handlePrecioMin = e => setFiltros(f => ({ ...f, precioMin: e.target.value }));
  const handlePrecioMax = e => setFiltros(f => ({ ...f, precioMax: e.target.value }));
  const handleStock = e => setFiltros(f => ({ ...f, stock: e.target.checked }));
  const handleOrden = e => setFiltros(f => ({ ...f, orden: e.target.value }));
  const handleNombre = e => setFiltros(f => ({ ...f, nombre: e.target.value }));

  return (
    <Form className="p-3 bg-white rounded-4 shadow mb-4" style={{ border: '1.5px solid #e3e6ee', minWidth: 210, fontSize: 15 }}>
      <h5 className="fw-bold mb-4" style={{ fontSize: 20, color: '#1976d2', letterSpacing: 0.5 }}>Filtrar productos</h5>
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold" style={{ color: '#222' }}>🔍 Buscar</Form.Label>
        <Form.Control type="text" value={filtros.nombre} onChange={handleNombre} placeholder="Buscar..." style={{ borderRadius: 12, border: '1.2px solid #c3d0e6', fontSize: 15, boxShadow: 'none' }} />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold" style={{ color: '#222' }}>Ordenar por</Form.Label>
        <Form.Select value={filtros.orden} onChange={handleOrden} style={{ borderRadius: 12, border: '1.2px solid #c3d0e6', fontSize: 15, boxShadow: 'none' }}>
          <option value="">Por defecto</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold" style={{ color: '#222' }}>Precio</Form.Label>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Form.Control type="number" min={minPrecio} max={maxPrecio} value={filtros.precioMin} onChange={handlePrecioMin} placeholder="Mín" style={{ maxWidth: 80, borderRadius: 10, border: '1.2px solid #c3d0e6', fontSize: 15, boxShadow: 'none' }} />
          <span style={{ color: '#888' }}>-</span>
          <Form.Control type="number" min={minPrecio} max={maxPrecio} value={filtros.precioMax} onChange={handlePrecioMax} placeholder="Máx" style={{ maxWidth: 80, borderRadius: 10, border: '1.2px solid #c3d0e6', fontSize: 15, boxShadow: 'none' }} />
        </div>
        <Form.Check
          type="checkbox"
          label={<span style={{ fontSize: 14 }}>Solo productos en stock</span>}
          checked={filtros.stock}
          onChange={handleStock}
          style={{ marginTop: 3 }}
        />
      </Form.Group>
      <Form.Group className="mb-4 pb-2" style={{ borderTop: '1px solid #e3e6ee', paddingTop: 14 }}>
        <Form.Label className="fw-semibold" style={{ color: '#1976d2' }}>Marca</Form.Label>
        <div>
          {marcas.map(marca => (
            <Form.Check
              key={marca}
              type="checkbox"
              label={<span style={{ fontWeight: 500 }}>{marca}</span>}
              checked={filtros.marcas.includes(marca)}
              onChange={() => handleMarca(marca)}
              style={{ marginBottom: 4 }}
            />
          ))}
        </div>
      </Form.Group>
      {mostrarModelos && (
        <Form.Group className="mb-1">
          <Form.Label className="fw-semibold" style={{ color: '#1976d2' }}>Modelo</Form.Label>
          <div>
            {modelos.map(modelo => (
              <Form.Check
                key={modelo}
                type="checkbox"
                label={<span style={{ fontWeight: 500 }}>{modelo}</span>}
                checked={filtros.modelos.includes(modelo)}
                onChange={() => handleModelo(modelo)}
                style={{ marginBottom: 4 }}
              />
            ))}
          </div>
        </Form.Group>
      )}
      <div className="d-grid mt-4">
        <Button
          variant="primary"
          className="fw-bold rounded-pill shadow-sm"
          style={{ fontSize: 15, padding: '9px 0', backgroundColor: '#1976d2', borderColor: '#1976d2' }}
          onClick={() => setFiltros({ marcas: [], modelos: [], precioMin: '', precioMax: '', stock: false, nombre: '', orden: '' })}
        >
          Eliminar filtros
        </Button>
      </div>
    </Form>
  );
}
