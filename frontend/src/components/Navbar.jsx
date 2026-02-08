import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Badge,
  IconButton,
  InputBase,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * TaskPlanet-style navigation bar
 * Features: search bar, notifications, points display, user avatar
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (!user) return null;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        color: '#2D3748',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo/Brand */}
        <Typography
          variant="h5"
          component="div"
          sx={{ 
            fontWeight: 800,
            cursor: 'pointer',
            color: '#2D3748',
            mr: 4,
          }}
          onClick={handleHomeClick}
        >
          Social
        </Typography>

        {/* Points Display */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mr: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: '#FFF4ED',
              border: '2px solid #FFB800',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF6B35' }}>
              50
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: '1.2rem',
              }}
            >
              🪙
            </Box>
          </Box>

          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: '20px',
              backgroundColor: '#E8F5E9',
              border: '2px solid #00D9A5',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#00B388' }}>
              $0.0000
            </Typography>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F7FAFC',
            borderRadius: '12px',
            px: 2,
            py: 0.5,
            maxWidth: '500px',
            mr: 2,
          }}
        >
          <InputBase
            placeholder="Search promotions, users, posts..."
            sx={{ 
              flex: 1,
              fontSize: '0.95rem',
              color: '#718096',
            }}
          />
          <IconButton 
            sx={{ 
              backgroundColor: '#0D7EFF',
              color: '#FFFFFF',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: '#0961CC',
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Notifications */}
          <IconButton>
            <Badge badgeContent={1} color="error">
              <NotificationsIcon sx={{ color: '#718096' }} />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <Avatar
            sx={{
              width: 45,
              height: 45,
              backgroundColor: '#0D7EFF',
              fontWeight: 700,
              cursor: 'pointer',
              border: '3px solid #FFFFFF',
              boxShadow: '0 0 0 2px #0D7EFF',
            }}
          >
            {user.username?.charAt(0).toUpperCase()}
          </Avatar>

          {/* Home Button */}
          <IconButton
            onClick={handleHomeClick}
            sx={{
              color: '#0D7EFF',
              backgroundColor: '#E3F2FD',
              '&:hover': {
                backgroundColor: '#BBDEFB',
              },
            }}
          >
            <HomeIcon />
          </IconButton>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: '#718096',
              '&:hover': {
                backgroundColor: '#F7FAFC',
                color: '#FF4757',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;