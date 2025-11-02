import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5FBF', // Púrpura elegante
      light: '#9D76C9',
      dark: '#6D3F99',
    },
    secondary: {
      main: '#6C757D', // Gris frío
      light: '#8A939B',
      dark: '#495057',
    },
    background: {
      default: '#0F0F1A', // Negro azulado muy oscuro
      paper: '#1A1A2E',   // Negro azulado para cards
    },
    text: {
      primary: '#E2E8F0', // Blanco grisáceo suave
      secondary: '#94A3B8', // Gris claro
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A14',
          backgroundImage: 'linear-gradient(135deg, #0A0A14 0%, #1A1A2E 100%)',
          boxShadow: '0 4px 20px rgba(139, 95, 191, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A2E',
          backgroundImage: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(139, 95, 191, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #8B5FBF 0%, #6D3F99 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9D76C9 0%, #7D4FB9 100%)',
            boxShadow: '0 8px 25px rgba(139, 95, 191, 0.3)',
          },
        },
        outlined: {
          borderColor: '#8B5FBF',
          color: '#8B5FBF',
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.1)',
            borderColor: '#9D76C9',
          },
        },
      },
    },
  },
});

export default theme;