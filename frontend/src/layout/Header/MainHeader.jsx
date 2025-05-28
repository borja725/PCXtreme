import React, { useEffect, useState } from 'react';
import { useCart } from '../../components/CartContext/CartContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { getUserName, getToken } from '../../utils/auth';
  
const logoUrl = "../../public/logo.png";
import SidebarMenu from '../../components/SidebarMenu/SidebarMenu';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

function MainHeader() {
  const { cartCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(getUserName());
  const isLoggedIn = !!getToken();

  useEffect(() => {
    const onStorage = () => setUserName(getUserName());
    window.addEventListener('storage', onStorage);
    const interval = setInterval(() => {
      setUserName(getUserName());
    }, 500);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  // Overlay: fetch y cerrar
  React.useEffect(() => {
    // Solo buscar si el overlay está abierto y hay texto en el input del header
    if (searchOpen && search && search.trim()) {
      setSearchLoading(true);
      fetch(`/api/productos?q=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    } else if (searchOpen && (!search || !search.trim())) {
      setSearchResults([]);
    }
  }, [search, searchOpen]);

  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    if (searchOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [searchOpen]);

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ width: '100%', boxShadow: 'none', zIndex: 1000 }}>
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%', p: 0, borderBottom: '1px solid #e0e0e0' }}>
          <Container  maxWidth="xl" disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 84 }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </IconButton>
            <SidebarMenu show={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Box sx={{ display: 'flex', width: '17%' , justifyContent: 'center'}}>
              <button
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                <img style={{ width: 10, height: 10, scale: 20}} src={logoUrl} alt="PC Xtreme"/>
              </button>
            </Box>
            <Paper
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 800,
                p: '2px 4px',
                boxShadow: 'none',
                border: '1px solid rgb(209, 209, 209)',
                mr: 2
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Buscar productos..."
                inputProps={{ 'aria-label': 'buscar productos' }}
                value={search || ''}
                onChange={e => setSearch(e.target.value)}
                inputRef={searchInputRef}
                autoComplete="off"
                onFocus={() => setDropdownOpen(true)}
                onBlur={e => { setTimeout(() => setDropdownOpen(false), 120); }}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setDropdownOpen(false);
                    searchInputRef.current && searchInputRef.current.blur();
                  }
                }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => {
                setDropdownOpen(true);
                searchInputRef.current && searchInputRef.current.focus();
              }}>
                <SearchIcon />
              </IconButton>
              {dropdownOpen && search && search.trim() && (
                <DropdownSearchPanel
                  search={search}
                  navigate={navigate}
                  anchorRef={searchInputRef}
                />
              )}
            </Paper>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={() => {
                if (isLoggedIn) {
                  navigate('/profile');
                } else if (location.pathname === '/login') {
                  navigate('/register');
                } else if (location.pathname === '/register') {
                  navigate('/login');
                } else {
                  navigate('/login');
                }
              }}>
                <AccountCircleIcon />
              </IconButton>
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/profile')}
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 20px',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    marginLeft: 8
                  }}
                >
                  Cuenta
                </button>
              )}
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="cart"
                sx={{ ml: 1 }}
                onClick={() => {
                  if (!isLoggedIn) { navigate('/login'); return; }
                  navigate('/cart');
                }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Container>
        </Toolbar>
        <Box sx={{ width: '100%', bgcolor: '#fafafa' }}>
          <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, px: 4, py: 1 }}>
              <Link to="/productos/PYPC/Caja de Torre" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Cajas PC
                </Typography>
              </Link>
              <Link to="/productos/PYPC/Tarjeta Gráfica" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Tarjetas gráficas
                </Typography>
              </Link>
              <Link to="/productos/PYPC/Procesador" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Procesadores
                </Typography>
              </Link>
              <Link to="/productos/PYPC/RAM" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Memorias RAM
                </Typography>
              </Link>
              <Link to="/productos/PYPC/Refrigeracion" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Refrigeración                
                </Typography>
              </Link>
              <Link to="/productos/PYPC/SSD" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Almacenamiento
                </Typography>
              </Link>
              <Link to="/productos/PYPC/" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer' }}>
                  Todos los componentes
                </Typography>
              </Link>
            </Box>
          </Container>
        </Box>
      </AppBar>
      
    </>
  );
}

function DropdownSearchPanel({ search, navigate, anchorRef }) {
  const [productos, setProductos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (!fetched) {
      setLoading(true);
      fetch('/api/productos')
        .then(res => {
          if (!res.ok) throw new Error('Error al obtener productos');
          return res.json();
        })
        .then(data => {
          setProductos(Array.isArray(data) ? data : []);
          setLoading(false);
          setFetched(true);
        })
        .catch(err => {
          setError(err.message || 'Error de red');
          setLoading(false);
        });
    }
  }, [fetched]);

  let filtered = [];
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = productos.filter(p =>
      (p.nombre && p.nombre.toLowerCase().includes(q)) ||
      (p.marca && p.marca.toLowerCase().includes(q)) ||
      (p.modelo && p.modelo.toLowerCase().includes(q))
    );
  }

  const anchor = anchorRef && anchorRef.current;
  let top = 60, left = 0, width = 400;
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    top = rect.bottom + window.scrollY + 6;
    left = rect.left + window.scrollX;
    width = rect.width;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: Math.max(width, 360),
        zIndex: 3000,
      }}
      tabIndex={-1}
    >
      <div className="shadow border-0 rounded-4" style={{ minHeight: 30, maxHeight: 440, overflowY: 'auto', marginTop: 4 }}>
        {loading ? (
          <div className="text-center text-primary fw-semibold py-4 fs-5">Cargando productos...</div>
        ) : error ? (
          <div className="text-center text-danger py-4 fs-6">{error}</div>
        ) : (search && !loading && filtered.length === 0) ? (
          <div className="text-center text-secondary py-4 fs-6">No se encontraron productos.</div>
        ) : (
          <ListGroup variant="flush">
            {filtered.slice(0, 8).map(prod => (
              <ListGroup.Item
                key={prod.id}
                action
                className="d-flex align-items-center gap-3 py-3 px-2 border-0 border-bottom"
                style={{ cursor: 'pointer' }}
                onMouseDown={e => { e.preventDefault(); navigate(`/producto/${prod.id}`); }}
              >
                <img
                  src={prod.imatgeurl || '/noimg.png'}
                  alt={prod.nombre}
                  className="rounded border bg-light"
                  style={{ width: 56, height: 56, objectFit: 'contain' }}
                />
                <div className="d-flex align-items-center w-100" style={{ minWidth: 0 }}>
                  <div className="flex-grow-1 min-width-0" style={{ maxWidth: '80%' }}>
                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: 17 }}>
                      {prod.nombre}
                    </div>
                    <div className="text-secondary small text-truncate">
                      {prod.marca}{prod.modelo ? ' · ' + prod.modelo : ''}{prod.tipo ? ' · ' + prod.tipo : ''}
                    </div>
                  </div>
                  <div className="fw-bold text-primary ms-2 text-end flex-shrink-0" style={{ fontSize: 18, whiteSpace: 'nowrap', minWidth: 75 }}>
                    {Number(prod.precio).toFixed(2)} €
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}

export default MainHeader;
