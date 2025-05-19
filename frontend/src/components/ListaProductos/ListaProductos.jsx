import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Para padding y centrado
import Container from '@mui/material/Container';

function ListaProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          console.error("La respuesta de la API no es un array:", res.data);
          setProductos([]); 
        }
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 3, bgcolor: 'rgb(243, 243, 243)', minHeight: '100vh' }}>
      
      <Container maxWidth="xl" disableGutters>
      <Box sx={{ padding: 3 }}>
        <Card sx={{ p: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 2, boxShadow: 'none', width: 'fit-content'}}>
          <Typography variant="h5" component="h4" sx={{ color: '#1976d2', fontWeight: 600, letterSpacing: 1 }}>
            !Nuestros Procesadores Más Vendidos¡
          </Typography>
        </Card>
        <Grid container spacing={4} justifyContent="space-between">
          {productos.map((producto) => (
            <Grid item key={producto.id} xs={6} sm={6} md={6} lg={6}>
              <Card
                sx={{
                  mt: 2,
                  maxWidth: 345,
                  width: 200,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  border: '1px solid rgb(243, 243, 243)',
                  borderRadius: 2,
                  boxShadow: 'none',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  '&:hover': {
                    boxShadow: 'none',
                    transform: 'translateY(-4px) scale(1.03)',
                  },
                }}
              >
                <CardActionArea onClick={() => console.log("Producto clickeado:", producto.nombre)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={producto.imatgeurl || 'https://via.placeholder.com/300x200.png?text=No+Image'}
                    alt={producto.nombre}
                    sx={{ objectFit: 'contain', p: 1, borderRadius: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '3em',
                        fontWeight: 700,
                        color: '#111827',
                        letterSpacing: 0.5
                    }}>
                      {producto.nombre || 'Nombre no disponible'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                      Categoría: {producto.categoria || 'N/A'}
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ mt: 1, fontWeight: 900, color: '#1976d2', letterSpacing: 1 }}>
                      {typeof producto.precio === 'number' ? `${producto.precio.toFixed(2)}€` : 'Precio no disponible'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: producto.stock > 0 ? '#2ecc40' : '#e53935', fontWeight: 600, mt: 1 }}>
                      Stock: {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      </Container>
    </Box>
  );
}

export default ListaProductos;