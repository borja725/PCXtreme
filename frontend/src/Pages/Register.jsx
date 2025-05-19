import React from 'react';
import { Box, Button, TextField, Typography, Paper, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
const logoUrl = "../../public/logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', bgcolor: 'rgb(243,243,243)' }}>
      {/* Panel izquierdo: branding y ventajas */}
      <Box
        sx={{
          width: { xs: '0', md: '40%' },
          minWidth: 320,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%,rgb(0, 0, 0) 100%)',
          color: '#fff',
          p: 6,
        }}
      >
        <img src={logoUrl} alt="PC Xtreme" style={{ width: 100, scale: 5, marginBottom: 80, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          ¡Crea tu cuenta gratis!
        </Typography>
        <Box component="ul" sx={{ pl: 2, fontSize: 24, lineHeight: 2, listStyleType: 'none' }}>
          <li style={{ alignItems: 'center', justifyContent: 'center' }}><CheckIcon sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 10, color: '#1976d2', mr: 2 }} /> Accede a ofertas exclusivas y personalizadas.</li>
          <li style={{ alignItems: 'center', justifyContent: 'center' }}><CheckIcon sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 10, color: '#1976d2', mr: 2 }} />Consulta tu historial de compras.</li>
          <li style={{ alignItems: 'center', justifyContent: 'center' }}><CheckIcon sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 10, color: '#1976d2', mr: 2 }} /> Accede a compra de productos.</li>
          <li style={{ alignItems: 'center', justifyContent: 'center', height: 24}}><CheckIcon sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 10, color: '#1976d2', mr: 2 }} />Guarda tus configuraciones y listas.</li>
        </Box>
      </Box>
      {/* Panel derecho: formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fff',
        }}
      >
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, minWidth: 340, maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 700 }}>
            Crear cuenta
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, bgcolor: '#1976d2', fontWeight: 700, ':hover': { bgcolor: '#1251a3' } }} disabled={loading}>
              {loading ? "Cargando..." : "Registrarse"}
            </Button>
          </form>
          <Divider sx={{ my: 3 }}>o</Divider>
          <Button variant="outlined" fullWidth sx={{ mb: 2, borderColor: '#ff6600', color: '#ff6600', fontWeight: 700, ':hover': { bgcolor: '#fff4e6', borderColor: '#ff6600' } }}>
            Regístrate con Google
          </Button>
          <Typography sx={{ mt: 2, fontSize: 14, textAlign: 'center' }}>
            ¿Ya tienes cuenta?
            <Link href="#" onClick={() => navigate('/login')} sx={{ color: '#1976d2', fontWeight: 600, ml: 1 }}>
              Inicia sesión
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

