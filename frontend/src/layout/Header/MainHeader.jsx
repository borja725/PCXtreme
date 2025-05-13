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
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const logoUrl = "../../public/logo.png"; // Puedes usar tu propio logo

function MainHeader() {
  const [category, setCategory] = React.useState("all");

  return (
    <React.Fragment>
      <AppBar position="static" color="inherit" elevation={1} sx={{ height: 64}}>
        <Toolbar sx={{ justifyContent: 'space-between'}}>
          {/* Menú hamburguesa */}
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {/* Logo */}
          <Box sx={{ display: 'flex'}}>
            <img src={logoUrl} alt="PC Xtreme"/>
          </Box>
          {/* Selector de categoría y búsqueda */}
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 400,
              p: '2px 4px',
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
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
          {/* Usuario y carrito */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1, color: '#1976d2', fontWeight: 500 }}>
              Mi cesta
            </Typography>
          </Box>
        </Toolbar>
        {/* Menú inferior */}
        <Box sx={{ display: 'flex', gap: 3, px: 4, py: 1, bgcolor: '#fafafa', borderTop: '1px solid #eee' }}>
          <Typography variant="body2" sx={{ color: '#ff6600', fontWeight: 700 }}>
            ¡Ofertas 20 ANIVERSARIO!
          </Typography>
          <Typography variant="body2" sx={{ color: '#1976d2', cursor: 'pointer' }}>
            ¡Ofertas flash AMD!
          </Typography>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            PC sobremesa
          </Typography>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            Portátiles
          </Typography>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            Componentes
          </Typography>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            Monitores
          </Typography>
        </Box>
      </AppBar>
    </React.Fragment>
  );
}

export default MainHeader;
