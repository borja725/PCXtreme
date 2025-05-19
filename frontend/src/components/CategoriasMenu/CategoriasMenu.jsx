import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TvIcon from '@mui/icons-material/Tv';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import MonitorIcon from '@mui/icons-material/Monitor';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';

const categorias = [
  { icon: <ComputerIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Ordenadores' },
  { icon: <LaptopChromebookIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Portátiles' },
  { icon: <PhoneIphoneIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Smartphones' },
  { icon: <SportsEsportsIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Videojuegos' },
  { icon: <TvIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Televisores' },
  { icon: <HeadphonesIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Sonido' },
  { icon: <MonitorIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Monitores' },
  { icon: <DevicesOtherIcon sx={{ fontSize: 40, color: '#1976d2' }} />, label: 'Periféricos' },
];

export default function CategoriasMenu() {
  return (
    <Box sx={{ width: '100%', py: 3, bgcolor: '#fff', mb: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {categorias.map((cat, i) => (
          <Grid item xs={6} sm={3} md={2} lg={1.5} key={cat.label}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #1976d2',
                borderRadius: 3,
                transition: 'box-shadow 0.2s, border 0.2s',
                cursor: 'pointer',
                width: 130,
                '&:hover': {
                  border: '2px solid #111827',
                  boxShadow: '0 4px 24px 0 rgba(25,118,210,0.15)',
                },
              }}
            >
              {cat.icon}
              <Typography sx={{ mt: 1, fontWeight: 700, color: '#111827', fontSize: 15, textAlign: 'center' }}>
                {cat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
