import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../public/logo.png";
import { FaMicrochip, FaMemory, FaHdd, FaPowerOff, FaSnowflake, FaKeyboard, FaCube, FaThLarge, FaLayerGroup, FaProjectDiagram } from "react-icons/fa";
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: <FaThLarge size={24} />, label: "Todos los componentes", categoria: "PYPC", subcategoria: "" },
  { icon: <FaLayerGroup size={24} />, label: "Tarjetas gráficas", categoria: "PYPC", subcategoria: "Tarjeta Gráfica" },
  { icon: <FaMicrochip size={24} />, label: "CPU / Procesadores", categoria: "PYPC", subcategoria: "Procesador" },
  { icon: <FaMemory size={24} />, label: "RAM / Memoria", categoria: "PYPC", subcategoria: "RAM" },
  { icon: <FaProjectDiagram size={24} />, label: "Placas base", categoria: "PYPC", subcategoria: "Placa Base" },
  { icon: <FaHdd size={24} />, label: "Almacenamiento", categoria: "PYPC", subcategoria: "Almacenamiento" },
  { icon: <FaPowerOff size={24} />, label: "Fuente de alimentación", categoria: "PYPC", subcategoria: "Fuente Alimentacion" },
  { icon: <FaSnowflake size={24} />, label: "Refrigeración", categoria: "PYPC", subcategoria: "Refrigeracion" },
  { icon: <FaKeyboard size={24} />, label: "Periféricos", categoria: "PYPC", subcategoria: "Perifericos" },
  { icon: <FaCube size={24} />, label: "Cajas", categoria: "PYPC", subcategoria: "Caja" },
];

function SidebarMenu({ show, onClose }) {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) setVisible(true);
  }, [show]);

  const handleExited = () => setVisible(false);

  if (!show && !visible) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ zIndex: 1200, background: "rgba(0,0,0,0.18)" }}
      onClick={onClose}
    >
      <Slide in={show} direction="right" timeout={300} mountOnEnter unmountOnExit onExited={handleExited}>
        <div
          className="bg-white shadow-lg d-flex flex-column h-100 position-fixed top-0 start-0"
          tabIndex="-1"
          style={{
            width: 370,
            maxWidth: '90vw',
            height: '100vh',
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(16px)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3" style={{minHeight:85}}>
            <img src={logo} alt="Logo" style={{height:34, scale: 5, objectFit:'contain', marginLeft:67, marginRight:'auto'}} />
            <button type="button" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center ms-2" style={{fontSize: '1.6rem', width:38, height:38}} onClick={onClose} aria-label="Cerrar menú">
              ×
            </button>
          </div>
          <div className="d-flex flex-column gap-3 px-3 py-3" style={{rowGap: '1.1rem'}}>
            {menuItems.map((item, idx) => {
              const path = item.subcategoria
                ? `/productos/${item.categoria}/${encodeURIComponent(item.subcategoria)}`
                : `/productos/${item.categoria}`;
              return (
                <button
                  key={item.label}
                  className={
                    'btn d-flex align-items-center gap-2 px-3 py-2 fw-semibold' +
                    (hovered === idx ? ' btn-primary text-white' : ' btn-light')
                  }
                  style={{
                    fontSize: '1.03rem',
                    transition: 'background 0.18s, color 0.18s, transform 0.18s',
                    minHeight: 38,
                    borderRadius: '999px',
                    transform: hovered === idx ? 'scale(1.04)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  type="button"
                  onClick={() => {
                    navigate(path);
                    onClose();
                  }}
                >
                  <span style={{fontSize:'1.3rem', opacity:0.92, display:'flex',alignItems:'center'}}>{item.icon}</span>
                  <span className="flex-grow-1 text-start">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Slide>
    </div>
  );
}

export default SidebarMenu;
