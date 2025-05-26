import React, { useEffect, useState } from 'react';
import { useCart } from '../../components/CartContext';
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

function MainHeader() {
  const { cartCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

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
                placeholder="Buscar"
                inputProps={{ 'aria-label': 'buscar productos' }}
              />
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
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
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 700 }}>
                ¡Ofertas Flash NVIDIA!
              </Typography>
              <Typography variant="body2" sx={{ color: '#1976d2', cursor: 'pointer' }}>
                ¡Ofertas flash AMD!
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Tarjetas gráficas
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Portátiles
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                PC sobremesa
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Monitores
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                Componentes
              </Typography>
            </Box>
          </Container>
        </Box>
      </AppBar>
    </>
  );
}

export default MainHeader;
