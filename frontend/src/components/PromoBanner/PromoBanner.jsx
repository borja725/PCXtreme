import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export default function PromoBanner() {
  return (
    <Box sx={{
      width: '100%',
      py: { xs: 5, md: 8 },
      background: 'linear-gradient(90deg, #111827 60%, #1976d2 100%)',
      color: '#fff',
      mb: 3
    }}>
      <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: 1, lineHeight: 1.1 }}>
            ¡Ofertas Flash NVIDIA!
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)' }}>
            Hasta un <Box component="span" sx={{ color: '#1976d2', fontWeight: 900, fontSize: '1.4em', mx: 0.5 }}>-40%</Box> de descuento en productos seleccionados.
          </Typography>
          <Button variant="contained" size="large" sx={{ background: '#fff', color: '#1976d2', fontWeight: 700, borderRadius: 2, px: 4, '&:hover': { background: '#1976d2', color: '#fff' } }}>
            Ver ofertas
          </Button>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'right' }}>
          <img src="/logo.png" alt="PC Xtreme" style={{ width: 300, height: 250, opacity: 0.85 }} />
        </Box>
      </Container>
    </Box>
  );
}
