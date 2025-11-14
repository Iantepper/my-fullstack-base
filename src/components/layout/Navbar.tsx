import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService, User } from "../../services/authService";
import { NotificationBell } from "../notifications/NotificationBell";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mentores Pro
          </Typography>

          <Button color="inherit" component={RouterLink} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={RouterLink} to="/mentors">
            Mentores
          </Button>

          {currentUser ? (
            <>
              <Button color="inherit" component={RouterLink} to="/sessions">
                Agenda
              </Button>
              
              {/* ✅ AGREGAR CAMPANITA DE NOTIFICACIONES */}
              <NotificationBell />
              
              {currentUser.role === 'mentor' && (
                <Button color="inherit" component={RouterLink} to="/availability">
                  Mi Disponibilidad
                </Button>
              )}
              <Button color="inherit" component={RouterLink} to="/profile">
                Perfil ({currentUser.name})
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}