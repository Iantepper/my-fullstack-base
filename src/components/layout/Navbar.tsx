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
        <Toolbar sx={{ py: 1 }}>
          {/* Logo con gradiente que combina con tu tema */}
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #8B5FBF 0%, #9D76C9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: '1.5rem'
            }}
          >
            Mentores Pro
          </Typography>

          {/* Botones con estilo premium dark */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{
                borderRadius: '8px',
                px: 2,
                py: 1,
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 95, 191, 0.15)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
                }
              }}
            >
              Inicio
            </Button>
            
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/mentors"
              sx={{
                borderRadius: '8px',
                px: 2,
                py: 1,
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(139, 95, 191, 0.15)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
                }
              }}
            >
              Mentores
            </Button>

            {currentUser ? (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/sessions"
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 95, 191, 0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
                    }
                  }}
                >
                  Agenda
                </Button>
                
                {/* Campanita de notificaciones */}
                <NotificationBell />
                
                {currentUser.role === 'mentor' && (
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/availability"
                    sx={{
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 95, 191, 0.15)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
                      }
                    }}
                  >
                    Disponibilidad
                  </Button>
                )}
                
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/profile"
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    backgroundColor: 'rgba(139, 95, 191, 0.1)',
                    border: '1px solid rgba(139, 95, 191, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 95, 191, 0.2)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(139, 95, 191, 0.3)',
                      border: '1px solid rgba(139, 95, 191, 0.5)'
                    }
                  }}
                >
                  {currentUser.name}
                </Button>
                
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(108, 117, 125, 0.3)',
                    color: '#94A3B8',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(108, 117, 125, 0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(108, 117, 125, 0.2)',
                      border: '1px solid rgba(108, 117, 125, 0.5)',
                      color: '#E2E8F0'
                    }
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/login"
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 95, 191, 0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(139, 95, 191, 0.2)'
                    }
                  }}
                >
                  Ingresar
                </Button>
                
                <Button 
                  variant="contained"
                  component={RouterLink} 
                  to="/register"
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #8B5FBF 0%, #6D3F99 100%)',
                    boxShadow: '0 4px 14px rgba(139, 95, 191, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9D76C9 0%, #7D4FB9 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(139, 95, 191, 0.5)'
                    }
                  }}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}