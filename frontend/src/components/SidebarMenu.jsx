import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../public/logo.png";
import { FaLaptop, FaMicrochip, FaKeyboard, FaGamepad, FaSnowflake, FaTv, FaMobileAlt, FaHome } from "react-icons/fa";
import Slide from '@mui/material/Slide';

const menuItems = [
  { icon: <FaLaptop size={24} />, label: "Portátiles" },
  { icon: <FaMicrochip size={24} />, label: "Componentes y Software" },
  { icon: <FaKeyboard size={24} />, label: "Periféricos y Conectividad" },
  { icon: <FaGamepad size={24} />, label: "Gaming y Consolas" },
  { icon: <FaTv size={24} />, label: "Imagen y Sonido" },
  { icon: <FaMobileAlt size={24} />, label: "Smartphones y Telefonía" },
  { icon: <FaHome size={24} />, label: "ElectroHogar y Oficina" },
];

function SidebarMenu({ show, onClose }) {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

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
            {menuItems.map((item, idx) => (
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
              >
                <span style={{fontSize:'1.3rem', opacity:0.92, display:'flex',alignItems:'center'}}>{item.icon}</span>
                <span className="flex-grow-1 text-start">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Slide>
    </div>
  );
}

export default SidebarMenu;
