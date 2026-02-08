import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';

/**
 * TaskPlanet-inspired vibrant theme
 * Bold colors, modern gradients, and playful design
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D7EFF',
      light: '#4BA3FF',
      dark: '#0961CC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8C61',
      dark: '#E5512A',
    },
    success: {
      main: '#00D9A5',
      light: '#33E3B8',
      dark: '#00B388',
    },
    warning: {
      main: '#FFB800',
      light: '#FFC933',
      dark: '#CC9300',
    },
    error: {
      main: '#FF4757',
      light: '#FF6B79',
      dark: '#CC3946',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.05)',
    '0px 4px 12px rgba(0, 0, 0, 0.08)',
    '0px 6px 16px rgba(0, 0, 0, 0.1)',
    '0px 8px 20px rgba(0, 0, 0, 0.12)',
    '0px 10px 24px rgba(0, 0, 0, 0.14)',
    '0px 12px 28px rgba(0, 0, 0, 0.16)',
    '0px 14px 32px rgba(0, 0, 0, 0.18)',
    '0px 16px 36px rgba(0, 0, 0, 0.2)',
    ...Array(16).fill('0px 2px 8px rgba(0, 0, 0, 0.05)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(13, 126, 255, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F7FAFC',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(13, 126, 255, 0.4)',
            },
          },
        },
      },
    },
  },
});

/**
 * Main App component
 * TaskPlanet-inspired social media application
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;