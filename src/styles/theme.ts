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
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#8B5FBF #1A1A2E",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#1A1A2E",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#8B5FBF",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#9D76C9",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#9D76C9",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#9D76C9",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A0A14',
          backgroundImage: 'linear-gradient(135deg, #0A0A14 0%, #1A1A2E 100%)',
          boxShadow: '0 4px 20px rgba(139, 95, 191, 0.1)',
          borderBottom: '1px solid rgba(139, 95, 191, 0.1)',
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
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'pulse' },
          style: {
            animation: 'pulseEffect 0.4s ease',
            '@keyframes pulseEffect': {
              '0%': { 
                transform: 'scale(1)',
                backgroundColor: '#8B5FBF',
              },
              '33%': { 
                transform: 'scale(1.12)',
                backgroundColor: '#B39DDB',
                color: '#4A1E8C',
              },
              '66%': { 
                transform: 'scale(1.08)',
                backgroundColor: '#9D76C9',
                color: 'white',
              },
              '100%': { 
                transform: 'scale(1)',
                backgroundColor: '#8B5FBF',
                color: 'white',
              }
            }
          },
        },
       // ✅ NUEVA VARIANTE MODERNA - "gradient"
      {
        props: { variant: 'gradient' },
        style: {
          background: 'linear-gradient(135deg, #8B5FBF 0%, #6D3F99 50%, #4A1E8C 100%)',
          backgroundSize: '200% 200%',
          border: 'none',
          color: 'white',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #9D76C9 0%, #7D4FB9 50%, #5D21D6 100%)',
            backgroundPosition: '100% 100%',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(139, 95, 191, 0.4)',
          },
        },
      },
      // ✅ NUEVA VARIANTE MODERNA - "neon"
      {
        props: { variant: 'neon' },
        style: {
          backgroundColor: 'transparent',
          border: '2px solid #8B5FBF',
          color: '#8B5FBF',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(139, 95, 191, 0.4), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.1)',
            boxShadow: '0 0 15px rgba(139, 95, 191, 0.5)',
            borderColor: '#9D76C9',
          },
        },
      },
      // ✅ NUEVA VARIANTE MODERNA - "soft"
      {
        props: { variant: 'soft' },
        style: {
          backgroundColor: 'rgba(139, 95, 191, 0.1)',
          border: '1px solid rgba(139, 95, 191, 0.2)',
          color: '#8B5FBF',
          backdropFilter: 'blur(10px)',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.2)',
            borderColor: 'rgba(139, 95, 191, 0.4)',
            transform: 'scale(1.02)',
          },
        },
      },
    ],
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          textTransform: 'none' as const,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5FBF 0%, #6D3F99 100%)',
          boxShadow: '0 4px 14px rgba(139, 95, 191, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9D76C9 0%, #7D4FB9 100%)',
            boxShadow: '0 8px 25px rgba(139, 95, 191, 0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderColor: '#8B5FBF',
          color: '#8B5FBF',
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.1)',
            borderColor: '#9D76C9',
            transform: 'translateY(-1px)',
          },
        },
        text: {
          color: '#8B5FBF',
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A1A2E',
          color: '#E2E8F0',
          border: '1px solid rgba(139, 95, 191, 0.3)',
          fontSize: '0.8rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          padding: '8px 12px',
        },
        arrow: {
          color: '#1A1A2E',
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(139, 95, 191, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 95, 191, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5FBF',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
          '&.Mui-focused': {
            color: '#8B5FBF',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(139, 95, 191, 0.5)',
          '&.Mui-checked': {
            color: '#8B5FBF',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#8B5FBF',
            '&:hover': {
              backgroundColor: 'rgba(139, 95, 191, 0.1)',
            },
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#8B5FBF',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(139, 95, 191, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A2E',
          border: '1px solid rgba(139, 95, 191, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(139, 95, 191, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(139, 95, 191, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(139, 95, 191, 0.3)',
            },
          },
        },
      },
    },
  },
});

export default theme;