import React from 'react';
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
import { useState } from 'react';
  
const logoUrl = "../../public/logo.png"; // Puedes usar tu propio logo

function MainHeader() {
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ width: '100%', boxShadow: 'none', zIndex: 1000 }}>
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%', p: 0, borderBottom: '1px solid #e0e0e0' }}>
          <Container  maxWidth="xl" disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 84 }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', width: '17%' , justifyContent: 'center'}}>
              <img style={{ width: 10, height: 10, scale: 20}} src={logoUrl} alt="PC Xtreme"/>
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
                if (location.pathname === '/login') {
                  navigate('/register');
                } else if (location.pathname === '/register') {
                  navigate('/login');
                } else {
                  navigate('/login');
                }
              }}>
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
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
