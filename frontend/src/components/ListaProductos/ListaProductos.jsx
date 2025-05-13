import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Para padding y centrado


function ListaProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/productos')
      .then(res => {
        if (Array.isArray(res.data)) {
          setProductos(res.data);
        } else {
          console.error("La respuesta de la API no es un array:", res.data);
          setProductos([]); // Evitar errores si la data no es un array
        }
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Nuestros Productos
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {productos.map((producto) => (
          <Grid item key={producto.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => console.log("Producto clickeado:", producto.nombre)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.imatgeurl || 'https://via.placeholder.com/300x200.png?text=No+Image'}
                  alt={producto.nombre}
                  sx={{ objectFit: 'contain', p: 1 }} // 'contain' para que se vea entera, padding opcional
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2, // Limita a 2 líneas
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3em' // Altura mínima para dos líneas
                  }}>
                    {producto.nombre || 'Nombre no disponible'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {producto.categoria || 'N/A'}
                  </Typography>
                  <Typography variant="h5" component="p" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
                    {typeof producto.precio === 'number' ? `${producto.precio.toFixed(2)}€` : 'Precio no disponible'}
                  </Typography>
                  <Typography variant="body2" color={producto.stock > 0 ? 'success.main' : 'error.main'}>
                    Stock: {producto.stock > 0 ? `${producto.stock} unidades` : 'Agotado'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ListaProductos;